import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed categories
  const categories = [
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Kids', slug: 'kids' },
    { name: 'Female', slug: 'female' },
    { name: 'Mens', slug: 'mens' },
    { name: 'Skincare', slug: 'skincare' },
    { name: 'Shoes', slug: 'shoes' }
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

  // 3. Seed default merchant
  const merchantEmail = 'merchant@arohhoo.com';
  const merchantPassword = 'securepassword';
  const storeName = 'Arohoo Official Store';

  console.log('Seeding default merchant...');

  const existingMerchantUser = await prisma.user.findUnique({
    where: { email: merchantEmail },
    include: { merchant: true }
  });

  if (!existingMerchantUser) {
    const hashedPassword = await argon2.hash(merchantPassword);
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: merchantEmail,
          password: hashedPassword,
          role: Role.MERCHANT
        }
      });

      await tx.merchant.create({
        data: {
          storeName,
          userId: newUser.id,
          isApproved: true,
          status: 'APPROVED'
        }
      });
    });
    console.log(`Merchant account created: ${merchantEmail}`);
  } else {
    console.log('Merchant account already exists.');
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
