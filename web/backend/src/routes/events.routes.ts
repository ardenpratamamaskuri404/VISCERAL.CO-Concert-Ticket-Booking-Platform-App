import fs from 'fs/promises';
import path from 'path';
import { Hono } from 'hono';
import { prisma } from '../config/db';
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

    if (!title || !venueName || !eventDate || !categories || !categories.length) {
      return c.json({ error: 'Title, venueName, eventDate, and categories are required' }, 400);
    }

    let bannerUrl = null;
    if (bannerFile) {
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
        ticketCategories: true
      }
    });

    if (newEvent.isSeated) {
      for (const cat of newEvent.ticketCategories) {
        const seatsData = [];
        for (let i = 1; i <= cat.totalSeats; i++) {
          seatsData.push({
            id: `seat-${cat.id}-${i}`,
            categoryId: cat.id,
            seatNumber: `S${i}`
          });
        }
        await prisma.seat.createMany({ data: seatsData });
      }
    }

    return c.json({ success: true, message: 'Event berhasil ditambahkan', data: newEvent }, 201);
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
    const body = await c.req.parseBody();
    
    const title = body['title'] as string;
    const venueName = body['venueName'] as string;
    const description = body['description'] as string;
    const eventDateStr = body['eventDate'] as string;
    const bannerFile = body['bannerFile'] as File;

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

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(venueName && { venueName }),
        ...(description && { description }),
        ...(eventDateStr && { eventDate: new Date(eventDateStr) }),
        ...(bannerUrl && { bannerUrl })
      }
    });

    return c.json({ success: true, message: 'Event berhasil diperbarui', data: updatedEvent }, 200);
  } catch (error) {
    console.error('Error updating event:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default eventsRoutes;
