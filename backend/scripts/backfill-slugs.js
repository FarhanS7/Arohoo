import { PrismaClient } from '@prisma/client';
import { slugify } from '../src/common/utils/slugify.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting backfill for merchant slugs...');
  
  const merchants = await prisma.merchant.findMany({
    where: { slug: null }
  });

  console.log(`Found ${merchants.length} merchants without a slug.`);

  for (const merchant of merchants) {
    let slug = slugify(merchant.storeName);
    
    // Ensure uniqueness
    let existing = await prisma.merchant.findFirst({ where: { slug } });
    let counter = 1;
    while (existing && existing.id !== merchant.id) {
      slug = `${slugify(merchant.storeName)}-${counter}`;
      existing = await prisma.merchant.findFirst({ where: { slug } });
      counter++;
    }

    await prisma.merchant.update({
      where: { id: merchant.id },
      data: { slug }
    });
    
    console.log(`Updated merchant ${merchant.id} with slug: ${slug}`);
  }

  console.log('Backfill complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
