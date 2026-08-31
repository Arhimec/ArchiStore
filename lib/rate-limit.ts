interface RateLimitStore {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitStore>();

/**
 * In-memory sliding window rate limiter.
 * @param key Identifier (e.g. IP address or token)
 * @param limit Maximum requests allowed in window
 * @param windowMs Window duration in milliseconds (default 60000ms = 1 minute)
 */
export function checkRateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitStore = {
      count: 1,
      resetAt: now + windowMs,
    };
    memoryStore.set(key, newRecord);
    return { success: true, remaining: limit - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  memoryStore.set(key, record);
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}
