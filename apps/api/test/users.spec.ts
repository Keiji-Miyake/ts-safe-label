import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('API: users endpoints', () => {
  it('unit: GET /api/users returns list', async () => {
    const request = new Request('http://example.com/api/users');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
  const json = await response.json() as any;
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(typeof json.count).toBe('number');
  });

  it('unit: GET /api/users/1 returns a user', async () => {
    const request = new Request('http://example.com/api/users/1');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
  const json = await response.json() as any;
    expect(json.success).toBe(true);
    expect(json.data).toHaveProperty('id', 1);
  });

  it('unit: GET /api/users/999 returns 404', async () => {
    const request = new Request('http://example.com/api/users/999');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  const json = await response.json() as any;
    expect(json.success).toBe(false);
  });

  it('integration: GET /api/users works', async () => {
    const response = await SELF.fetch('https://example.com/api/users');
    expect(response.status).toBe(200);
  const json = await response.json() as any;
    expect(json.success).toBe(true);
  });
});
