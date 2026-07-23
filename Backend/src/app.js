import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimits.js';
import { requestId, requestLogger } from './middleware/requestId.js';
import { securityHeaders } from './middleware/security.js';
import { errorHandler, notFound } from './utils/errors.js';
import { initSentry } from './lib/sentry.js';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';
import applicationRoutes from './routes/applications.js';
import subscriberRoutes from './routes/subscribers.js';
import aiRoutes from './routes/ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../../Frontend/dist');

export function createApp({ serveFrontend = false } = {}) {
  // Fire and forget; no-op when SENTRY_DSN is unset. Errors during Sentry
  // bootstrap must never prevent the API from serving.
  initSentry().catch(() => {});

  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(requestId);
  app.use(requestLogger);
  app.use(securityHeaders);

  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true
    }
  }));

  app.use(cors({
    origin(origin, callback) {
      callback(null, !origin || env.allowedOrigins.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '128kb' }));
  app.use('/api', generalLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/subscribers', subscriberRoutes);
  app.use('/api/ai', aiRoutes);

  // Unmatched /api routes must 404 as JSON, never fall through to the SPA shell.
  app.use('/api', notFound);

  if (serveFrontend) {
    app.use(express.static(frontendDist, {
      immutable: true,
      maxAge: '1y',
      index: false
    }));
    // SPA fallback: serve the shell for any GET that isn't /api or a static asset.
    // Using app.use with an explicit method guard avoids Express 5's stricter
    // pattern parsing of app.get('*', ...).
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  } else {
    app.use(notFound);
  }

  app.use(errorHandler);
  return app;
}
