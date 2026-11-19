import { prisma } from '../config/db';

class CheckoutValidationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Melepaskan otomatis order PENDING & kursi LOCKED yang melewati batas waktu 5 menit.
 * Mengembalikan jumlah order/kursi yang berhasil dilepas agar caller dapat memancarkan update real-time.
 */
export async function releaseExpiredLocks(): Promise<{ expiredOrders: number; releasedSeats: number }> {
  const now = new Date();

  return await prisma.$transaction(async (tx) => {
    const expiredOrders = await tx.order.findMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: now },
      },
      include: { tickets: true },
    });

    let releasedSeats = 0;

    for (const ord of expiredOrders) {
      await tx.order.update({
        where: { id: ord.id },
        data: { status: 'EXPIRED' },
      });

      await tx.ticket.updateMany({
        where: { orderId: ord.id },
        data: { status: 'CANCELLED' },
      });

      const seatIds = ord.tickets.map((t) => t.seatId).filter((id): id is string => Boolean(id));
      if (seatIds.length > 0) {
        const res = await tx.seat.updateMany({
          where: { id: { in: seatIds }, status: 'LOCKED' },
          data: { status: 'AVAILABLE', lockedUntil: null, lockedByUserId: null },
        });
        releasedSeats += res.count;
      }
    }

    // Bersihkan juga kursi LOCKED yatim yang lockedUntil-nya sudah lewat
    const orphanRelease = await tx.seat.updateMany({
      where: {
        status: 'LOCKED',
        lockedUntil: { lt: now },
      },
      data: {
        status: 'AVAILABLE',
        lockedUntil: null,
        lockedByUserId: null,
      },
    });
    releasedSeats += orphanRelease.count;

    return {
      expiredOrders: expiredOrders.length,
      releasedSeats,
    };
  });
}

export const calculateOrderCheckout = async (eventId: string, tickets: any[]) => {
  // Pastikan lock yang sudah lewat 5 menit dilepas terlebih dahulu sebelum rebutan kursi baru
  await releaseExpiredLocks().catch((err) => {
    console.warn('releaseExpiredLocks pre-check error:', err);
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date();
      const lockExpiry = new Date(now.getTime() + 5 * 60 * 1000); // 5 menit

      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event) throw new CheckoutValidationError('Event tidak ditemukan', 404);
      if (event.salesClosed) throw new CheckoutValidationError('Penjualan telah ditutup', 400);

      // Validasi kuota untuk kategori Standing
      if (!event.isSeated) {
        const categoryCounts: Record<string, number> = {};
        for (const t of tickets) {
          categoryCounts[t.categoryId] = (categoryCounts[t.categoryId] || 0) + 1;
        }

        for (const catId of Object.keys(categoryCounts)) {
          const category = await tx.ticketCategory.findUnique({ where: { id: catId } });
          if (!category) throw new CheckoutValidationError('Kategori tidak valid', 400);

          const activeCount = await tx.ticket.count({
            where: { categoryId: catId, status: 'ACTIVE', order: { status: 'PAID' } },
          });

          const pendingCount = await tx.ticket.count({
            where: {
              categoryId: catId,
              order: { status: 'PENDING', expiresAt: { gt: now } },
            },
          });

          const available = category.totalSeats - (activeCount + pendingCount);
          if (available < categoryCounts[catId]) {
            throw new CheckoutValidationError(
              `Kuota ${category.name} tidak mencukupi (sisa ${Math.max(0, available)})`,
              409
            );
          }
        }
      }

      let totalAmount = 0;
      const processedTickets: any[] = [];
      const lockedSeats: any[] = [];

      const orderNumber = `VSC-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      for (const t of tickets) {
        const category = await tx.ticketCategory.findUnique({ where: { id: t.categoryId } });
        if (!category) throw new CheckoutValidationError('Kategori tidak valid', 400);

        if (category.salesStartDate && now < category.salesStartDate) {
          throw new CheckoutValidationError(`Penjualan ${category.name} belum dimulai`, 400);
        }
        if (category.salesEndDate && now > category.salesEndDate) {
          throw new CheckoutValidationError(`Penjualan ${category.name} sudah berakhir`, 400);
        }

        let activePrice = Number(category.price);
        if (category.earlyBirdPrice && category.earlyBirdStartDate && category.earlyBirdEndDate) {
          if (now >= category.earlyBirdStartDate && now <= category.earlyBirdEndDate) {
            activePrice = Number(category.earlyBirdPrice);
          }
        }
        totalAmount += activePrice;

        const catNameLower = category.name.toLowerCase();
        const isStandingCategory =
          catNameLower.includes('standing') ||
          catNameLower.includes('festival') ||
          catNameLower.includes('general') ||
          catNameLower.includes('presale') ||
          catNameLower.includes('pass') ||
          catNameLower.includes('ga');

        if (event.isSeated && !isStandingCategory) {
          if (!t.seatNumber) {
            throw new CheckoutValidationError(
              `Nomor kursi wajib dipilih untuk kategori ${category.name}`,
              400
            );
          }

          let seat = await tx.seat.findFirst({
            where: { categoryId: t.categoryId, seatNumber: t.seatNumber },
          });

          if (!seat) {
            seat = await tx.seat.create({
              data: { categoryId: t.categoryId, seatNumber: t.seatNumber, status: 'AVAILABLE' },
            });
          }

          // Atomic conditional lock: hanya berhasil jika kursi AVAILABLE atau lock-nya sudah expired
          const lockAttempt = await tx.seat.updateMany({
            where: {
              id: seat.id,
              OR: [
                { status: 'AVAILABLE' },
                { status: 'LOCKED', lockedUntil: { lt: now } },
              ],
            },
            data: {
              status: 'LOCKED',
              lockedUntil: lockExpiry,
            },
          });

          if (lockAttempt.count === 0) {
            throw new CheckoutValidationError(
              `Kursi ${t.seatNumber} tidak lagi tersedia karena telah dipilih atau dibeli oleh pengunjung lain. Silakan pilih kursi lain yang masih tersedia.`,
              409
            );
          }

          const updatedSeat = await tx.seat.findUnique({ where: { id: seat.id } });
          if (updatedSeat) lockedSeats.push(updatedSeat);

          processedTickets.push({
            categoryId: t.categoryId,
            seatId: seat.id,
            ticketCode: `QR-${orderNumber}-${t.seatNumber}`,
            status: 'ACTIVE',
          });
        } else {
          processedTickets.push({
            categoryId: t.categoryId,
            ticketCode: `QR-${orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'ACTIVE',
          });
        }
      }

      return { orderNumber, totalAmount, processedTickets, lockedSeats, error: null };
    });

    return result;
  } catch (err: any) {
    if (err instanceof CheckoutValidationError) {
      return { error: err.message, code: err.statusCode };
    }
    throw err;
  }
};
