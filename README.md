# Bluecoderhub

A full-stack web application for Bluecoderhub — a technology company website with public pages, blog, careers, and admin dashboard.

## Quick Start

```bash
# Install dependencies
npm install

# Run development
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
bluecoderhub/
├── backend/           # Express.js API server
│   └── src/
│       ├── config/     # Environment config
│       ├── db/        # PostgreSQL connection & schema
│       ├── middleware/# Auth, rate limiting, security
│       ├── routes/    # API endpoints
│       └── utils/     # Error handling, validation
├── frontend/          # React SPA
│   └── src/
│       ├── components/# Reusable UI components
│       ├── pages/     # Route components
│       ├── config/    # Routes, constants
│       └── utils/     # API client, helpers
└── api/              # Serverless API handlers (Vercel)
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, PostgreSQL
- **Auth**: JWT with bcrypt
- **Security**: Helmet, CORS, rate limiting

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| POST | /api/auth/logout | Admin logout |
| GET | /api/blogs | List published blogs |
| POST | /api/blogs | Create blog (admin) |
| GET | /api/applications | List job applications |
| POST | /api/applications | Submit job application |
| POST | /api/subscribers | Subscribe to newsletter |

## License

MIT