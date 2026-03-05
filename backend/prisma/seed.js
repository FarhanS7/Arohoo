import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed categories
  const categories = [
    { name: 'Men', slug: 'men' },
    { name: 'Women', slug: 'women' },
    { name: 'Kids', slug: 'kids' },
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Skincare', slug: 'skincare' }
  ];

  console.log('Seeding categories...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { name: category.name, slug: category.slug },
    });
  }

  // 2. Seed default admin
  const adminEmail = 'admin@arohhoo.com';
  const adminPassword = 'securepassword';

  console.log('Seeding default admin...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await argon2.hash(adminPassword);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN
      }
    });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log('Admin account already exists.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
