# Bluecoderhub

Full-stack Bluecoderhub application with a cleaned four-folder workspace.

## Folder Structure

```text
Bluecoderhub/
├── Frontend/   # React + Vite SPA
├── Backend/    # Express API and static frontend host
├── Worker/     # Serverless/API worker entry points
└── Devops/     # Docker, Vercel config, docs, local tooling, archives
```

## Local Development

Install dependencies when needed:

```bash
npm --prefix Frontend install
npm --prefix Backend install
```

Build the frontend:

```bash
npm --prefix Frontend run build
```

Run the full app locally:

```bash
node Backend/src/server.js
```

Open:

```text
http://localhost:8080
```

Health check:

```text
http://localhost:8080/api/health
```

## Docker Deploy

Build from the repository root while pointing Docker at the Devops Dockerfile:

```bash
docker build -f Devops/Dockerfile -t bluecoderhub .
docker run --env-file Backend/.env -p 8080:8080 bluecoderhub
```

The runtime image serves `Frontend/dist` through the Express server in `Backend`.

## Vercel/static Deploy

The root `vercel.json` is path-adjusted for the workspace folders. Keep the Vercel project root set to the repository root so Vercel can discover both the configuration and `api/[...path].js`:

```bash
npm --prefix Frontend install && npm --prefix Backend install
npm --prefix Frontend run build
```

Output directory:

```text
Frontend/dist
```

For full API deployment on a serverless platform, use `Worker/api/[...path].js` as the serverless entry and keep environment variables configured in the platform dashboard.

## Environment

Backend local env lives at:

```text
Backend/.env
```

Required:

```text
JWT_SECRET=...
DATABASE_URL=...
PORT=8080
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com
```
