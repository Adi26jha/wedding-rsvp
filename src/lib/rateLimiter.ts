/**
 * Simple in-memory sliding window rate limiter
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 600000); // 10 minutes
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 300000);
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 6,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    rateLimitMap.set(identifier, record);
    return { allowed: false, remaining: 0 };
  }

  record.timestamps.push(now);
  rateLimitMap.set(identifier, record);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
  };
}
