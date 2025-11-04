import { Hono } from 'hono';
import { cors } from 'hono/cors';

// サンプルデータ（実際のプロジェクトではデータベースを使用）
const users = [
  { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
  { id: 2, name: '佐藤花子', email: 'sato@example.com' },
  { id: 3, name: '鈴木一郎', email: 'suzuki@example.com' },
];

const app = new Hono();

// CORS を有効化（開発環境用）
app.use('/*', cors());

// ルートエンドポイント
app.get('/', (c) => {
  return c.json({
    message: 'expo-workers-monorepo API',
    version: '1.0.0',
    endpoints: {
      greeting: '/api/greeting',
      users: '/api/users',
      user: '/api/users/:id',
    },
  });
});

// 挨拶エンドポイント
app.get('/api/greeting', (c) => {
  return c.json({ message: 'Hello from modern Hono & Cloudflare!' });
});

// ユーザー一覧取得
app.get('/api/users', (c) => {
  return c.json({
    success: true,
    data: users,
    count: users.length,
  });
});

// ユーザー詳細取得
app.get('/api/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json(
      {
        success: false,
        error: 'ユーザーが見つかりません',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: user,
  });
});

// ユーザー作成（サンプル）
app.post('/api/users', async (c) => {
  const body = await c.req.json();
  const newUser = {
    id: users.length + 1,
    name: body.name,
    email: body.email,
  };

  users.push(newUser);

  return c.json(
    {
      success: true,
      data: newUser,
      message: 'ユーザーを作成しました',
    },
    201
  );
});

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// フロントエンドと型を共有するためにエクスポート
export type AppType = typeof app;

export default app;
