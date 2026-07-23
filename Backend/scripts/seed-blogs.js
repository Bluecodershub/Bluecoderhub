import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query, getPool } from '../src/db/pool.js';

// Single source of truth: the frontend's blog library. This keeps the API
// response, the SPA fallback, and the SEO metadata identical instead of
// maintaining two nearly-identical post arrays. Any post added to
// Frontend/src/data/blog.json is automatically seeded here.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogJsonPath = path.resolve(__dirname, '../../Frontend/src/data/blog.json');

const raw = await fs.readFile(blogJsonPath, 'utf8');
const posts = JSON.parse(raw);

const adminLookup = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
const createdBy = adminLookup.rows[0]?.id || null;

let inserted = 0;
let updated = 0;

for (const post of posts) {
    if (!post.slug || !post.title || !post.content) continue;
    const existing = await query('SELECT id FROM blog_posts WHERE slug = $1', [post.slug]);
    const tags = Array.isArray(post.tags) ? post.tags : [];
    const author = post.author || 'Bluecoderhub Research';
    const excerpt = post.excerpt || '';
    const category = post.category || 'General';
    const published = post.published !== false;

    if (existing.rowCount > 0) {
        await query(
            `UPDATE blog_posts
             SET title = $1, category = $2, author = $3, excerpt = $4, content = $5,
                 tags = $6, published = $7, updated_at = NOW()
             WHERE slug = $8`,
            [post.title, category, author, excerpt, post.content, tags, published, post.slug]
        );
        updated += 1;
    } else {
        await query(
            `INSERT INTO blog_posts (slug, title, category, author, excerpt, content, tags, published, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [post.slug, post.title, category, author, excerpt, post.content, tags, published, createdBy]
        );
        inserted += 1;
    }
}

await getPool().end();
console.log(`Seeded blog posts from ${blogJsonPath}: ${inserted} inserted, ${updated} updated.`);
