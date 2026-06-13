import rateLimit from 'express-rate-limit';

// NOTE: counters are in-memory and per-instance. On serverless (Vercel) each
// instance counts independently and resets on cold start, so these limits are
// best-effort there; use a shared store if strict enforcement is needed.

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/health';
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts', code: 'rate_limited' }
});

export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests', code: 'rate_limited' }
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', code: 'rate_limited' }
});
