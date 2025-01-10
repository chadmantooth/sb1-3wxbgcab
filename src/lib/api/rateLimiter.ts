import NodeCache from 'node-cache';

interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

export class RateLimiter {
  private cache: NodeCache;
  private readonly WINDOW_MS = 60000; // 1 minute
  private readonly MAX_REQUESTS = 100;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 60 });
  }

  async checkLimit(request: Request): Promise<RateLimitResult> {
    const ip = this.getClientIP(request);
    const key = `ratelimit:${ip}`;
    
    const current = this.cache.get<number>(key) || 0;
    
    if (current >= this.MAX_REQUESTS) {
      const ttl = this.cache.getTtl(key);
      const retryAfter = ttl ? Math.ceil((ttl - Date.now()) / 1000) : 60;
      
      return {
        allowed: false,
        retryAfter
      };
    }

    this.cache.set(key, current + 1, Math.ceil(this.WINDOW_MS / 1000));
    
    return { allowed: true };
  }

  private getClientIP(request: Request): string {
    // In production, you'd want to get this from headers like X-Forwarded-For
    return '127.0.0.1';
  }
}