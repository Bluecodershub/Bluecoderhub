import test, { after } from 'node:test';
import assert from 'node:assert/strict';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-backend-tests';
process.env.DATABASE_URL = '';
process.env.NODE_ENV = 'test';

const { createApp } = await import('../src/app.js');
const { query } = await import('../src/db/pool.js');
const bcrypt = (await import('bcryptjs')).default;

const ADMIN_EMAIL = 'admin@test.local';
const ADMIN_PASSWORD = 'correct-horse-battery-staple';

const app = createApp();
const server = app.listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

after(() => server.close());

async function loginAsAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', updated_at = NOW()`,
    [ADMIN_EMAIL, passwordHash]
  );
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  assert.equal(res.status, 200);
  const setCookie = res.headers.get('set-cookie');
  assert.ok(setCookie?.includes('auth_token='), 'login must set auth cookie');
  assert.ok(/httponly/i.test(setCookie), 'auth cookie must be httpOnly');
  const body = await res.json();
  assert.equal(body.token, undefined, 'token must not be returned in the body');
  assert.equal(body.user.email, ADMIN_EMAIL);
  return setCookie.split(';')[0];
}

test('GET /api/health returns ok', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test('unknown /api route returns JSON 404, not HTML', async () => {
  const res = await fetch(`${base}/api/does-not-exist`);
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-type'), /application\/json/);
  const body = await res.json();
  assert.equal(body.code, 'not_found');
});

test('login rejects malformed payload with 400', async () => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: '' })
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).code, 'validation_error');
});

test('login rejects unknown credentials with 401', async () => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody@test.local', password: 'wrong-password' })
  });
  assert.equal(res.status, 401);
  assert.equal((await res.json()).code, 'invalid_credentials');
});

test('public blog list returns only published posts', async () => {
  const res = await fetch(`${base}/api/blogs`);
  assert.equal(res.status, 200);
  const { blogs } = await res.json();
  assert.ok(Array.isArray(blogs) && blogs.length > 0);
  assert.ok(blogs.every((blog) => blog.published === true));
});

test('admin endpoints require authentication', async () => {
  for (const path of ['/api/blogs/admin', '/api/applications', '/api/subscribers']) {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 401, `${path} should be protected`);
  }
});

test('admin can log in and create a blog post via cookie auth', async () => {
  const cookie = await loginAsAdmin();

  const meRes = await fetch(`${base}/api/auth/me`, { headers: { cookie } });
  assert.equal(meRes.status, 200);
  assert.equal((await meRes.json()).user.role, 'admin');

  const createRes = await fetch(`${base}/api/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({
      title: 'Backend Test Post',
      category: 'Testing',
      author: 'Test Suite',
      excerpt: 'An excerpt long enough to pass validation.',
      content: 'Content body long enough to pass the minimum length validation.',
      tags: ['testing'],
      published: true
    })
  });
  assert.equal(createRes.status, 201);
  const { blog } = await createRes.json();
  assert.equal(blog.slug, 'backend-test-post');

  const publicRes = await fetch(`${base}/api/blogs/backend-test-post`);
  assert.equal(publicRes.status, 200);
});

test('blog create rejects invalid payload with 400', async () => {
  const cookie = await loginAsAdmin();
  const res = await fetch(`${base}/api/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({ title: 'x' })
  });
  assert.equal(res.status, 400);
});

test('application submission validates and stores', async () => {
  const res = await fetch(`${base}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Applicant',
      email: 'applicant@test.local',
      position: 'Frontend Engineer',
      coverLetter: 'A cover letter that easily exceeds the twenty character minimum.'
    })
  });
  assert.equal(res.status, 201);
  const { application } = await res.json();
  assert.equal(application.status, 'pending');
});

test('AI learning-path endpoint responds without auth', async () => {
  const res = await fetch(`${base}/api/ai/learning-path`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: 'become a backend engineer', experience: 'beginner' })
  });
  assert.equal(res.status, 200);
  const { result } = await res.json();
  assert.ok(Array.isArray(result.modules) && result.modules.length > 0);
});
