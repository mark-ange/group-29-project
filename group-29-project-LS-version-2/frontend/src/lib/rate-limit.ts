export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export interface RateLimiter {
  consume(key: string, limit: number, windowMs: number): RateLimitResult;
}

type Bucket = { hits: number[]; lastSeen: number };

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly now: () => number = Date.now) {}

  consume(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = this.now();
    const cutoff = now - windowMs;
    const bucket = this.buckets.get(key) ?? { hits: [], lastSeen: now };
    bucket.hits = bucket.hits.filter((time) => time > cutoff);
    bucket.lastSeen = now;

    if (bucket.hits.length >= limit) {
      this.buckets.set(key, bucket);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.hits[0] + windowMs - now) / 1000)),
      };
    }

    bucket.hits.push(now);
    this.buckets.set(key, bucket);
    this.prune(cutoff);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  private prune(cutoff: number) {
    if (this.buckets.size < 1000) return;
    for (const [key, bucket] of this.buckets) {
      if (bucket.lastSeen <= cutoff) this.buckets.delete(key);
    }
  }
}

// Keep this behind RateLimiter so it can be replaced with a shared store later.
export const rateLimiter: RateLimiter = new InMemoryRateLimiter();

export function requestIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
