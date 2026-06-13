# Architecture

## Overview

Bluecoderhub is a monorepo full-stack web application with:
- **Frontend**: React SPA served by Vite
- **Backend**: Express.js REST API
- **Database**: PostgreSQL
- **Deployment**: Vercel (serverless + Node.js)

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Vercel    │────▶│  PostgreSQL│
│   (React)   │     │  (Edge)    │     │  (Hosted)  │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
              ┌─────────┐ ┌─────────┐
              │ API     │ │  Node   │
              │functions│ │ server │
              └─────────┘ └─────────┘
```

## Frontend Architecture

### Routing

- React Router v6 with lazy loading
- Routes defined in `Frontend/src/config/routes.js`

### State Management

- Local component state with `useState`
- No global state library (simple app)

### API Communication

- Custom `api` utility in `Frontend/src/utils/api.js`
- JWT authentication via cookies + Authorization header

### Styling

- Tailwind CSS with custom design tokens
- Framer Motion for animations

### Key Components

```
Frontend/src/
├── components/
│   ├── admin/        # Admin-specific UI
│   ├── animations/   # PremiumBackground, CustomCursor, FadeInSection
│   ├── common/       # Navbar, Footer, Button
│   └── layout/       # ErrorBoundary
├── pages/
│   ├── Home.jsx      # Landing page
│   ├── About.jsx     # Company info
│   ├── Blog.jsx      # Blog listing + BlogPost
│   ├── Careers.jsx   # Jobs + application form
│   └── Admin.jsx     # Management dashboard
└── utils/
    ├── api.js       # API client
    ├── sanitize.js  # XSS prevention
    └── index.js     # Helpers
```

## Backend Architecture

### Express.js Structure

```
Backend/src/
├── config/
│   └── env.js        # Environment validation
├── db/
│   ├── pool.js       # PostgreSQL connection pool
│   └── schema.sql     # Database schema
├── middleware/
│   ├── auth.js       # JWT authentication
│   ├── rateLimits.js # Rate limiting
│   ├── requestId.js # Request tracking
│   └── security.js   # Security headers
├── routes/
│   ├── auth.js       # /api/auth/*
│   ├── blogs.js      # /api/blogs/*
│   ├── applications.js # /api/applications/*
│   └── subscribers.js # /api/subscribers/*
└── utils/
    ├── errors.js     # HttpError class
    └── validate.js  # Zod validation
```

### Authentication Flow

1. Admin logs in with email/password
2. Server validates credentials against PostgreSQL
3. Server issues JWT with user role
4. JWT stored in HttpOnly cookie + returned in response
5. Subsequent requests include JWT in cookie or Authorization header
6. Middleware verifies JWT and attaches user to request

### Security Layers

1. **Helmet** - Security headers (CSP, HSTS, etc.)
2. **CORS** - Origin allowlist
3. **Rate Limiting** - Per-IP limits on auth/write endpoints
4. **Input Validation** - Zod schemas
5. **SQL Parameterized Queries** - No SQL injection

### Database Schema

```sql
-- Users table for admin authentication
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job applications
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  job_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'footer',
  subscribed_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment

### Vercel Configuration

- Serverless functions in `/api` directory
- Node.js server for development
- Frontend built and served from `/Frontend/dist`

### Environment

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Key for JWT signing
- `JWT_EXPIRES_IN` - Token expiry (default: 7d)
- `NODE_ENV` - development | production

## Development Workflow

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Database migration
npm run db:migrate

# Create admin user
npm run admin:create
```

## Security Considerations

- JWT secrets must be rotated periodically
- Rate limiting prevents brute force
- Input validation prevents injection attacks
- HttpOnly cookies prevent XSS token theft
- CORS restricts cross-origin requests
