const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany({ include: { ticketCategories: true } });
  console.log(JSON.stringify(events.map(e => ({
    title: e.title,
    isSeated: e.isSeated,
    categories: e.ticketCategories.map(c => c.name)
  })), null, 2));
}

main().finally(() => prisma.$disconnect());
