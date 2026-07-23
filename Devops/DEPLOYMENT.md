# Deployment Checklist

## Preflight

```bash
npm --prefix Frontend run build
node --test "Backend/test/**/*.test.js"
```

## Docker

```bash
docker build -f Devops/Dockerfile -t bluecoderhub .
docker run --env-file Backend/.env -p 8080:8080 bluecoderhub
```

## Production Environment Variables

### Required

- `JWT_SECRET` — signing secret for the httpOnly auth cookie
- `DATABASE_URL` — Postgres connection string; API refuses to boot without it in production
- `NODE_ENV=production`
- `ALLOWED_ORIGINS` — comma-separated list of allowed CORS origins

### Optional

- `PORT` — Node listen port (default 8080)

### Optional: Error monitoring (Sentry)

When these are set, the API ships 5xx errors to Sentry with request
context, and the frontend ErrorBoundary reports captured errors. When they
are unset, both fall back to `console.error` and the Sentry SDK is never
imported.

- `SENTRY_DSN` (backend) / `VITE_SENTRY_DSN` (frontend)
- `SENTRY_ENVIRONMENT` / `VITE_SENTRY_ENVIRONMENT` (optional; defaults to NODE_ENV)
- `SENTRY_RELEASE` / `VITE_SENTRY_RELEASE` (optional; recommend git SHA)
- `SENTRY_TRACES_SAMPLE_RATE` / `VITE_SENTRY_TRACES_SAMPLE_RATE` (default 0.1)

Enable by installing the SDK on the workspace that will report:

```bash
npm --prefix Backend  i @sentry/node
npm --prefix Frontend i @sentry/react
```

### Optional: Distributed rate limits (Upstash Redis)

When these are set, the auth / write / strict / general rate limiters share
counters across every serverless instance. When they are unset, each
instance holds an in-memory counter (best-effort on Vercel).

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Enable by installing the packages:

```bash
npm --prefix Backend i @upstash/redis rate-limit-redis
```

Do not commit production secrets. Configure them in the hosting provider.

