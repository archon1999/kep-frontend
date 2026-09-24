import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import {
  BUG_HUNT_ROUNDS,
  BUG_QUESTIONS,
  bugHuntOutputMatches,
  bugHuntQuestions,
  bugHuntScore,
} from './bug-hunt.ts';
import {
  CIRCUIT_PUZZLES,
  DEFAULT_CIRCUIT,
  applyGate,
  circuitMatches,
  circuitRoundScore,
  circuitRows,
} from './logic-circuit.ts';
import {
  MEMORY_ROUND_GRID_SIDES,
  MEMORY_ROUND_LENGTHS,
  createMemorySequence,
  memoryGridScore,
  memoryGridSide,
  memoryPreviewTiming,
} from './memory-grid.ts';

test('bug hunt has ten ordered stages with two different variants each', () => {
  assert.equal(BUG_HUNT_ROUNDS, 10);
  assert.equal(BUG_QUESTIONS.length, BUG_HUNT_ROUNDS * 2);
  for (let stage = 1; stage <= BUG_HUNT_ROUNDS; stage += 1) {
    assert.equal(BUG_QUESTIONS.filter((question) => question.stage === stage).length, 2);
  }
  const firstRun = bugHuntQuestions(0);
  const nextRun = bugHuntQuestions(1);
  assert.deepEqual(
    firstRun.map((question) => question.stage),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.deepEqual(
    nextRun.map((question) => question.stage),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
  assert.equal(new Set(firstRun.map((question) => question.id)).size, BUG_HUNT_ROUNDS);
  assert.equal(new Set(nextRun.map((question) => question.id)).size, BUG_HUNT_ROUNDS);
  assert.ok(firstRun.every((question, index) => question.id !== nextRun[index].id));
  const rotatedRun = bugHuntQuestions(2);
  assert.deepEqual(
    rotatedRun.map((question) => question.id),
    firstRun.map((question) => question.id),
  );
  for (const question of rotatedRun.filter((item) => item.stage >= 2)) {
    const original = BUG_QUESTIONS.find((item) => item.id === question.id);
    assert.ok(question.fix && original?.fix, question.id);
    assert.equal(
      question.fix.options[question.fix.correct],
      original.fix.options[original.fix.correct],
      question.id,
    );
    assert.equal(new Set(question.fix.options).size, 3, question.id);
  }
  assert.ok(BUG_QUESTIONS.every((question) => question.stage >= 2 === Boolean(question.fix)));
  assert.ok(
    BUG_QUESTIONS.every((question) => question.stage >= 6 === Boolean(question.expectedOutput)),
  );
  for (const question of BUG_QUESTIONS.filter((item) => item.expectedOutput)) {
    assert.ok(
      bugHuntOutputMatches(question.expectedOutput!, question.expectedOutput!),
      question.id,
    );
  }
  assert.ok(bugHuntOutputMatches('[2,10,30]', '[2, 10, 30]'));
  assert.ok(bugHuntOutputMatches('FALSE', 'false'));
  assert.ok(!bugHuntOutputMatches('4', '3'));
  assert.ok(
    BUG_QUESTIONS.every(
      (question) =>
        question.buggyLine > 0 &&
        question.buggyLine <= question.code.length &&
        question.code.length >= 2,
    ),
  );
  assert.equal(new Set(BUG_QUESTIONS.map((question) => question.id)).size, BUG_QUESTIONS.length);
  assert.equal(bugHuntScore(BUG_HUNT_ROUNDS), 1000);
  assert.equal(bugHuntScore(7), 700);
  assert.equal(bugHuntScore(50), 1000);
  assert.equal(bugHuntScore(-2), 0);
});

test('every bug hunt variant has a task and explanation in all languages', () => {
  for (const language of ['en', 'ru', 'uz']) {
    const path = new URL(
      `../../../../app/locales/langs/${language}/games-minis.json`,
      import.meta.url,
    );
    const locale = JSON.parse(readFileSync(path, 'utf8')) as {
      gamesMinis: { bugHunt: { questions: Record<string, { task: string; explain: string }> } };
    };
    for (const question of BUG_QUESTIONS) {
      const copy = locale.gamesMinis.bugHunt.questions[question.id];
      assert.ok(copy?.task && copy?.explain, `${language}: ${question.id}`);
    }
  }
});

test('JavaScript bug hunt repairs have one correct output', () => {
  const earlierOutputs: Record<string, string> = {
    even: '[2, 4]',
    slice: '[20, 30, 40]',
    search: '1',
    average: '7.5',
  };
  for (const question of BUG_QUESTIONS) {
    const expected = question.expectedOutput ?? earlierOutputs[question.id];
    if (question.language !== 'JavaScript' || !question.fix || !expected) continue;
    for (const [index, replacement] of question.fix.options.entries()) {
      let output: unknown;
      const code = question.code.map((line, lineIndex) =>
        lineIndex + 1 === question.buggyLine ? replacement : line,
      );
      runInNewContext(
        code.join('\n'),
        {
          console: {
            log(value: unknown) {
              output = value;
            },
          },
        },
        { timeout: 1000 },
      );
      assert.equal(
        bugHuntOutputMatches(JSON.stringify(output), expected),
        index === question.fix.correct,
        `${question.id}: option ${index + 1}`,
      );
    }
  }
});

test('logic circuit gates and all target truth tables are solvable', () => {
  assert.equal(applyGate('AND', 1, 0), 0);
  assert.equal(applyGate('OR', 1, 0), 1);
  assert.equal(applyGate('XOR', 1, 1), 0);
  assert.equal(CIRCUIT_PUZZLES.length, 10);
  const signatures = new Set<string>();
  for (const puzzle of CIRCUIT_PUZZLES) {
    assert.ok(circuitMatches(puzzle, puzzle.target), puzzle.id);
    assert.equal(circuitRows(puzzle, DEFAULT_CIRCUIT).length, 1 << puzzle.inputCount);
    assert.ok(circuitRows(puzzle, puzzle.target).every((row) => row.actual === row.expected));
    signatures.add(
      `${puzzle.inputCount}:${circuitRows(puzzle, puzzle.target)
        .map((row) => row.expected)
        .join('')}`,
    );
  }
  assert.equal(signatures.size, CIRCUIT_PUZZLES.length);
  assert.equal(circuitRoundScore(1) * CIRCUIT_PUZZLES.length, 1000);
  assert.equal(circuitRoundScore(2), 85);
  assert.equal(circuitRoundScore(5), 40);
  assert.equal(circuitRoundScore(100), 40);
});

test('memory sequences use the grid and never flash same cell twice in a row', () => {
  const sequence = createMemorySequence(7, () => 0);
  assert.equal(sequence.length, 7);
  assert.ok(sequence.every((cell) => cell >= 0 && cell < 16));
  assert.ok(sequence.every((cell, index) => index === 0 || cell !== sequence[index - 1]));
  assert.equal(MEMORY_ROUND_LENGTHS.length, 10);
  assert.equal(MEMORY_ROUND_GRID_SIDES.length, 10);
  assert.equal(MEMORY_ROUND_LENGTHS[0], 3);
  assert.equal(MEMORY_ROUND_LENGTHS[9], 28);
  assert.ok(
    MEMORY_ROUND_LENGTHS.every(
      (length, index) => index === 0 || length - MEMORY_ROUND_LENGTHS[index - 1] >= 2,
    ),
  );
  const opening = memoryPreviewTiming(0);
  const finale = memoryPreviewTiming(9);
  assert.ok(opening.interval > finale.interval);
  assert.ok(opening.interval - finale.interval >= 450);
  assert.ok(finale.flash < finale.interval);
  assert.deepEqual(MEMORY_ROUND_GRID_SIDES, [3, 3, 4, 4, 4, 5, 5, 5, 6, 6]);
  for (let round = 0; round < MEMORY_ROUND_LENGTHS.length; round += 1) {
    const side = memoryGridSide(round);
    const cells = createMemorySequence(MEMORY_ROUND_LENGTHS[round], () => 0.999, side);
    assert.equal(cells.length, MEMORY_ROUND_LENGTHS[round]);
    assert.ok(cells.every((cell) => cell >= 0 && cell < side * side));
    if (round > 0) {
      assert.ok(MEMORY_ROUND_LENGTHS[round] > MEMORY_ROUND_LENGTHS[round - 1]);
      assert.ok(side >= memoryGridSide(round - 1));
      assert.ok(memoryPreviewTiming(round).interval < memoryPreviewTiming(round - 1).interval);
    }
  }
  assert.equal(memoryGridScore(MEMORY_ROUND_LENGTHS.length, 0), 1000);
  assert.equal(memoryGridScore(3, 1), 275);
  assert.equal(memoryGridScore(0, 2), 0);
  assert.equal(memoryGridScore(20, 0), 1000);
});
