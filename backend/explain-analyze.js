#!/usr/bin/env node
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false }
});

async function runExplainAnalyze() {
  const client = await pool.connect();

  try {
    console.log('🔍 EXPLAIN ANALYZE AUDIT - NEON DATABASE');
    console.log('='.repeat(100));
    console.log(`Database: ${process.env.DIRECT_URL.split('/').pop().split('?')[0]}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('='.repeat(100));

    // Query 1: Product FTS Search
    console.log('\n\n📌 QUERY #1: Product FTS Search');
    console.log('File: product.repository.js:162');
    console.log('Function: searchProducts()');
    console.log('-'.repeat(100));

    const query1 = `
EXPLAIN ANALYZE
SELECT p.id,
       ts_rank_cd(
         setweight(to_tsvector('english', COALESCE(p.name, '')), 'A') ||
         setweight(to_tsvector('english', COALESCE(p.description, '')), 'C'),
         websearch_to_tsquery('english', 'shirt')
       ) AS rank,
       similarity(p.name, 'shirt') AS similarity
FROM products p
LEFT JOIN categories c ON p."categoryId" = c.id
WHERE
  (
    (setweight(to_tsvector('english', COALESCE(p.name, '')), 'A') ||
     setweight(to_tsvector('english', COALESCE(c.name, '')), 'B') ||
     setweight(to_tsvector('english', COALESCE(p.description, '')), 'C'))
    @@ websearch_to_tsquery('english', 'shirt')
  )
  OR similarity(p.name, 'shirt') > 0.2
  OR similarity(c.name, 'shirt') > 0.4
ORDER BY rank DESC, similarity DESC
LIMIT 20 OFFSET 0
    `;

    console.log('EXECUTING...\n');

    const result1 = await client.query(query1);
    console.log('EXECUTION PLAN & TIMING:');
    result1.rows.forEach((row, idx) => {
      console.log(row['QUERY PLAN'] || Object.values(row)[0]);
    });

    // Query 2: Merchant FTS Search
    console.log('\n\n📌 QUERY #2: Merchant FTS Search with EXISTS');
    console.log('File: merchant.service.js:180');
    console.log('Function: getPublicMerchants()');
    console.log('-'.repeat(100));

    const query2 = `
EXPLAIN ANALYZE
SELECT m.id,
       ts_rank_cd(
         setweight(to_tsvector('english', COALESCE(m."storeName", '')), 'A') ||
         setweight(to_tsvector('english', COALESCE(m.description, '')), 'B'),
         websearch_to_tsquery('english', 'fashion')
       ) AS rank,
       similarity(m."storeName", 'fashion') AS similarity
FROM merchants m
WHERE
  m."isApproved" = true AND
  (
    (setweight(to_tsvector('english', COALESCE(m."storeName", '')), 'A') ||
     setweight(to_tsvector('english', COALESCE(m.description, '')), 'B'))
    @@ websearch_to_tsquery('english', 'fashion')
    OR similarity(m."storeName", 'fashion') > 0.2
    OR EXISTS (
      SELECT 1 FROM products p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p."merchantId" = m.id AND
      (
        (to_tsvector('english', COALESCE(p.name, '')) ||
         to_tsvector('english', COALESCE(p.description, '')) ||
         to_tsvector('english', COALESCE(c.name, '')))
        @@ websearch_to_tsquery('english', 'fashion')
        OR similarity(p.name, 'fashion') > 0.3
        OR similarity(c.name, 'fashion') > 0.4
      )
    )
  )
ORDER BY rank DESC, similarity DESC
LIMIT 20 OFFSET 0
    `;

    console.log('EXECUTING...\n');

    const result2 = await client.query(query2);
    console.log('EXECUTION PLAN & TIMING:');
    result2.rows.forEach((row) => {
      console.log(row['QUERY PLAN'] || Object.values(row)[0]);
    });

    // Query 3: Admin getAllProducts (unoptimized)
    console.log('\n\n📌 QUERY #3: Admin getAllProducts (No Pagination - WORST CASE)');
    console.log('File: admin.service.js:295');
    console.log('Function: getAllProducts()');
    console.log('-'.repeat(100));

    const query3 = `
EXPLAIN ANALYZE
SELECT p.id, p.name, p."basePrice", p."merchantId", p."categoryId"
FROM products p
LEFT JOIN merchants m ON p."merchantId" = m.id
LEFT JOIN categories c ON p."categoryId" = c.id
LEFT JOIN product_images pi ON p.id = pi."productId"
ORDER BY p."createdAt" DESC
    `;

    console.log('EXECUTING...\n');

    const result3 = await client.query(query3);
    console.log('EXECUTION PLAN & TIMING:');
    result3.rows.forEach((row) => {
      console.log(row['QUERY PLAN'] || Object.values(row)[0]);
    });

    // Query 4: Dashboard Stats (no time window)
    console.log('\n\n📌 QUERY #4: Merchant Dashboard Stats (No Time Window)');
    console.log('File: merchant.service.js:28');
    console.log('Function: getMerchantDashboardStats()');
    console.log('-'.repeat(100));

    const query4 = `
EXPLAIN ANALYZE
SELECT SUM(subtotal) as total_revenue,
       SUM(quantity) as total_sales,
       COUNT(*) as total_items
FROM order_items
WHERE merchantId = (SELECT id FROM merchants LIMIT 1)
  AND status != 'CANCELLED'
    `;

    console.log('EXECUTING...\n');

    const result4 = await client.query(query4);
    console.log('EXECUTION PLAN & TIMING:');
    result4.rows.forEach((row) => {
      console.log(row['QUERY PLAN'] || Object.values(row)[0]);
    });

    // Get table stats
    console.log('\n\n' + '='.repeat(100));
    console.log('📊 DATABASE STATISTICS');
    console.log('='.repeat(100));

    const statsQuery = `
SELECT
  schemaname,
  tablename,
  n_live_tup as "live_rows",
  n_dead_tup as "dead_rows",
  round(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as "dead_ratio_%"
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
    `;

    console.log('\nTable Row Counts:');
    const statsResult = await client.query(statsQuery);
    statsResult.rows.forEach(row => {
      console.log(`  ${row.tablename}: ${row.live_rows} rows (${row.dead_rows} dead)`);
    });

    // Index stats
    console.log('\n\nActive Indexes:');
    const indexQuery = `
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as "scans",
  idx_tup_read as "tuples_read",
  idx_tup_fetch as "tuples_fetched"
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 15;
    `;

    const indexResult = await client.query(indexQuery);
    indexResult.rows.forEach(row => {
      console.log(`  ${row.indexname}: ${row.scans} scans, ${row.tuples_fetched} rows fetched`);
    });

    console.log('\n✅ Analysis complete');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Cannot connect to database. Check DATABASE_URL/DIRECT_URL in .env');
    }
  } finally {
    await client.release();
    await pool.end();
  }
}

runExplainAnalyze();
