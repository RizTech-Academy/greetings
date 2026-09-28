import { createClient } from 'redis';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
// Configuration comes from the environment — the twelve-factor way. The app
// never hard-codes where Redis is; Compose and Kubernetes each set it.
const greeting = process.env.GREETING ?? 'Hello';
const redisUrl = process.env.REDIS_URL; // optional; the app works without it

let redis = null;
if (redisUrl) {
  redis = createClient({ url: redisUrl });
  redis.on('error', (err) => console.error('redis error:', err.message));
  redis.connect().catch((err) => console.error('redis connect failed:', err.message));
}

const app = createApp({ greeting, redis });
app.listen(port, () => console.log(`greetings listening on ${port}`));
