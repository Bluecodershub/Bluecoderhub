import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = process.env.SITE_ORIGIN || 'https://bluecoderhub.com';

const staticRoutes = ['/', '/products', '/about', '/careers', '/blog', '/contact', '/privacy', '/terms', '/cookies'];

const blogPath = path.resolve(__dirname, '../src/data/blog.json');
const outPath = path.resolve(__dirname, '../public/sitemap.xml');

const blog = JSON.parse(await fs.readFile(blogPath, 'utf8'));
const today = new Date().toISOString().slice(0, 10);

function urlEntry(loc, lastmod, changefreq, priority) {
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const entries = [
    ...staticRoutes.map((route) => urlEntry(`${SITE}${route}`, today, route === '/' ? 'weekly' : 'monthly', route === '/' ? '1.0' : '0.7')),
    ...blog
        .filter((post) => post.published !== false)
        .map((post) => {
            const slug = post.slug || post.id;
            const last = (post.updated_at || post.created_at || `${today}T00:00:00Z`).slice(0, 10);
            return urlEntry(`${SITE}/blog/${slug}`, last, 'monthly', '0.8');
        }),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

await fs.writeFile(outPath, xml, 'utf8');
console.log(`Sitemap written to ${outPath} (${entries.length} URLs)`);
