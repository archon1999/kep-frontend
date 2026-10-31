import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { PlaygroundRepository } from '../domain/contracts/playground.repository.ts';
import type { RunResult } from '../domain/entities/run.types.ts';
import { executeRunJob } from './run-job.ts';

const result: RunResult = {
  id: 'run-1',
  status: 'finished',
  verdict: 1,
  output: '8\n',
  error: '',
  time: 1,
  memory: 2,
};
const request = { lang: 'py', code: 'print(3 + 5)', input: '' };

test('sends the selected language and waits for the terminal result', async () => {
  const updates: string[] = [];
  const repository = {
    languages: async () => [],
    run: async (payload) => {
      assert.deepEqual(payload, request);
      return { ...result, status: 'queued' as const };
    },
    result: async (id) => {
      assert.equal(id, 'run-1');
      return result;
    },
  } satisfies PlaygroundRepository;
  assert.deepEqual(
    await executeRunJob(repository, request, new AbortController().signal, (value) =>
      updates.push(value.status),
    ),
    result,
  );
  assert.deepEqual(updates, ['queued', 'finished']);
});

test('route cancellation stops polling and ignores a late create response', async () => {
  const controller = new AbortController();
  let release: (value: RunResult) => void = () => {};
  const repository = {
    languages: async () => [],
    run: () =>
      new Promise<RunResult>((resolve) => {
        release = resolve;
      }),
    result: async () => {
      assert.fail('must not poll a cancelled job');
    },
  } satisfies PlaygroundRepository;
  const task = executeRunJob(repository, request, controller.signal, () =>
    assert.fail('must not publish after cancellation'),
  );
  controller.abort();
  release(result);
  await assert.rejects(task, { name: 'AbortError' });
});

test('cancelling a queued run clears the pending wait before any poll', async () => {
  const controller = new AbortController();
  const repository = {
    languages: async () => [],
    run: async () => ({ ...result, status: 'queued' as const }),
    result: async () => {
      assert.fail('must not poll');
    },
  } satisfies PlaygroundRepository;
  await assert.rejects(
    executeRunJob(repository, request, controller.signal, () => controller.abort()),
    { name: 'AbortError' },
  );
});
