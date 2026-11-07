import assert from 'node:assert/strict';
import test from 'node:test';
import { loadModule } from '../../../../shared/testing/loadModule.ts';

const { mapChallenge } = loadModule(new URL('./challenge.mapper.ts', import.meta.url));

test('finishing your own questions waits for the opponent and committed rating', () => {
  const payload = { id: 1, questions_count: 3, next_question: { number: 4 }, finished: null };
  const waiting = mapChallenge(payload);
  assert.equal(waiting.status, 0);
  assert.equal(waiting.nextQuestion.question, undefined);
  assert.equal(mapChallenge({ ...payload, finished: 'just now', rating_pending: true }).status, 0);
  assert.equal(mapChallenge({ ...payload, finished: 'just now', rating_pending: false }).status, 1);
});

test('polls never mutate cached score arrays and completed matches retain all answers', () => {
  const payload = {
    questions_count: 3,
    next_question: { number: 2 },
    player_first: { result: 2, results: [1, 1, 0], rating: '2041.3', delta: '17.5' },
    player_second: { result: 1, results: [0, 1, 0] },
  };
  const before = structuredClone(payload);
  mapChallenge(payload);
  mapChallenge(payload);
  assert.deepEqual(payload, before);
  const finished = mapChallenge({ ...payload, finished: 'just now' });
  assert.deepEqual(finished.playerFirst.results, [1, 1, 0]);
  assert.equal(finished.playerFirst.result, 2);
  assert.equal(finished.playerFirst.delta, 17.5);
});
