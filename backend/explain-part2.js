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
    // Query 4: Dashboard Stats
    console.log('\n📌 QUERY #4: Merchant Dashboard Stats (No Time Window)');
    console.log('File: merchant.service.js:28');
    console.log('Function: getMerchantDashboardStats()');
    console.log('-'.repeat(100));

    const merchantResult = await client.query("SELECT id FROM merchants LIMIT 1");
    const merchantId = merchantResult.rows[0]?.id;

    if (merchantId) {
      const query4 = `
EXPLAIN ANALYZE
SELECT SUM("subtotal") as total_revenue,
       SUM(quantity) as total_sales,
       COUNT(*) as total_items
FROM order_items
WHERE "merchantId" = '${merchantId}'
  AND status != 'CANCELLED'
      `;

      console.log('EXECUTING...\n');
      const result4 = await client.query(query4);
      result4.rows.forEach((row) => {
        console.log(Object.values(row)[0]);
      });
    }

    // Table stats
    console.log('\n\n' + '='.repeat(100));
    console.log('📊 DATABASE STATISTICS');
    console.log('='.repeat(100));

    const statsQuery = `
SELECT
  tablename,
  n_live_tup as "live_rows",
  n_dead_tup as "dead_rows",
  round(pg_total_relation_size(schemaname||'.'||tablename)::numeric / 1024 / 1024, 2) as "size_mb"
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
    `;

    console.log('\nTable Row Counts & Sizes:');
    const statsResult = await client.query(statsQuery);
    statsResult.rows.forEach(row => {
      console.log(`  ${row.tablename.padEnd(25)}: ${String(row.live_rows).padStart(8)} rows | ${String(row.size_mb).padStart(6)} MB`);
    });

    // Index stats
    console.log('\n\nIndex Usage Stats (Top 10):');
    const indexQuery = `
SELECT
  tablename,
  indexname,
  idx_scan as "scans",
  idx_tup_read as "tuples_read",
  idx_tup_fetch as "tuples_fetched"
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 10;
    `;

    const indexResult = await client.query(indexQuery);
    indexResult.rows.forEach(row => {
      console.log(`  ${row.indexname.padEnd(40)}: ${String(row.scans).padStart(6)} scans, ${String(row.tuples_fetched).padStart(8)} rows fetched`);
    });

    console.log('\n✅ Analysis complete');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.release();
    await pool.end();
  }
}

runExplainAnalyze();
