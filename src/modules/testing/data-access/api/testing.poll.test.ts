import assert from 'node:assert/strict';
import test from 'node:test';
import { pollPendingResponse } from './testing.poll.ts';

test('finish polling retries pending responses until a result is ready', async () => {
  const responses = [
    { success: false, pending: true },
    { success: false, pending: true },
    { success: true, result: 85 },
  ];
  const waits: number[] = [];
  let requestCount = 0;
  let elapsedMs = 0;

  const result = await pollPendingResponse(
    async () => responses[requestCount++] ?? responses[responses.length - 1]!,
    {
      intervalMs: 1000,
      wait: async (durationMs) => {
        waits.push(durationMs);
        elapsedMs += durationMs;
      },
      now: () => elapsedMs,
    },
  );

  assert.deepEqual(result, { success: true, result: 85 });
  assert.equal(requestCount, 3);
  assert.deepEqual(waits, [1000, 1000]);
});

test('finish polling stops after the bounded retry window', async () => {
  let requestCount = 0;
  let elapsedMs = 0;

  const result = await pollPendingResponse(
    async () => {
      requestCount += 1;
      return { success: false, pending: true };
    },
    {
      timeoutMs: 2500,
      intervalMs: 1000,
      wait: async (durationMs) => {
        elapsedMs += durationMs;
      },
      now: () => elapsedMs,
    },
  );

  assert.deepEqual(result, { success: false, pending: true });
  assert.equal(requestCount, 3);
  assert.equal(elapsedMs, 2500);
});
