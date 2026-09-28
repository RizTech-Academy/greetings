import express from 'express';

// The Express app, separated from the server so tests can import it without
// starting a listener. server.js wires this up and calls listen().
export function createApp({ greeting = 'Hello', redis = null } = {}) {
  const app = express();

  // Liveness/readiness endpoint — Kubernetes and load balancers probe this.
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/', async (_req, res) => {
    let visits = null;
    if (redis?.isReady) {
      try {
        visits = await redis.incr('visits');
      } catch (err) {
        console.error('redis incr failed:', err.message);
      }
    }
    res.json({
      message: `${greeting} from ${process.env.HOSTNAME ?? 'unknown host'}`,
      visits,
    });
  });

  return app;
}
