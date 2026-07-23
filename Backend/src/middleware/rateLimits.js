import rateLimit from 'express-rate-limit';

// Rate limits with a shared Upstash Redis store when configured, or the
// default in-memory MemoryStore otherwise.
//
// On serverless platforms (Vercel), the in-memory store resets on every
// cold start and does not share counters across instances — so it is
// best-effort and cannot enforce a real bucket. When
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, we swap in
// a Redis-backed store so the same counter is enforced across all
// instances of every deployment.
//
// Store loading uses top-level await so every limiter is constructed
// exactly once, at module load, avoiding the express-rate-limit warning
// about instantiating middleware inside a request handler.

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_ENABLED = Boolean(REDIS_URL && REDIS_TOKEN);

async function buildRedisStore() {
  if (!REDIS_ENABLED) return null;
  try {
    const specifier = '@upstash' + '/redis';
    const storeSpecifier = 'rate-limit' + '-redis';
    const [{ Redis }, { RedisStore }] = await Promise.all([
      import(specifier),
      import(storeSpecifier),
    ]);
    const client = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
    return new RedisStore({
      prefix: 'bch:rl:',
      sendCommand: (...args) => client.eval(...args).catch(() => null),
    });
  } catch {
    console.warn('[rate-limit] Upstash configured but packages missing. Run `npm i @upstash/redis rate-limit-redis` to enable. Falling back to in-memory.');
    return null;
  }
}

const sharedStore = await buildRedisStore();
if (sharedStore) {
  console.log('[rate-limit] Upstash Redis store active.');
}

function limiter(options) {
  return rateLimit({
    ...options,
    standardHeaders: true,
    legacyHeaders: false,
    ...(sharedStore ? { store: sharedStore } : {}),
  });
}

export const generalLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  skip: (req) => req.path === '/health',
});

export const authLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many authentication attempts', code: 'rate_limited' },
});

export const writeLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 20,
  message: { error: 'Too many write requests', code: 'rate_limited' },
});

export const strictLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 5,
  message: { error: 'Too many requests', code: 'rate_limited' },
});
