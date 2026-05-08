import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Applying search indexes (Products & Merchants)...');
  
  try {
    // 1. Enable pg_trgm
    console.log('Enabling pg_trgm extension...');
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    // 2. Create Product Search Indexes
    console.log('Creating Product Search Indexes...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS products_search_idx ON "products" USING GIN (
        (setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
         setweight(to_tsvector('english', COALESCE(description, '')), 'B'))
      );
    `);
    await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON "products" USING GIN (name gin_trgm_ops);');

    // 3. Create Merchant Search Indexes
    console.log('Creating Merchant Search Indexes...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS merchants_search_idx ON "merchants" USING GIN (
        (setweight(to_tsvector('english', COALESCE("storeName", '')), 'A') ||
         setweight(to_tsvector('english', COALESCE(description, '')), 'B'))
      );
    `);
    await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS merchants_name_trgm_idx ON "merchants" USING GIN ("storeName" gin_trgm_ops);');

    console.log('✅ Search indexes applied successfully!');
  } catch (error) {
    console.error('❌ Error applying search indexes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
