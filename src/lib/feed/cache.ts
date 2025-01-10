import NodeCache from 'node-cache';

export class FeedCache {
  private cache: NodeCache;

  constructor(ttlSeconds = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<number> {
    return this.cache.del(key);
  }
}