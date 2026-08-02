import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.ticketCategory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.eventArtist.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('AdminVisceral123!', 10);
  const admin = await prisma.user.create({
    data: {
      id: 'usr-admin-1',
      email: 'admin@visceral.co',
      password: adminPassword,
      fullName: 'Superadmin VISCERAL.CO',
      role: 'SUPERADMIN',
    },
  });

  // 2. Create Artists
  const artists = [
    { id: 'art-01', name: 'Slank', bio: 'Legenda rock Indonesia.' },
    { id: 'art-02', name: 'Dewa 19', bio: 'Band rock legendaris Indonesia.' },
    { id: 'art-03', name: 'Sheila On 7', bio: 'Band pop asal Yogyakarta.' },
    { id: 'art-04', name: 'Coldplay', bio: 'Band asal Inggris.' },
    { id: 'art-05', name: 'Tulus', bio: 'Penyanyi pria top Indonesia.' },
    { id: 'art-06', name: 'Nadin Amizah', bio: 'Penyanyi indie Indonesia.' },
  ];
  for (const a of artists) {
    await prisma.artist.create({ data: a });
  }

  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setMonth(today.getMonth() + 2);
  
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 10);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // 3. Create Events
  const evtStanding = await prisma.event.create({
    data: {
      id: 'evt-standing-1',
      title: 'VISCERAL FESTIVAL 2026: THE RESONANCE',
      description: 'Konser rock terbesar tahun 2026.',
      venueName: 'Gelora Bung Karno Stadium, Jakarta',
      eventDate: futureDate,
      status: 'PUBLISHED',
      salesClosed: false,
      isSeated: false,
      createdById: admin.id,
      artists: {
        create: [
          { artistId: 'art-01', isHeadliner: true },
          { artistId: 'art-02', isHeadliner: false },
        ]
      },
      ticketCategories: {
        create: [
          {
            id: 'tc-std-1',
            name: 'VIP Standing',
            price: 1500000.00,
            totalSeats: 100,
          },
          {
            id: 'tc-std-2',
            name: 'Festival',
            price: 750000.00,
            totalSeats: 500,
          },
          {
            id: 'tc-std-3', // Early bird active
            name: 'Early Bird',
            price: 500000.00,
            totalSeats: 100,
            salesStartDate: pastDate,
            salesEndDate: nextWeek, 
          },
          {
            id: 'tc-std-4', // Early bird expired
            name: 'Super Early Bird',
            price: 300000.00,
            totalSeats: 100,
            salesStartDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
            salesEndDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), 
          }
        ]
      }
    }
  });

  const evtSeated = await prisma.event.create({
    data: {
      id: 'evt-seated-1',
      title: 'Sheila On 7: Tunggu Aku di Jakarta',
      description: 'Malam nostalgia dan magis bersama Sheila On 7.',
      venueName: 'Jakarta International Stadium (JIS)',
      eventDate: futureDate,
      status: 'PUBLISHED',
      salesClosed: false,
      isSeated: true,
      createdById: admin.id,
      artists: {
        create: [
          { artistId: 'art-03', isHeadliner: true }
        ]
      }
    }
  });

  // Create Categories for Seated
  const cat1 = await prisma.ticketCategory.create({
    data: { id: 'tc-seat-1', eventId: evtSeated.id, name: 'CAT 1', price: 2500000, totalSeats: 100 }
  });
  const cat2 = await prisma.ticketCategory.create({
    data: { id: 'tc-seat-2', eventId: evtSeated.id, name: 'CAT 2', price: 1500000, totalSeats: 200 }
  });

  // Generate Dummy Seats for Seated Event
  const generateSeats = async (categoryId: string, rows: string[], cols: number) => {
    for (const row of rows) {
      for (let i = 1; i <= cols; i++) {
        await prisma.seat.create({
          data: {
            categoryId,
            seatNumber: `${row}${i}`,
            status: 'AVAILABLE'
          }
        });
      }
    }
  };

  await generateSeats(cat1.id, ['A', 'B'], 10);
  await generateSeats(cat2.id, ['C', 'D'], 20);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
