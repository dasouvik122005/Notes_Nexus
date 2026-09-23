import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

/**
 * Upstash Redis-backed rate limiter.
 *
 * Required env vars:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * If not configured, rate limiting is disabled (all requests pass through).
 * This ensures development and CI environments are not broken.
 */

const isConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let redis: Redis | null = null;

if (isConfigured) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/**
 * Creates a rate limiter with the given window and max requests.
 * Uses a sliding window algorithm for smooth rate limiting.
 */
function createLimiter(maxRequests: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`) {
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, window),
    analytics: true,
    prefix: 'notes-nexus',
  });
}

// ─── Preset Rate Limiters ────────────────────────────────────────────────────

/** Heavy write operations: uploads, listing creation (5 req / min) */
export const uploadLimiter = createLimiter(5, '60 s');

/** Cloudinary signing — tied to uploads (10 req / min) */
export const signLimiter = createLimiter(10, '60 s');

/** Admin actions: approve/reject/delete (30 req / min) */
export const adminActionLimiter = createLimiter(30, '60 s');

/** Admin queue reads (20 req / min) */
export const adminQueueLimiter = createLimiter(20, '60 s');

/** Rating submissions (20 req / min) */
export const rateLimiter = createLimiter(20, '60 s');

/** Marketplace mark-sold (10 req / min) */
export const markSoldLimiter = createLimiter(10, '60 s');

/** Public read endpoints like /api/papers (60 req / min) */
export const readLimiter = createLimiter(60, '60 s');

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Applies rate limiting for a request. Returns a NextResponse with 429 status
 * if the limit is exceeded, or null if the request is allowed.
 *
 * Usage in an API route:
 *   const blocked = await applyRateLimit(uploadLimiter, request);
 *   if (blocked) return blocked;
 *
 * @param limiter - One of the preset limiters above
 * @param identifier - Unique key for the rate limit bucket (defaults to IP)
 */
export async function applyRateLimit(
  limiter: Ratelimit | null,
  request: Request,
  identifier?: string
): Promise<NextResponse | null> {
  // If rate limiting is not configured, allow all requests
  if (!limiter) return null;

  try {
    // Use provided identifier, or fall back to IP address
    const key =
      identifier ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    const { success, limit, remaining, reset } = await limiter.limit(key);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please slow down and try again shortly.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  } catch (err) {
    // If Redis is down, fail open — don't block legitimate requests
    console.error('[RateLimit] Redis error, failing open:', err);
  }

  return null;
}
