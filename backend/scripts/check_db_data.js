import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  const userCount = await prisma.user.count();
  const merchantCount = await prisma.merchant.count();

  console.log(`Categories: ${categoryCount}`);
  console.log(`Products: ${productCount}`);
  console.log(`Users: ${userCount}`);
  console.log(`Merchants: ${merchantCount}`);

  if (categoryCount > 0) {
    const categories = await prisma.category.findMany();
    console.log('Existing Categories:', categories);
  }

  await prisma.$disconnect();
}

checkData().catch(e => {
  console.error(e);
  process.exit(1);
});
