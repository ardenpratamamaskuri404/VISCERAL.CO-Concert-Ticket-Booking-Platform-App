import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { io } from '../index'; // io is exported in index.ts

const prisma = new PrismaClient();
const ticketsRoutes = new Hono();

// Check-in Ticket (Scanner Gate)
ticketsRoutes.put('/checkin', async (c) => {
  try {
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
      return c.json({ success: false, message: `Tiket sudah di-scan sebelumnya pada ${ticket.updatedAt.toLocaleString('id-ID')}` }, 400);
    }

    if (ticket.status !== 'ACTIVE') {
      return c.json({ success: false, message: `Status tiket tidak valid (${ticket.status})` }, 400);
    }

    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'CHECKED_IN' },
      include: { 
        order: { include: { customer: { select: { fullName: true } } } },
        seat: { select: { seatNumber: true, category: { select: { name: true } } } }
      }
    });

    const formattedTicket = {
      ...updatedTicket,
      order: { customerName: ticket.order?.customer?.fullName || 'Unknown' },
      seat: ticket.seat
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
