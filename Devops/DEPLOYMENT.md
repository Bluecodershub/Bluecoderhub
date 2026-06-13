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

- `JWT_SECRET`
- `DATABASE_URL`
- `PORT`
- `NODE_ENV=production`
- `ALLOWED_ORIGINS`

Do not commit production secrets. Configure them in the hosting provider.
