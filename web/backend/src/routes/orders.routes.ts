import { Hono } from 'hono';
import { prisma } from '../config/db';
import crypto from 'crypto-js';
import { io } from '../index';
import { authMiddleware } from '../middlewares/auth.middleware';
import { calculateOrderCheckout } from '../services/order.service';
import { createDokuPayment } from '../services/doku.service';
import { createNotification } from './notifications.routes';

const ordersRoutes = new Hono<{ Variables: { user: any } }>();

// Ambil riwayat pesanan (Untuk fitur Tiket Saya)
ordersRoutes.get('/', async (c) => {
  try {
    // Idealnya ambil dari auth token (c.get('user')), tapi sementara ambil semua order untuk demo atau filter via query
    const customerId = c.req.query('customerId');
    
    let whereClause = {};
    if (customerId) {
      whereClause = { customerId };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: true, // INCLUDE CUSTOMER DATA
        tickets: {
          include: {
            seat: true,
            category: {
              include: { event: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transformasi format agar sesuai dengan ekspektasi Frontend (eventTitle, categoryName, dsb)
    // Karena kita tidak menyimpan eventTitle di Order, kita perlu merelasikannya. 
    // Wait, Ticket -> Seat -> Category -> Event
    const formattedOrders = await Promise.all(orders.map(async (ord) => {
      let eventTitle = 'Unknown Event';
      let eventId = null;
      let venueName = '';
      let eventDate = '';

      if (ord.tickets.length > 0 && ord.tickets[0].category && ord.tickets[0].category.event) {
        const event = ord.tickets[0].category.event;
        eventTitle = event.title;
        eventId = event.id;
        venueName = event.venueName;
        eventDate = event.eventDate.toISOString();
      }

      return {
        ...ord,
        customerName: ord.customer?.fullName || 'Unknown Customer',
        customerEmail: ord.customer?.email || 'Unknown Email',
        totalAmount: Number(ord.totalAmount),
        eventId,
        eventTitle,
        venueName,
        eventDate,
        tickets: ord.tickets.map(t => ({
          id: t.id,
          ticketCode: t.ticketCode,
          seatNumber: t.seat?.seatNumber || 'Festival (Tanpa Kursi)',
          categoryName: t.category?.name || 'Unknown',
          status: t.status
        }))
      };
    }));

    return c.json({ data: formattedOrders });
  } catch (error) {
    console.error('Get Orders Error:', error);
    return c.json({ error: 'Gagal memuat pesanan' }, 500);
  }
});

// Get Order by ID
ordersRoutes.get('/:id', async (c) => {
  try {
    const orderId = c.req.param('id');
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        tickets: {
          include: {
            seat: true,
            category: { include: { event: true } }
          }
        }
      }
    });

    if (!order) return c.json({ error: 'Pesanan tidak ditemukan' }, 404);

    let eventTitle = 'Unknown Event';
    let venueName = '';
    let eventDate = '';
    if (order.tickets.length > 0 && order.tickets[0].category && order.tickets[0].category.event) {
      const event = order.tickets[0].category.event;
      eventTitle = event.title;
      venueName = event.venueName;
      eventDate = event.eventDate.toISOString();
    }

    const formattedOrder = {
      ...order,
      customerName: order.customer?.fullName || 'Unknown',
      eventTitle,
      venueName,
      eventDate,
      tickets: order.tickets.map(t => ({
        id: t.id,
        ticketCode: t.ticketCode,
        seatNumber: t.seat?.seatNumber || 'Festival (Tanpa Kursi)',
        categoryName: t.category?.name || 'Unknown',
        status: t.status
      }))
    };

    return c.json({ data: formattedOrder });
  } catch (error) {
    console.error('Get Order By ID Error:', error);
    return c.json({ error: 'Gagal memuat detail pesanan' }, 500);
  }
});

// Return URL dari Payment Gateway (Mencegah blank screen di Vite karena POST request)
ordersRoutes.all('/return/:id', (c) => {
  const orderId = c.req.param('id');
  return c.redirect(`http://localhost:5173/payment-proof/${orderId}`);
});

// Checkout & Request Doku Payment URL
ordersRoutes.post('/checkout', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { eventId, customerName, customerEmail, tickets, paymentMethod } = body;
    
    // Get customerId from authenticated user if not in body
    const user = c.get('user');
    const customerId = body.customerId || user?.id;

    if (!customerId) {
      return c.json({ success: false, message: 'ID Pelanggan tidak ditemukan' }, 400);
    }
    
    if (!tickets || tickets.length === 0 || tickets.length > 5) {
      return c.json({ success: false, message: 'Jumlah tiket tidak valid (1-5)' }, 400);
    }

    // Logika perhitungan order dipindah ke service
    const checkoutResult = await calculateOrderCheckout(eventId, tickets);
    if (checkoutResult.error) {
      return c.json({ success: false, message: checkoutResult.error }, checkoutResult.code as any);
    }

    const { orderNumber, totalAmount, processedTickets } = checkoutResult;

    let mappedPaymentMethod = 'DOKU_VA'; // Default gateway
    let paymentChannel = paymentMethod || 'DOKU_CHECKOUT';

    if (paymentMethod === 'MANUAL_TRANSFER') mappedPaymentMethod = 'MANUAL_TRANSFER';
    else if (paymentMethod === 'DOKU_QRIS') mappedPaymentMethod = 'DOKU_QRIS';
    else if (['MANDIRI_VA', 'BCA_VA', 'BRI_VA', 'BNI_VA', 'DOKU_VA'].includes(paymentMethod)) mappedPaymentMethod = 'DOKU_VA';
    else if (['SHOPEEPAY', 'OVO', 'DANA'].includes(paymentMethod)) mappedPaymentMethod = 'DOKU_EWALLET';

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber!,
        customerId,
        totalAmount: totalAmount!,
        status: 'PENDING',
        paymentMethod: mappedPaymentMethod as any,
        paymentChannel,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 menit
        tickets: {
          create: processedTickets
        }
      },
      include: { tickets: true }
    });

    let dokuUrl = null;
    if (mappedPaymentMethod !== 'MANUAL_TRANSFER') {
      const dokuRes = await createDokuPayment(order, Number(totalAmount));
      if (dokuRes.success) {
        dokuUrl = dokuRes.paymentUrl;
      }
    }

    return c.json({
      success: true,
      message: 'Berhasil membuat pesanan',
      order,
      paymentUrl: dokuUrl
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mobile Return URL (Menampilkan halaman HTML sederhana agar user bisa menutup WebBrowser)
ordersRoutes.all('/mobile-return/:id', (c) => {
  return c.html(`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { background: #14110F; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; padding: 20px; margin: 0; }
          .icon { font-size: 50px; margin-bottom: 20px; }
          h2 { color: #C89B3C; margin-bottom: 10px; }
          p { color: #A0A0A0; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="icon">✅</div>
        <h2>Transaksi Diproses</h2>
        <p>Pembayaran Anda sedang kami konfirmasi dengan DOKU.</p>
        <p>Silakan tekan tombol <b>Done</b> atau <b>X</b> di pojok layar untuk menutup halaman ini dan kembali ke aplikasi.</p>
      </body>
    </html>
  `);
});

// Generate Doku URL on demand
ordersRoutes.post('/:id/generate-doku', authMiddleware, async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json().catch(() => ({})); // Parse body safely
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return c.json({ success: false, message: 'Pesanan tidak ditemukan' }, 404);

    // If mobile sends a direct deep link returnUrl, use it. Otherwise fallback to the HTML bridge page.
    const mobileCallbackUrl = body.returnUrl || `${process.env.API_URL || 'https://wisdom-detection-uncharted.ngrok-free.dev'}/api/orders/mobile-return/${order.id}`;

    const dokuRes = await createDokuPayment(order, Number(order.totalAmount), mobileCallbackUrl);
    if (dokuRes.success) {
      return c.json({ success: true, dokuUrl: dokuRes.paymentUrl });
    } else {
      return c.json({ success: false, message: dokuRes.message }, 500);
    }
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Doku Webhook Callback (Dipanggil oleh server Doku)
ordersRoutes.post('/doku-webhook', async (c) => {
  try {
    const requestIdHeader = c.req.header('Request-Id');
    const bodyText = await c.req.text();
    const bodyJson = JSON.parse(bodyText);

    if (bodyJson.order && bodyJson.order.invoice_number) {
      const invoice = bodyJson.order.invoice_number;
      const originalInvoice = invoice.split('_R')[0];

      const order = await prisma.order.findUnique({
        where: { orderNumber: originalInvoice },
        include: { tickets: true }
      });

      if (order && order.status === 'PENDING') {
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            status: 'PAID',
            dokuReferenceId: bodyJson.transaction?.doku_transaction_id || requestIdHeader,
            paymentChannel: bodyJson.transaction?.channel || 'DOKU_CHECKOUT'
          }
        });

        for (const ticket of order.tickets) {
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: { status: 'ACTIVE' }
          });
          
          if (ticket.seatId) {
            await prisma.seat.update({
              where: { id: ticket.seatId },
              data: { status: 'SOLD', lockedByUserId: order.customerId }
            });
          }
        }

        // Create notification for all admins
        const admins = await prisma.user.findMany({
          where: { role: { in: ['ADMIN', 'SUPERADMIN'] } }
        });
        if (admins.length > 0) {
          await prisma.notification.createMany({
            data: admins.map(admin => ({
              userId: admin.id,
              title: 'Pesanan Lunas',
              message: `Pesanan ${order.orderNumber} telah dibayar senilai Rp ${Number(order.totalAmount).toLocaleString('id-ID')}`,
              type: 'ORDER'
            }))
          });
        }

        io.emit('order_paid', order);
        io.emit('new_notification');
        return c.json({ message: 'OK' }, 200);
      }
    }

    return c.json({ message: 'OK' }, 200);
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// DEV ONLY: Endpoint untuk simulasi pembayaran berhasil (bypass DOKU Webhook)
ordersRoutes.post('/:id/simulate-pay', async (c) => {
  try {
    const orderId = c.req.param('id');
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { tickets: true }
    });

    if (order && order.status === 'PENDING') {
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'PAID',
          dokuReferenceId: 'SIMULATED_DOKU_ID',
          paymentChannel: 'SIMULATION'
        }
      });

      for (const ticket of order.tickets) {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: 'ACTIVE' }
        });
        
        if (ticket.seatId) {
          await prisma.seat.update({
            where: { id: ticket.seatId },
            data: { status: 'SOLD', lockedByUserId: order.customerId }
          });
        }
      }

      // Reload order with updated status
      const updatedOrder = await prisma.order.findUnique({ where: { id: orderId } });
      io.emit('order_paid', updatedOrder);
      
      return c.json({ success: true, message: 'Simulasi Lunas Berhasil' });
    }
    return c.json({ success: false, message: 'Order sudah lunas atau tidak ditemukan' }, 400);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Manual Approve Order (Oleh Admin)
ordersRoutes.put('/:id/approve', async (c) => {
  try {
    const orderId = c.req.param('id');
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { tickets: true }
    });

    if (!order) return c.json({ success: false, message: 'Pesanan tidak ditemukan' }, 404);

    if (order.status === 'PENDING') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' }
      });

      for (const ticket of order.tickets) {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: 'ACTIVE' }
        });
        
        if (ticket.seatId) {
          await prisma.seat.update({
            where: { id: ticket.seatId },
            data: { status: 'SOLD', lockedByUserId: order.customerId }
          });
        }
      }

      // Create notification for all admins
      const admins = await prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPERADMIN'] } }
      });
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map(admin => ({
            userId: admin.id,
            title: 'Pesanan Lunas',
            message: `Pesanan ${order.orderNumber} telah dibayar senilai Rp ${Number(order.totalAmount).toLocaleString('id-ID')}`,
            type: 'ORDER'
          }))
        });
      }

      io.emit('order_paid', order);
      io.emit('new_notification');
      return c.json({ success: true, message: 'Pesanan berhasil disetujui (PAID)' });
    }

    return c.json({ success: false, message: 'Pesanan sudah lunas atau dibatalkan' }, 400);
  } catch (error: any) {
    console.error('Approve error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Mock Upload Proof Endpoint
ordersRoutes.put('/:id/proof', async (c) => {
  try {
    const orderId = c.req.param('id');
    const body = await c.req.json();
    
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentProof: body.proofUrl }
    });
    
    return c.json({ success: true, message: 'Bukti diunggah' });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Request Refund by Customer
ordersRoutes.post('/:id/refund', authMiddleware, async (c) => {
  try {
    const orderId = c.req.param('id');
    const user = c.get('user');
    const { reason } = await c.req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.customerId !== user.id) {
      return c.json({ success: false, message: 'Pesanan tidak valid' }, 400);
    }

    if (order.status !== 'PAID') {
      return c.json({ success: false, message: 'Hanya pesanan PAID yang bisa di-refund' }, 400);
    }

    // Buat refund request
    const refund = await prisma.refund.create({
      data: {
        orderId: order.id,
        reason: reason || 'Permintaan customer'
      }
    });

    // Notify Admins
    await createNotification(
      'Request Refund Baru',
      `User ${user.fullName} meminta refund untuk Order ${order.orderNumber}`,
      'REFUND',
      ['ADMIN', 'SUPERADMIN']
    );

    return c.json({ success: true, refund });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default ordersRoutes;


