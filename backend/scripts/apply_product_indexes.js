import getPrisma from '../src/infrastructure/database/prisma.js';

const prisma = getPrisma();

async function main() {
  console.log('--- Applying Product Search Indexes ---');
  
  try {
    // 1. GIN search index on name and description
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_products_search 
      ON products 
      USING GIN (to_tsvector('english', name || ' ' || description));
    `);
    console.log('✅ Created GIN search index: idx_products_search');

    // 2. Verify other indexes are there (Prisma should have done these but let's be sure)
    // idx_products_merchant, idx_products_category, idx_products_status
    // These are handled by Prisma's @@index in schema.prisma + db push
    
    console.log('Done!');
  } catch (error) {
    console.error('Error applying indexes:', error);
  } finally {
    process.exit();
  }
}

main();
