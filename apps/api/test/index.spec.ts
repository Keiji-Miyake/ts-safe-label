import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('API: /api/greeting', () => {
	it('unit: returns greeting JSON', async () => {
		const request = new Request('http://example.com/api/greeting');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json).toHaveProperty('message');
	});

	it('integration: returns greeting JSON', async () => {
		const response = await SELF.fetch('https://example.com/api/greeting');
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json).toHaveProperty('message');
	});
});
