import { prisma } from '../config/db';

export const calculateOrderCheckout = async (eventId: string, tickets: any[]) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return { error: 'Event tidak ditemukan', code: 404 };
  if (event.salesClosed) return { error: 'Penjualan telah ditutup', code: 400 };

  // Group tickets by category for Standing quota check
  if (!event.isSeated) {
    const categoryCounts: Record<string, number> = {};
    for (const t of tickets) {
      categoryCounts[t.categoryId] = (categoryCounts[t.categoryId] || 0) + 1;
    }

    for (const catId of Object.keys(categoryCounts)) {
      const category = await prisma.ticketCategory.findUnique({ where: { id: catId } });
      if (!category) return { error: 'Kategori tidak valid', code: 400 };

      const activeCount = await prisma.ticket.count({
        where: { categoryId: catId, status: 'ACTIVE' }
      });
      
      const pendingCount = await prisma.ticket.count({
        where: { categoryId: catId, order: { status: 'PENDING', expiresAt: { gt: new Date() } } }
      });

      const available = category.totalSeats - (activeCount + pendingCount);
      if (available < categoryCounts[catId]) {
        return { error: `Kuota ${category.name} tidak mencukupi (sisa ${available})`, code: 400 };
      }
    }
  }

  let totalAmount = 0;
  const processedTickets: any[] = [];
  const lockedSeats: any[] = [];

  const orderNumber = `VSC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  for (const t of tickets) {
    const category = await prisma.ticketCategory.findUnique({ where: { id: t.categoryId } });
    if (!category) return { error: 'Kategori tidak valid', code: 400 };

    // Early Bird Check
    const now = new Date();
    if (category.salesStartDate && now < category.salesStartDate) {
      return { error: `Penjualan ${category.name} belum dimulai`, code: 400 };
    }
    if (category.salesEndDate && now > category.salesEndDate) {
      return { error: `Penjualan ${category.name} sudah berakhir`, code: 400 };
    }

    let activePrice = Number(category.price);
    if (category.earlyBirdPrice && category.earlyBirdStartDate && category.earlyBirdEndDate) {
      if (now >= category.earlyBirdStartDate && now <= category.earlyBirdEndDate) {
        activePrice = Number(category.earlyBirdPrice);
      }
    }
    totalAmount += activePrice;

    if (event.isSeated) {
      if (!t.seatNumber) return { error: 'Nomor kursi wajib dipilih', code: 400 };
      
      let seat = await prisma.seat.findFirst({
        where: { categoryId: t.categoryId, seatNumber: t.seatNumber }
      });

      if (!seat) {
        seat = await prisma.seat.create({
          data: { categoryId: t.categoryId, seatNumber: t.seatNumber, status: 'AVAILABLE' }
        });
      }

      if (seat.status !== 'AVAILABLE') {
        for (const s of lockedSeats) {
          await prisma.seat.update({ where: { id: s.id }, data: { status: 'AVAILABLE', lockedUntil: null } });
        }
        return { error: `Kursi ${t.seatNumber} sudah tidak tersedia`, code: 400 };
      }

      const lockedSeat = await prisma.seat.update({
        where: { id: seat.id },
        data: { status: 'LOCKED', lockedUntil: new Date(Date.now() + 5 * 60 * 1000) }
      });
      lockedSeats.push(lockedSeat);

      processedTickets.push({
        categoryId: t.categoryId,
        seatId: lockedSeat.id,
        ticketCode: `QR-${orderNumber}-${t.seatNumber}`,
        status: 'ACTIVE'
      });
    } else {
      processedTickets.push({
        categoryId: t.categoryId,
        ticketCode: `QR-${orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'ACTIVE'
      });
    }
  }

  return { orderNumber, totalAmount, processedTickets, lockedSeats, error: null };
};
