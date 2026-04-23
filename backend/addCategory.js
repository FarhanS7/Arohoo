import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 
async function main() { 
  const cat = await prisma.category.create({ 
    data: { name: 'Perfume', slug: 'perfume', displayOrder: 10 } 
  }); 
  console.log('Created:', cat); 
} 
main().catch(console.error).finally(()=>prisma.$disconnect());
