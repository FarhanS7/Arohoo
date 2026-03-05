import NodeCache from 'node-cache';

// Initialize cache with 5 minute default TTL
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Cache utility for simple key-value storage.
 */
export const cacheUtil = {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => cache.set(key, value, ttl),
  delete: (key) => cache.del(key),
  flush: () => cache.flushAll(),
};

export default cache;
