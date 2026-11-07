import axios from 'axios';
import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule } from '../../testing/loadModule.ts';

test('one silent request cannot swallow a concurrent protected request failure', async () => {
  const transport = axios.create({
    adapter: async (config) => {
      await new Promise((resolve) => setTimeout(resolve, config.url === '/silent' ? 5 : 10));
      throw { status: 503, url: config.url };
    },
  });
  const { default: fetcher } = loadModule(new URL('./axiosFetcher.ts', import.meta.url), {
    './axiosInstance': { __esModule: true, default: transport },
  });
  const results = await Promise.allSettled([
    fetcher(['/silent', {}, { disableThrowError: true }]),
    fetcher('/protected'),
  ]);
  assert.deepEqual(results[0], { status: 'fulfilled', value: null });
  assert.equal(results[1].status, 'rejected');
  if (results[1].status === 'rejected') assert.equal(results[1].reason.status, 503);
});
