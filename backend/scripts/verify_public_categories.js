import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

async function verifyPublicCategories() {
  console.log('--- Verifying Public Category API ---');

  try {
    // 1. Fetch categories
    console.log('1. Fetching public categories...');
    const start = Date.now();
    const res = await axios.get(`${API_URL}/public/categories`);
    const duration = Date.now() - start;

    if (res.data.success) {
      console.log(`✅ Successfully fetched ${res.data.data.length} categories in ${duration}ms`);
      
      // 2. Check for product counts
      const hasProductCount = res.data.data.every(cat => typeof cat.productCount === 'number');
      if (hasProductCount) {
        console.log('✅ All categories have productCount');
      } else {
        console.error('❌ Missing productCount in some categories');
      }

      // 3. Test Caching
      console.log('2. Testing cache (second request)...');
      const start2 = Date.now();
      const res2 = await axios.get(`${API_URL}/public/categories`);
      const duration2 = Date.now() - start2;

      console.log(`Second request took ${duration2}ms`);
      if (duration2 < duration) {
        console.log('✅ Caching is likely working (faster response)');
      } else {
        console.log('ℹ️ Second request was not significantly faster (might be local network variability)');
      }

      // 4. Log a category for SEO check
      if (res.data.data.length > 0) {
        const cat = res.data.data[0];
        console.log('SEO Check (Sample Category):', {
          name: cat.name,
          slug: cat.slug,
          imageUrl: cat.imageUrl,
          productCount: cat.productCount
        });
      }

    } else {
      console.error('❌ API returned failure:', res.data.error);
    }

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    if (err.response) {
      console.error('Response Error:', err.response.data);
    }
  }
}

verifyPublicCategories();
