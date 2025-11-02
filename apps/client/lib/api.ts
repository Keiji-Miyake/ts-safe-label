/**
 * API クライアント設定
 * 
 * 開発環境では localhost:8787 (Cloudflare Workers ローカル)
 * 本番環境では実際のデプロイ先 URL を指定してください
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';

/**
 * API への fetch ヘルパー
 */
export async function fetchApi<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * API エンドポイント例
 */
export const api = {
  /**
   * GET /api/greeting
   */
  getGreeting: () => fetchApi<{ message: string }>('/api/greeting'),
  
  // 他の API エンドポイントをここに追加
};
