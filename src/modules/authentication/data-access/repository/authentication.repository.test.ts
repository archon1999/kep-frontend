import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule } from '../../../../shared/testing/loadModule.ts';

test('profile outages are errors; only an unauthenticated response becomes a guest', async () => {
  let response: unknown = { username: 'user_s', first_name: 'Test' };
  let failure: unknown;
  const { authenticationRepository: repository } = loadModule(
    new URL('./authentication.repository.impl.ts', import.meta.url),
    {
      'app/routes/route-config': { apiEndpoints: { profile: '/api/profile' } },
      'shared/services/axios/axiosFetcher': {
        __esModule: true,
        default: async () => {
          if (failure) throw failure;
          return response;
        },
      },
    },
  );
  assert.equal((await repository.getCurrentUser()).username, 'user_s');
  for (const error of [{ status: 503 }, { status: 502 }, { data: 'Network Error' }]) {
    failure = error;
    await assert.rejects(repository.getCurrentUser(), (value) => value === error);
  }
  for (const status of [401, 403]) {
    failure = { status };
    assert.equal(await repository.getCurrentUser(), null);
  }
  failure = undefined;
  response = { username: 'user_s' };
  assert.equal((await repository.getCurrentUser()).username, 'user_s');
});
