import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { io } from '../index'; // io is exported in index.ts
import { authMiddleware } from '../middlewares/auth.middleware';

interface AuthContext {
  id: string;
  role: string;
}

const prisma = new PrismaClient();
const ticketsRoutes = new Hono<{ Variables: { user: AuthContext } }>();

// Get Ticket Details by ID (For Customer)
ticketsRoutes.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user') as AuthContext;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true
          }
        },
        category: {
          include: {
            event: true
          }
        },
        seat: true
      }
    });

    if (!ticket) {
      return c.json({ success: false, message: 'Tiket tidak ditemukan' }, 404);
    }

    // Optional: add ownership check here if needed
    // if (user.role === 'CUSTOMER' && ticket.order.customerId !== user.id) ...

    const formattedTicket = {
      id: ticket.id,
      ticketCode: ticket.ticketCode,
      seatNumber: ticket.seat?.seatNumber || null,
      categoryName: ticket.category.name,
      status: ticket.status,
      order: {
        customerName: ticket.order.customer.fullName,
        eventTitle: ticket.category.event.title,
        venueName: ticket.category.event.venueName,
        eventDate: ticket.category.event.eventDate
      }
    };

    return c.json({ success: true, data: formattedTicket });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Check-in Ticket (Scanner Gate) - Protected by authMiddleware (Admin/Superadmin)
ticketsRoutes.put('/checkin', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthContext;
    if (user.role === 'CUSTOMER') {
      return c.json({ success: false, message: 'Forbidden' }, 403);
    }

    const body = await c.req.json();
    const ticketCode = body.ticketCode;

    if (!ticketCode) {
      return c.json({ success: false, message: 'Kode tiket harus disertakan' }, 400);
    }

    const ticket = await prisma.ticket.findUnique({
      where: { ticketCode },
      include: { 
        order: { include: { customer: { select: { fullName: true } } } },
        seat: { select: { seatNumber: true, category: { select: { name: true } } } }
      }
    });

    if (!ticket) {
      return c.json({ success: false, message: 'Tiket palsu atau tidak ditemukan di sistem' }, 404);
    }

    if (ticket.status === 'CHECKED_IN') {
      return c.json({ success: false, message: `Tiket sudah di-scan sebelumnya pada ${ticket.checkedInAt ? ticket.checkedInAt.toLocaleString('id-ID') : 'waktu yang tidak diketahui'}` }, 400);
    }

    if (ticket.status !== 'ACTIVE') {
      return c.json({ success: false, message: `Status tiket tidak valid (${ticket.status})` }, 400);
    }

    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { 
        status: 'CHECKED_IN',
        checkedInAt: new Date(),
        checkedInByAdmin: user.id
      },
      include: { 
        order: { include: { customer: { select: { fullName: true } } } },
        seat: { select: { seatNumber: true, category: { select: { name: true } } } },
        category: { include: { event: true } }
      }
    });

    const formattedTicket = {
      ...updatedTicket,
      order: { customerName: updatedTicket.order?.customer?.fullName || 'Unknown' },
      seat: updatedTicket.seat,
      event: updatedTicket.category?.event
    };

    // Emit real-time notification to admin dashboard
    io.emit('ticket_scanned', formattedTicket);

    return c.json({
      success: true,
      message: `Berhasil check-in untuk kursi ${ticket.seat?.seatNumber || 'Festival'}`,
      ticket: formattedTicket
    });
  } catch (error: any) {
    console.error('Checkin error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default ticketsRoutes;
