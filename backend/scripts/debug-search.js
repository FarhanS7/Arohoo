import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const merchants = await prisma.merchant.findMany({
    select: {
      id: true,
      storeName: true,
      description: true
    }
  });
  console.log('--- Merchants ---');
  console.log(JSON.stringify(merchants, null, 2));
  
  const query = 'perfume';
  const rawResults = await prisma.$queryRaw`
    SELECT id, "storeName",
           ts_rank_cd(
             setweight(to_tsvector('english', COALESCE("storeName", '')), 'A') ||
             setweight(to_tsvector('english', COALESCE(description, '')), 'B'),
             websearch_to_tsquery('english', ${query})
           ) AS rank,
           similarity("storeName", ${query}) AS similarity
    FROM merchants
    WHERE 
      (
        (setweight(to_tsvector('english', COALESCE("storeName", '')), 'A') ||
         setweight(to_tsvector('english', COALESCE(description, '')), 'B'))
        @@ websearch_to_tsquery('english', ${query})
      )
      OR similarity("storeName", ${query}) > 0.2
  `;
  console.log('\n--- Search Results for "men" ---');
  console.log(JSON.stringify(rawResults, null, 2));
}

main().finally(() => prisma.$disconnect());
