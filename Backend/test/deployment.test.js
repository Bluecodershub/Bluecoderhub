import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

test('Vercel entry files remain at the repository root', async () => {
  const configPath = path.join(repoRoot, 'vercel.json');
  const apiPath = path.join(repoRoot, 'api', '[...path].js');

  await access(configPath);
  await access(apiPath);

  const config = JSON.parse(await readFile(configPath, 'utf8'));
  assert.equal(config.outputDirectory, 'Frontend/dist');
  assert.equal(config.buildCommand, 'npm --prefix Frontend run build');

  const apiEntry = await readFile(apiPath, 'utf8');
  assert.match(apiEntry, /Backend\/src\/app\.js/);
});

test('Vercel API entry exports a request handler', async () => {
  process.env.JWT_SECRET ||= 'test-secret-for-deployment-test';
  process.env.DATABASE_URL = '';
  process.env.NODE_ENV = 'test';

  const { default: handler } = await import('../../api/[...path].js');
  assert.equal(typeof handler, 'function');
});
