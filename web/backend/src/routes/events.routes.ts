import fs from 'fs/promises';
import path from 'path';
import { Hono } from 'hono';
import { prisma } from '../config/db';
import { io } from '../index';
import { authMiddleware } from '../middlewares/auth.middleware';

const eventsRoutes = new Hono<{ Variables: { user: any } }>();

// Helper to calculate available quota and Early Bird validity
async function processEventCategories(event: any) {
  const now = new Date();
  
  const categories = await Promise.all(event.ticketCategories.map(async (cat: any) => {
    // 1. Check Early Bird Validity
    let isSalesClosed = false;
    if (cat.salesStartDate && now < new Date(cat.salesStartDate)) isSalesClosed = true;
    if (cat.salesEndDate && now > new Date(cat.salesEndDate)) isSalesClosed = true;

    // 2. Calculate Available Quota
    // Active (SOLD) tickets
    const activeCount = await prisma.ticket.count({
      where: { categoryId: cat.id, status: 'ACTIVE' }
    });
    
    // Locked (PENDING) tickets
    const pendingCount = await prisma.ticket.count({
      where: { categoryId: cat.id, order: { status: 'PENDING', expiresAt: { gt: now } } }
    });

    let availableSeats = cat.totalSeats - (activeCount + pendingCount);
    if (availableSeats < 0) availableSeats = 0;
    
    // For seating events, we fetch all reserved/sold seats and map them
    let seats = [];
    if (event.isSeated) {
      const dbSeats = await prisma.seat.findMany({
        where: { categoryId: cat.id }
      });
      
      const dbSeatsMap = new Map<string, any>(dbSeats.map((s: any) => [s.seatNumber, s]));

      // Generate all seats based on totalSeats for UI grid
      for (let i = 1; i <= cat.totalSeats; i++) {
        const seatNumber = `S-${i}`;
        if (dbSeatsMap.has(seatNumber)) {
          seats.push(dbSeatsMap.get(seatNumber));
        } else {
          seats.push({
            id: `virtual-${cat.id}-${seatNumber}`,
            categoryId: cat.id,
            seatNumber: seatNumber,
            status: 'AVAILABLE'
          });
        }
      }
    }

    return {
      ...cat,
      availableSeats,
      isSalesClosed,
      seats // Empty for standing
    };
  }));

  return {
    ...event,
    categories
  };
}

// GET all events
eventsRoutes.get('/', async (c) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        ticketCategories: true,
        artists: {
          include: {
            artist: true
          }
        }
      },
      orderBy: {
        eventDate: 'asc'
      }
    });
    
    const mappedEvents = await Promise.all(events.map(processEventCategories));

    return c.json({ data: mappedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// GET single event by id
eventsRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketCategories: true,
        artists: {
          include: {
            artist: true
          }
        }
      }
    });

    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    const mappedEvent = await processEventCategories(event);

    return c.json({ data: mappedEvent });
  } catch (error) {
    console.error('Error fetching event:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});



// POST create new event (Admin only)
eventsRoutes.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Unauthorized. Admin role required.' }, 403);
    }

    const body = await c.req.parseBody();
    const title = body['title'] as string;
    const venueName = body['venueName'] as string;
    const description = body['description'] as string;
    const eventDate = body['eventDate'] as string;
    const isSeated = body['isSeated'] === 'true' || String(body['isSeated']) === 'true';
    let categories;
    try {
      categories = typeof body['categories'] === 'string' ? JSON.parse(body['categories'] as string) : body['categories'];
    } catch(e) {
      return c.json({ error: 'Invalid categories format' }, 400);
    }
    const bannerFile = body['bannerFile'] as File;
    let parsedArtists: Array<{ artistId: string; isHeadliner?: boolean }> = [];
    if (body['artistIds']) {
      try {
        const rawArtists = typeof body['artistIds'] === 'string'
          ? JSON.parse(body['artistIds'] as string)
          : body['artistIds'];
        if (Array.isArray(rawArtists)) {
          parsedArtists = rawArtists
            .map((item: any, idx: number) =>
              typeof item === 'string'
                ? { artistId: item, isHeadliner: idx === 0 }
                : { artistId: item.artistId, isHeadliner: Boolean(item.isHeadliner) }
            )
            .filter((item) => Boolean(item.artistId));
        }
      } catch (e) {
        return c.json({ error: 'Invalid artistIds format' }, 400);
      }
    }

    if (!title || !venueName || !eventDate || !categories || !categories.length) {
      return c.json({ error: 'Title, venueName, eventDate, and categories are required' }, 400);
    }

    let bannerUrl = null;
    if (bannerFile && bannerFile.name) {
      const ext = path.extname(bannerFile.name) || '.jpg';
      const filename = `evt-${Date.now()}${ext}`;
      const arrayBuffer = await bannerFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filepath = path.join(process.cwd(), 'public', 'assets', 'events', filename);
      await fs.writeFile(filepath, buffer);
      bannerUrl = filename;
    }

    const newEventId = `evt-${Date.now()}`;

    const newEvent = await prisma.event.create({
      data: {
        id: newEventId,
        title,
        venueName,
        description,
        eventDate: new Date(eventDate),
        bannerUrl: bannerUrl,
        status: 'PUBLISHED',
        salesClosed: false,
        isSeated: isSeated,
        createdById: user.id,
        ...(parsedArtists.length > 0 && {
          artists: {
            create: parsedArtists.map((a) => ({
              artistId: a.artistId,
              isHeadliner: Boolean(a.isHeadliner),
            })),
          },
        }),
        ticketCategories: {
          create: categories.map((cat: any, idx: number) => ({
            id: `tc-${newEventId}-${idx + 1}`,
            name: cat.name,
            price: Number(cat.price),
            totalSeats: Number(cat.totalSeats),
            salesStartDate: cat.salesStartDate ? new Date(cat.salesStartDate) : null,
            salesEndDate: cat.salesEndDate ? new Date(cat.salesEndDate) : null,
            earlyBirdPrice: cat.earlyBirdPrice ? Number(cat.earlyBirdPrice) : null,
            earlyBirdStartDate: cat.earlyBirdStartDate ? new Date(cat.earlyBirdStartDate) : null,
            earlyBirdEndDate: cat.earlyBirdEndDate ? new Date(cat.earlyBirdEndDate) : null,
          }))
        }
      },
      include: {
        ticketCategories: true,
        artists: {
          include: { artist: true }
        }
      }
    });

    if (newEvent.isSeated) {
      for (const cat of newEvent.ticketCategories) {
        const seatsData = [];
        for (let i = 1; i <= cat.totalSeats; i++) {
          seatsData.push({
            id: `seat-${cat.id}-${i}`,
            categoryId: cat.id,
            seatNumber: `S-${i}`
          });
        }
        await prisma.seat.createMany({ data: seatsData });
      }
    }

    const mappedEvent = await processEventCategories(newEvent);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE_EVENT',
        entityId: newEvent.id,
        metadata: { title: newEvent.title, venueName: newEvent.venueName }
      }
    }).catch(() => {});

    io.emit('events_updated', { action: 'create', eventId: newEvent.id });
    io.emit('audit_logs_updated');

    return c.json({ success: true, message: 'Event berhasil ditambahkan', data: mappedEvent }, 201);
  } catch (error) {
    console.error('Error creating event:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Edit Event
eventsRoutes.put('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Unauthorized. Admin role required.' }, 403);
    }
    const id = c.req.param('id');
    if (!id) return c.json({ error: 'Invalid event ID' }, 400);
    const body = await c.req.parseBody();
    
    const title = body['title'] as string;
    const venueName = body['venueName'] as string;
    const description = body['description'] as string;
    const eventDateStr = body['eventDate'] as string;
    const bannerFile = body['bannerFile'] as File;

    let parsedArtists: Array<{ artistId: string; isHeadliner?: boolean }> | null = null;
    if (body['artistIds'] !== undefined) {
      try {
        const rawArtists = typeof body['artistIds'] === 'string'
          ? JSON.parse(body['artistIds'] as string)
          : body['artistIds'];
        if (Array.isArray(rawArtists)) {
          parsedArtists = rawArtists
            .map((item: any, idx: number) =>
              typeof item === 'string'
                ? { artistId: item, isHeadliner: idx === 0 }
                : { artistId: item.artistId, isHeadliner: Boolean(item.isHeadliner) }
            )
            .filter((item) => Boolean(item.artistId));
        }
      } catch (e) {
        return c.json({ error: 'Invalid artistIds format' }, 400);
      }
    }

    let bannerUrl = undefined;
    if (bannerFile && bannerFile.name) {
      const ext = path.extname(bannerFile.name) || '.jpg';
      const filename = `evt-${Date.now()}${ext}`;
      const arrayBuffer = await bannerFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filepath = path.join(process.cwd(), 'public', 'assets', 'events', filename);
      await fs.writeFile(filepath, buffer);
      bannerUrl = filename;
    }

    if (parsedArtists !== null) {
      await prisma.eventArtist.deleteMany({ where: { eventId: id } });
      if (parsedArtists.length > 0) {
        await prisma.eventArtist.createMany({
          data: parsedArtists.map((a) => ({
            eventId: id,
            artistId: a.artistId,
            isHeadliner: Boolean(a.isHeadliner),
          })),
          skipDuplicates: true,
        });
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(venueName && { venueName }),
        ...(description && { description }),
        ...(eventDateStr && { eventDate: new Date(eventDateStr) }),
        ...(bannerUrl && { bannerUrl })
      },
      include: {
        ticketCategories: true,
        artists: {
          include: { artist: true }
        }
      }
    });

    const mappedEvent = await processEventCategories(updatedEvent);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE_EVENT',
        entityId: id,
        metadata: { title: updatedEvent.title }
      }
    }).catch(() => {});

    io.emit('events_updated', { action: 'update', eventId: id });
    io.emit('audit_logs_updated');

    return c.json({ success: true, message: 'Event berhasil diperbarui', data: mappedEvent }, 200);
  } catch (error) {
    console.error('Error updating event:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Toggle Sales Closed (Admin & Superadmin)
eventsRoutes.patch('/:id/sales-closed', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Unauthorized. Admin role required.' }, 403);
    }

    const id = c.req.param('id');
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: 'Event tidak ditemukan' }, 404);
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { salesClosed: !existing.salesClosed },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'TOGGLE_SALES_CLOSED',
        entityId: id,
        metadata: { eventId: id, title: existing.title, salesClosed: updated.salesClosed }
      }
    }).catch(() => {});

    io.emit('events_updated', { action: 'toggle_sales', eventId: id, salesClosed: updated.salesClosed });
    io.emit('audit_logs_updated');

    return c.json({
      success: true,
      message: updated.salesClosed ? 'Penjualan event ditutup sementara' : 'Penjualan event dibuka kembali',
      data: updated
    });
  } catch (error) {
    console.error('Error toggling salesClosed:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Delete Event (Admin & Superadmin)
eventsRoutes.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return c.json({ error: 'Unauthorized. Admin role required.' }, 403);
    }

    const id = c.req.param('id');
    const existing = await prisma.event.findUnique({
      where: { id },
      include: { ticketCategories: true }
    });
    if (!existing) {
      return c.json({ error: 'Event tidak ditemukan' }, 404);
    }

    const catIds = existing.ticketCategories.map((tc) => tc.id);
    if (catIds.length > 0) {
      const soldTickets = await prisma.ticket.count({
        where: { categoryId: { in: catIds } }
      });
      if (soldTickets > 0) {
        return c.json(
          { error: 'Event tidak dapat dihapus karena sudah memiliki tiket terjual. Gunakan tombol Tutup Penjualan.' },
          400
        );
      }
    }

    if (existing.bannerUrl && !existing.bannerUrl.startsWith('http')) {
      try {
        await fs.unlink(path.join(process.cwd(), 'public', 'assets', 'events', existing.bannerUrl));
      } catch (e) {}
    }

    await prisma.event.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DELETE_EVENT',
        entityId: id,
        metadata: { title: existing.title }
      }
    }).catch(() => {});

    io.emit('events_updated', { action: 'delete', eventId: id });
    io.emit('audit_logs_updated');

    return c.json({ success: true, message: 'Event berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default eventsRoutes;
