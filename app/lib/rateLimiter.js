const DEFAULT_CONFIG = {
  windowMs: 60_000,
  max: 30
};

class RateLimiter {
  constructor(config = DEFAULT_CONFIG) {
    this.windowMs = config.windowMs;
    this.max = config.max;
    this.store = new Map();
  }

  check(identifier) {
    const key = identifier || 'anonymous';
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetTime <= now) {
      const resetTime = now + this.windowMs;
      this.store.set(key, { count: 1, resetTime });
      return {
        ok: true,
        remaining: this.max - 1,
        reset: resetTime
      };
    }

    if (entry.count >= this.max) {
      return {
        ok: false,
        remaining: 0,
        reset: entry.resetTime
      };
    }

    entry.count += 1;
    this.store.set(key, entry);

    return {
      ok: true,
      remaining: this.max - entry.count,
      reset: entry.resetTime
    };
  }

  reset(identifier) {
    if (identifier) {
      this.store.delete(identifier);
    }
  }

  resetAll() {
    this.store.clear();
  }
}

const globalForRateLimiter = globalThis;

if (!globalForRateLimiter.__rateLimiter) {
  globalForRateLimiter.__rateLimiter = new RateLimiter();
}

export const rateLimiter = globalForRateLimiter.__rateLimiter;
export const RateLimiterClass = RateLimiter;
export function resetRateLimiter() {
  rateLimiter.resetAll();
}
