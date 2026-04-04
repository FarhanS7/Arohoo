const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const orders = await prisma.order.findMany({ take: 1 });
    console.log('Order schema looks OK');
    console.log('Columns:', Object.keys(orders[0] || {}));
  } catch (e) {
    console.error('Schema Sync Failed:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
