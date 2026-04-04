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
  
  /**
   * Deletes all keys matching a specific prefix.
   * Useful for invalidating related groups of cached data.
   */
  delByPrefix: (prefix) => {
    const keys = cache.keys();
    const keysToDelete = keys.filter(k => k.startsWith(prefix));
    if (keysToDelete.length > 0) {
      cache.del(keysToDelete);
    }
    return keysToDelete.length;
  },

  /**
   * Generates a consistent cache key for a given model and ID/params.
   */
  generateKey: (model, identifier) => {
    const suffix = typeof identifier === 'object' 
      ? JSON.stringify(identifier) 
      : identifier;
    return `${model}:${suffix}`;
  },

  flush: () => cache.flushAll(),
};

export default cache;
