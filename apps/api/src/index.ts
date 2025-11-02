import { Hono } from 'hono';

const app = new Hono()
  .get('/api/greeting', (c) => {
    return c.json({ message: 'Hello from modern Hono & Cloudflare!' });
  });

// フロントエンドと型を共有するためにエクスポート
export type AppType = typeof app;

export default app;
