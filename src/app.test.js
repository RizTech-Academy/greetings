import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';

// Start the app on an ephemeral port, returning its base URL and a close fn.
async function startApp(opts) {
  const app = createApp(opts);
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  return { url: `http://localhost:${port}`, close: () => new Promise((r) => server.close(r)) };
}

test('GET /health returns ok', async () => {
  const { url, close } = await startApp();
  try {
    const res = await fetch(`${url}/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
  } finally {
    await close();
  }
});

test('GET / uses the configured greeting', async () => {
  const { url, close } = await startApp({ greeting: 'Namaste' });
  try {
    const res = await fetch(`${url}/`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.match(body.message, /^Namaste from /);
    assert.equal(body.visits, null); // no redis configured
  } finally {
    await close();
  }
});
