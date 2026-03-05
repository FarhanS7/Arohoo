import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCategory() {
  console.log('--- Testing Category Model ---');

  const timestamp = Date.now();
  const categoryName = `Test Category ${timestamp}`;
  const categorySlug = `test-category-${timestamp}`;

  try {
    // 1. Create category
    console.log('1. Creating a new category...');
    const newCategory = await prisma.category.create({
      data: {
        name: categoryName,
        slug: categorySlug,
        imageUrl: 'http://example.com/image.png',
        displayOrder: 10,
        isActive: true,
      },
    });
    console.log('✅ Category created:', newCategory.name);

    // 2. Duplicate slug validation
    console.log('2. Testing duplicate slug validation...');
    try {
      await prisma.category.create({
        data: {
          name: `Another Name ${timestamp}`,
          slug: categorySlug, // Duplicate slug
        },
      });
      console.log('❌ Error: Duplicate slug should have failed.');
    } catch (error) {
      console.log('✅ Success: Duplicate slug failed as expected.');
    }

    // 3. Duplicate name validation (restored @unique)
    console.log('3. Testing duplicate name validation...');
    try {
      await prisma.category.create({
        data: {
          name: categoryName, // Duplicate name
          slug: `different-slug-${timestamp}`,
        },
      });
      console.log('❌ Error: Duplicate name should have failed.');
    } catch (error) {
      console.log('✅ Success: Duplicate name failed as expected.');
    }

    // 4. Inactive category
    console.log('4. Creating an inactive category...');
    const inactiveCategory = await prisma.category.create({
      data: {
        name: `Inactive ${timestamp}`,
        slug: `inactive-${timestamp}`,
        isActive: false,
      },
    });
    console.log('✅ Inactive category created:', inactiveCategory.isActive === false);

    // Cleanup
    console.log('Cleaning up test data...');
    await prisma.category.deleteMany({
      where: {
        OR: [
          { slug: categorySlug },
          { slug: `inactive-${timestamp}` }
        ]
      }
    });

  } catch (error) {
    console.error('Test suite failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCategory();
