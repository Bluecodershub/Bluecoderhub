import pg from 'pg';
import crypto from 'crypto';
import { env } from '../config/env.js';

const { Pool } = pg;

let pool;

// Mock mode is decided once at startup: development convenience only.
// Runtime DB errors must surface as errors, never silently degrade to RAM.
const useMock = !env.databaseUrl;

if (useMock && env.nodeEnv === 'production') {
  throw new Error('DATABASE_URL is required in production');
}

if (useMock) {
  console.warn('[db] DATABASE_URL not set — using in-memory mock database (development only).');
}

// Simulated in-memory database tables
// Sample content for local development when DATABASE_URL is absent. The
// frontend also carries a full research library at Frontend/src/data/blog.json
// as a UI fallback; this array only exists so the API surface returns
// something realistic during local `npm run dev`.
const mockDb = {
  users: [],
  blog_posts: [
    {
      id: "b1b1b1b1-1111-1111-1111-111111111111",
      slug: "sketch-constraints-as-a-formal-language",
      title: "Sketch Constraints Are a Formal Language. B-Rep Kernels Set the Ceiling.",
      category: "AI CAD",
      author: "Bluecoderhub Research",
      excerpt: "The reason text-to-CAD keeps hitting a wall is not the language model. It is that the target representation is a program in a formal language whose type checker will reject you silently.",
      content: "Sample content — the Frontend fallback library contains the full text. Seed the real database via `npm run db:seed-blogs` to replace this stub.",
      tags: ["ai-cad", "b-rep", "sketch-constraints"],
      published: true,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: "b2b2b2b2-2222-2222-2222-222222222222",
      slug: "the-manufacturability-oracle",
      title: "The Manufacturability Oracle: What Language Models Cannot Learn From Drawings",
      category: "AI CAD",
      author: "Bluecoderhub Research",
      excerpt: "A drawing captures geometry. Manufacturability lives in the negative space of the drawing — in what the drawing assumes about tool access, fixturing, and material handling.",
      content: "Sample content — the Frontend fallback library contains the full text. Seed the real database via `npm run db:seed-blogs` to replace this stub.",
      tags: ["ai-cad", "dfm", "manufacturing"],
      published: true,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: "b3b3b3b3-3333-3333-3333-333333333333",
      slug: "reasoning-models-symbolic-neural-divide",
      title: "Reasoning Models and the Return of the Symbolic-Neural Divide",
      category: "AI Foundations",
      author: "Bluecoderhub Research",
      excerpt: "The scaling era suggested symbolic AI was over. Reasoning models revive the debate — and the right architecture for engineering-grade AI is the hybrid the field has been avoiding.",
      content: "Sample content — the Frontend fallback library contains the full text. Seed the real database via `npm run db:seed-blogs` to replace this stub.",
      tags: ["reasoning-models", "symbolic-neural", "engineering-ai"],
      published: true,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  applications: [],
  subscribers: []
};

// SQL engine simulator for in-memory fallback operation
export async function mockQuery(text, params = []) {
  const normalizedSql = text.replace(/\s+/g, ' ').trim();

  // 1. SELECT id, email, password_hash, role FROM users WHERE email = $1
  if (normalizedSql.includes('FROM users WHERE email = $1')) {
    const email = params[0].toLowerCase();
    const user = mockDb.users.find(u => u.email === email);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 2. INSERT INTO users ON CONFLICT (email)
  if (normalizedSql.includes('INSERT INTO users') && normalizedSql.includes('ON CONFLICT (email)')) {
    const [email, password_hash] = params;
    let user = mockDb.users.find(u => u.email === email);
    if (user) {
      user.password_hash = password_hash;
      user.role = 'admin';
      user.updated_at = new Date().toISOString();
    } else {
      user = {
        id: crypto.randomUUID(),
        email,
        password_hash,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockDb.users.push(user);
    }
    return { rows: [user], rowCount: 1 };
  }

  // 3. SELECT id, email, role, created_at FROM users WHERE id = $1
  if (normalizedSql.includes('FROM users WHERE id = $1')) {
    const id = params[0];
    const user = mockDb.users.find(u => u.id === id);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // 4. SELECT ... FROM blog_posts ORDER BY created_at DESC
  if (normalizedSql.includes('FROM blog_posts')) {
    let blogs = [...mockDb.blog_posts];
    if (normalizedSql.includes('WHERE published = true AND id = $1')) {
      const idOrSlug = params[0];
      const blog = blogs.find(b => b.published && b.id === idOrSlug);
      return { rows: blog ? [blog] : [], rowCount: blog ? 1 : 0 };
    }
    if (normalizedSql.includes('WHERE published = true AND slug = $1')) {
      const slug = params[0];
      const blog = blogs.find(b => b.published && b.slug === slug);
      return { rows: blog ? [blog] : [], rowCount: blog ? 1 : 0 };
    }
    if (normalizedSql.includes('WHERE published = true')) {
      blogs = blogs.filter(b => b.published);
    }
    blogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: blogs, rowCount: blogs.length };
  }

  // 5. INSERT INTO blog_posts
  if (normalizedSql.includes('INSERT INTO blog_posts')) {
    const [slug, title, category, author, excerpt, content, tags, published, created_by] = params;
    const blog = {
      id: crypto.randomUUID(),
      slug,
      title,
      category,
      author,
      excerpt,
      content,
      tags,
      published,
      created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.blog_posts.push(blog);
    return { rows: [blog], rowCount: 1 };
  }

  // 6. UPDATE blog_posts
  if (normalizedSql.includes('UPDATE blog_posts')) {
    const [slug, title, category, author, excerpt, content, tags, published, id] = params;
    const blog = mockDb.blog_posts.find(b => b.id === id);
    if (!blog) return { rows: [], rowCount: 0 };
    blog.slug = slug;
    blog.title = title;
    blog.category = category;
    blog.author = author;
    blog.excerpt = excerpt;
    blog.content = content;
    blog.tags = tags;
    blog.published = published;
    blog.updated_at = new Date().toISOString();
    return { rows: [blog], rowCount: 1 };
  }

  // 7. DELETE FROM blog_posts WHERE id = $1
  if (normalizedSql.includes('DELETE FROM blog_posts')) {
    const id = params[0];
    const index = mockDb.blog_posts.findIndex(b => b.id === id);
    if (index === -1) return { rows: [], rowCount: 0 };
    mockDb.blog_posts.splice(index, 1);
    return { rows: [{ id }], rowCount: 1 };
  }

  // 8. INSERT INTO applications
  if (normalizedSql.includes('INSERT INTO applications')) {
    const [name, email, phone, position, portfolio_url, cover_letter] = params;
    const app = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      position,
      portfolio_url,
      cover_letter,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.applications.push(app);
    return { rows: [app], rowCount: 1 };
  }

  // 9. SELECT ... FROM applications ORDER BY created_at DESC
  if (normalizedSql.includes('FROM applications')) {
    const apps = [...mockDb.applications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: apps, rowCount: apps.length };
  }

  // 10. UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2
  if (normalizedSql.includes('UPDATE applications SET status = $1')) {
    const [status, id] = params;
    const app = mockDb.applications.find(a => a.id === id);
    if (!app) return { rows: [], rowCount: 0 };
    app.status = status;
    app.updated_at = new Date().toISOString();
    return { rows: [app], rowCount: 1 };
  }

  // 11. INSERT INTO subscribers
  if (normalizedSql.includes('INSERT INTO subscribers')) {
    const [email, source] = params;
    let sub = mockDb.subscribers.find(s => s.email === email);
    if (sub) {
      sub.source = source;
    } else {
      sub = {
        id: crypto.randomUUID(),
        email,
        source,
        created_at: new Date().toISOString()
      };
      mockDb.subscribers.push(sub);
    }
    return { rows: [sub], rowCount: 1 };
  }

  // 12. SELECT ... FROM subscribers ORDER BY created_at DESC
  if (normalizedSql.includes('FROM subscribers')) {
    const subs = [...mockDb.subscribers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: subs, rowCount: subs.length };
  }

  // 13. DELETE FROM subscribers WHERE id = $1
  if (normalizedSql.includes('DELETE FROM subscribers')) {
    const id = params[0];
    const index = mockDb.subscribers.findIndex(s => s.id === id);
    if (index === -1) return { rows: [], rowCount: 0 };
    mockDb.subscribers.splice(index, 1);
    return { rows: [{ id }], rowCount: 1 };
  }

  console.warn(`[mock:db:unmatched] Query was not handled by mock: ${text}`);
  return { rows: [], rowCount: 0 };
}

function getSslConfig() {
  if (env.databaseUrl.includes('localhost') || env.databaseUrl.includes('127.0.0.1')) {
    return false;
  }
  if (env.nodeEnv === 'production') {
    return { rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

export function getPool() {
  if (useMock) {
    return {
      end: async () => {
        console.log('[mock:db] Connection pool closed.');
      }
    };
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: getSslConfig(),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });
    pool.on('error', (err) => {
      console.error('[db:pool:error]', err.message);
    });
  }
  return pool;
}

export async function query(text, params = []) {
  if (useMock) {
    return mockQuery(text, params);
  }
  return getPool().query(text, params);
}
