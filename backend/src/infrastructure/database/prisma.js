import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' }
  ]
});

// Track slow queries (>100ms)
const slowQueries = [];

prisma.$on('query', (e) => {
  if (e.duration > 100) {
    slowQueries.push({
      query: e.query.substring(0, 100),
      duration: e.duration,
      params: e.params.substring(0, 50),
      timestamp: new Date().toISOString()
    });

    // Log to console
    console.log(`[SLOW_QUERY] ${e.duration}ms - ${e.query.substring(0, 80)}...`);
  }
});

// Expose slow queries for monitoring
if (typeof global !== 'undefined') {
  global.__slowQueries = slowQueries;
}

export default prisma;
