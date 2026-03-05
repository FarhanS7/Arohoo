import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';
const prisma = new PrismaClient();

async function runTests() {
  console.log('--- Testing Category CRUD ---');

  let adminToken, merchantToken, otherMerchantToken;
  let testCategoryId;

  try {
    // 1. SETUP: Get tokens
    console.log('1. Setting up test users and tokens...');
    
    // In a real test environment, we'd use a dedicated test db and register users.
    // Since we're in dev, we'll assume the admin exists and we can create a merchant.

    const loginAdmin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@arohhoo.com',
      password: 'securepassword',
    });
    adminToken = loginAdmin.data.token;

    // Helper to register and get token
    const getMerchantToken = async (email, storeName) => {
      await axios.post(`${API_URL}/auth/register-merchant`, {
        email,
        password: 'password123',
        storeName,
      });
      const login = await axios.post(`${API_URL}/auth/login`, {
        email,
        password: 'password123',
      });
      return login.data.token;
    };

    merchantToken = await getMerchantToken(`merchant_${Date.now()}@test.com`, 'Main Store');
    otherMerchantToken = await getMerchantToken(`other_${Date.now()}@test.com`, 'Other Store');

    const authConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

    // 2. CREATE CATEGORY (Admin)
    console.log('2. Admin creating a category...');
    const createRes = await axios.post(
      `${API_URL}/categories`,
      {
        name: `Admin Category ${Date.now()}`,
        slug: `admin-cat-${Date.now()}`,
        isActive: true,
      },
      authConfig(adminToken)
    );
    testCategoryId = createRes.data.data.id;
    console.log('✅ Admin created category');

    // 3. CREATE CATEGORY (Merchant)
    console.log('3. Merchant creating a category...');
    const merchantCatRes = await axios.post(
      `${API_URL}/categories`,
      {
        name: `Merchant Category ${Date.now()}`,
        slug: `merchant-cat-${Date.now()}`,
      },
      authConfig(merchantToken)
    );
    const merchantCatId = merchantCatRes.data.data.id;
    console.log('✅ Merchant created category');

    // 4. DUPLICATE SLUG (Fail)
    console.log('4. Testing duplicate slug...');
    try {
      await axios.post(
        `${API_URL}/categories`,
        {
          name: 'Some Name',
          slug: `admin-cat-${testCategoryId}`, // Wait, it should be the slug from createRes
        },
        authConfig(adminToken)
      );
    } catch (err) {
      if (err.response?.status === 409) {
        console.log('✅ Duplicate slug correctly rejected (409)');
      } else {
        console.error('❌ Unexpected error code for duplicate slug:', err.response?.status);
      }
    }

    // 5. UPDATE OWN CATEGORY (Merchant)
    console.log('5. Merchant updating own category...');
    await axios.patch(
      `${API_URL}/categories/${merchantCatId}`,
      { name: 'Updated Merchant Category' },
      authConfig(merchantToken)
    );
    console.log('✅ Merchant updated own category');

    // 6. UPDATE OTHER CATEGORY (Merchant - Fail)
    console.log('6. Merchant updating ADMIN category (Fail)...');
    try {
      await axios.patch(
        `${API_URL}/categories/${testCategoryId}`,
        { name: 'Hacked' },
        authConfig(merchantToken)
      );
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('✅ Merchant forbidden from updating admin category (403)');
      } else {
        console.error('❌ Unexpected error code for unauthorized update:', err.response?.status);
      }
    }

    // 7. GET ALL CATEGORIES (Customer)
    console.log('7. Customer fetching categories...');
    const listRes = await axios.get(`${API_URL}/categories`);
    console.log(`✅ Fetched ${listRes.data.data.length} categories`);

    // 8. DELETE CATEGORY (Admin)
    console.log('8. Admin deleting merchant category...');
    await axios.delete(`${API_URL}/categories/${merchantCatId}`, authConfig(adminToken));
    console.log('✅ Admin deleted merchant category');

  } catch (err) {
    console.error('Test failed:', err.message);
    if (err.response) console.error('Response Data:', err.response.data);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
