import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import {
  BRAIN_GAME_IDS,
  brainLevel,
  brainNumericAnswerMatches,
  brainScore,
  createBrainChallenge,
} from './brain-games.ts';

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function evaluate(expression: string): number {
  assert.match(expression, /^[\d\s+−×÷()²-]+$/);
  return runInNewContext(
    expression
      .replace(/−/g, '-')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/²/g, '**2'),
    {},
    { timeout: 100 },
  ) as number;
}

test('all five games have ten stages with a strictly increasing pace or recall demand', () => {
  assert.equal(BRAIN_GAME_IDS.length, 5);
  for (const id of BRAIN_GAME_IDS) {
    for (let level = 1; level <= 10; level += 1) {
      const config = brainLevel(id, level);
      assert.equal(config.level, level);
      assert.ok(config.rounds > 0 && config.seconds > 0 && config.mistakes > 0);
      if (level === 1) continue;
      const previous = brainLevel(id, level - 1);
      if (id === 'memory-matrix') {
        assert.ok(config.targets > previous.targets);
        assert.ok(config.previewMs < previous.previewMs);
        assert.ok(config.side >= previous.side);
        assert.ok(
          config.seconds / (config.rounds * config.targets) <
            previous.seconds / (previous.rounds * previous.targets),
        );
      } else if (id === 'number-hunt') {
        assert.ok(config.side >= previous.side);
        assert.ok(config.seconds / config.side ** 2 < previous.seconds / previous.side ** 2);
      } else {
        assert.ok(config.rounds > previous.rounds);
        assert.ok(config.seconds / config.rounds < previous.seconds / previous.rounds);
      }
    }
  }
});

test('generated arithmetic and comparisons have exact integer answers at every level', () => {
  for (let level = 1; level <= 10; level += 1) {
    for (let seed = 1; seed <= 50; seed += 1) {
      const math = createBrainChallenge('quick-math', level, seeded(seed * 817 + level));
      assert.equal(math.puzzle.kind, 'quick-math');
      if (math.puzzle.kind !== 'quick-math') continue;
      assert.equal(evaluate(math.puzzle.expression), math.solution);
      assert.ok(Number.isSafeInteger(math.solution));
      const compare = createBrainChallenge('math-compare', level, seeded(seed * 3571 + level));
      if (compare.puzzle.kind !== 'math-compare') continue;
      const left = evaluate(compare.puzzle.left);
      const right = evaluate(compare.puzzle.right);
      assert.ok(Number.isSafeInteger(left) && Number.isSafeInteger(right));
      assert.equal(compare.solution, left > right ? 'left' : left < right ? 'right' : 'equal');
      assert.ok(!/[+−] -/.test(compare.puzzle.left + compare.puzzle.right));
    }
  }
});

test('number hunt contains each target exactly once and its solution covers the board', () => {
  for (let level = 1; level <= 10; level += 1) {
    for (const random of [() => 0, () => 0.999999, seeded(level)]) {
      const challenge = createBrainChallenge('number-hunt', level, random);
      if (challenge.puzzle.kind !== 'number-hunt' || !Array.isArray(challenge.solution))
        throw new Error('wrong kind');
      const { puzzle, solution } = challenge;
      assert.equal(puzzle.cells.length, puzzle.rows * puzzle.columns);
      assert.equal(new Set(puzzle.cells).size, puzzle.cells.length);
      assert.deepEqual(
        solution.map((cell) => puzzle.cells[cell]),
        Array.from({ length: puzzle.cells.length }, (_, index) => index + 1),
      );
    }
  }
});

test('memory matrix generates a spatial set with no duplicates and hidden answers can be discarded', () => {
  for (let level = 1; level <= 10; level += 1) {
    const challenge = createBrainChallenge('memory-matrix', level, seeded(level * 97));
    if (challenge.puzzle.kind !== 'memory-matrix' || !Array.isArray(challenge.solution))
      throw new Error('wrong kind');
    const { puzzle, solution } = challenge;
    assert.equal(puzzle.phase, 'watch');
    assert.equal(puzzle.targetCount, brainLevel('memory-matrix', level).targets);
    assert.equal(new Set(solution).size, puzzle.targetCount);
    assert.ok(solution.every((cell) => cell >= 0 && cell < puzzle.rows * puzzle.columns));
    assert.deepEqual(puzzle.highlighted, solution);
    const recall = { ...puzzle, phase: 'recall', highlighted: undefined };
    assert.equal(recall.highlighted, undefined);
    assert.equal(recall.selected.length, 0);
  }
});

test('sequences have sufficient clues, deterministic variants and bounded integer solutions', () => {
  for (let level = 1; level <= 10; level += 1) {
    const challenge = createBrainChallenge('number-sequence', level, seeded(159));
    assert.deepEqual(challenge, createBrainChallenge('number-sequence', level, seeded(159)));
    if (challenge.puzzle.kind !== 'number-sequence') throw new Error('wrong kind');
    assert.ok(challenge.puzzle.sequence.length >= 6);
    assert.ok(challenge.puzzle.sequence.every(Number.isSafeInteger));
    assert.ok(Number.isSafeInteger(challenge.solution));
    assert.notDeepEqual(challenge, createBrainChallenge('number-sequence', level, seeded(159000)));
  }
});

test('score awards only completed levels and numeric answers are strict integers', () => {
  assert.equal(brainScore(0), 0);
  assert.equal(brainScore(3), 300);
  assert.equal(brainScore(3.9), 300);
  assert.equal(brainScore(10), 1000);
  assert.equal(brainScore(99), 1000);
  assert.equal(brainScore(-4), 0);
  assert.equal(brainScore(NaN), 0);
  assert.equal(brainScore(Infinity), 0);
  assert.ok(brainNumericAnswerMatches('  −19 ', -19));
  assert.ok(brainNumericAnswerMatches('0', 0));
  for (const invalid of ['', ' ', '0x10', '16abc', '1e1', '10.2', 'Infinity']) {
    assert.equal(brainNumericAnswerMatches(invalid, Number(invalid)), false, invalid);
  }
});
