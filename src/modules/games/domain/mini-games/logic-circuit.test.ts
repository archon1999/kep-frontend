import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  ADVANCED_GATES,
  CIRCUIT_PAIRINGS,
  CIRCUIT_PUZZLES,
  DEFAULT_CIRCUIT,
  GATES,
  NAND_GATES,
  STARTER_GATES,
  circuitMatches,
  circuitRows,
} from './logic-circuit.ts';
import type { CircuitConfig, CircuitPairing, CircuitPuzzle, LogicGate } from './logic-circuit.ts';

const signature = (puzzle: CircuitPuzzle, config: CircuitConfig) =>
  circuitRows(puzzle, config)
    .map((row) => row.actual)
    .join('');

function possibleConfigurations(
  puzzle: CircuitPuzzle,
  gates: readonly LogicGate[] = puzzle.gates,
  pairings: readonly CircuitPairing[] = puzzle.pairings,
  allowInvert = puzzle.allowInvert,
) {
  const configurations: CircuitConfig[] = [];
  for (const pairing of pairings) {
    for (const firstGate of gates) {
      for (const secondGate of puzzle.inputCount >= 3 ? gates : [DEFAULT_CIRCUIT.secondGate]) {
        for (const thirdGate of puzzle.inputCount === 4 ? gates : [DEFAULT_CIRCUIT.thirdGate]) {
          for (const invert of allowInvert ? [false, true] : [false]) {
            configurations.push({ firstGate, secondGate, thirdGate, invert, pairing });
          }
        }
      }
    }
  }
  return configurations;
}

const possibleSignatures = (
  puzzle: CircuitPuzzle,
  gates: readonly LogicGate[] = puzzle.gates,
  pairings: readonly CircuitPairing[] = puzzle.pairings,
  allowInvert = puzzle.allowInvert,
) =>
  new Set(
    possibleConfigurations(puzzle, gates, pairings, allowInvert).map((config) =>
      signature(puzzle, config),
    ),
  );

test('logic circuit search space strictly grows from 2 to 750 configurations', () => {
  assert.deepEqual(
    CIRCUIT_PUZZLES.map((puzzle) => puzzle.inputCount),
    [2, 2, 2, 3, 3, 3, 4, 4, 4, 4],
  );
  assert.deepEqual(STARTER_GATES, ['AND', 'OR']);
  assert.deepEqual(GATES, ['AND', 'OR', 'XOR']);
  assert.deepEqual(NAND_GATES, ['AND', 'OR', 'XOR', 'NAND']);
  assert.deepEqual(ADVANCED_GATES, ['AND', 'OR', 'XOR', 'NAND', 'NOR']);
  assert.deepEqual(CIRCUIT_PAIRINGS, ['AB_CD', 'AC_BD', 'AD_BC']);

  const configurationCounts = CIRCUIT_PUZZLES.map(
    (puzzle) =>
      puzzle.gates.length ** (puzzle.inputCount - 1) *
      (puzzle.allowInvert ? 2 : 1) *
      puzzle.pairings.length,
  );
  assert.deepEqual(configurationCounts, [2, 3, 6, 18, 32, 50, 125, 250, 500, 750]);
  assert.ok(
    configurationCounts.every(
      (count, stage) => stage === 0 || count >= configurationCounts[stage - 1] * 1.5,
    ),
    'each stage adds at least 50% more possible circuit configurations',
  );
  assert.deepEqual(
    CIRCUIT_PUZZLES.map((puzzle) => possibleSignatures(puzzle).size),
    [2, 3, 6, 18, 22, 26, 85, 86, 166, 246],
  );

  const signatures = new Set<string>();
  const solutionCounts: number[] = [];
  for (const puzzle of CIRCUIT_PUZZLES) {
    const rows = circuitRows(puzzle, puzzle.target);
    assert.equal(rows.length, 1 << puzzle.inputCount, puzzle.id);
    assert.equal(new Set(rows.map(({ a, b, c, d }) => `${a}${b}${c}${d}`)).size, rows.length);
    assert.ok(circuitMatches(puzzle, puzzle.target), puzzle.id);
    assert.equal(circuitMatches(puzzle, DEFAULT_CIRCUIT), false, puzzle.id);

    assert.ok(puzzle.gates.includes(puzzle.target.firstGate), puzzle.id);
    if (puzzle.inputCount >= 3)
      assert.ok(puzzle.gates.includes(puzzle.target.secondGate), puzzle.id);
    if (puzzle.inputCount === 4)
      assert.ok(puzzle.gates.includes(puzzle.target.thirdGate), puzzle.id);
    assert.ok(puzzle.pairings.includes(puzzle.target.pairing), puzzle.id);
    assert.ok(puzzle.allowInvert || !puzzle.target.invert, puzzle.id);

    const expected = rows.map((row) => row.expected).join('');
    assert.ok(possibleSignatures(puzzle).has(expected), puzzle.id);
    solutionCounts.push(
      possibleConfigurations(puzzle).filter((config) => signature(puzzle, config) === expected)
        .length,
    );
    const key = `${puzzle.inputCount}:${expected}`;
    assert.ok(!signatures.has(key), `${puzzle.id} repeats an earlier puzzle`);
    signatures.add(key);
  }
  assert.deepEqual(solutionCounts, [1, 1, 1, 1, 1, 2, 1, 1, 2, 2]);
});

test('each new mechanic is necessary for its first puzzle, not an optional shortcut', () => {
  const expected = (stage: number) =>
    circuitRows(CIRCUIT_PUZZLES[stage - 1], CIRCUIT_PUZZLES[stage - 1].target)
      .map((row) => row.expected)
      .join('');

  assert.equal(possibleSignatures(CIRCUIT_PUZZLES[1], STARTER_GATES).has(expected(2)), false);
  assert.equal(
    possibleSignatures(CIRCUIT_PUZZLES[2], GATES, ['AB_CD'], false).has(expected(3)),
    false,
  );
  assert.ok(
    circuitRows(CIRCUIT_PUZZLES[3], CIRCUIT_PUZZLES[3].target).some((row, index, rows) =>
      rows.some(
        (other) =>
          row.a === other.a &&
          row.b === other.b &&
          row.c !== other.c &&
          row.expected !== other.expected,
      ),
    ),
    'stage 4 must depend on its newly introduced third input',
  );
  assert.equal(possibleSignatures(CIRCUIT_PUZZLES[4], GATES).has(expected(5)), false);
  assert.equal(possibleSignatures(CIRCUIT_PUZZLES[5], NAND_GATES).has(expected(6)), false);
  assert.ok(
    circuitRows(CIRCUIT_PUZZLES[6], CIRCUIT_PUZZLES[6].target).some((row, index, rows) =>
      rows.some(
        (other) =>
          row.a === other.a &&
          row.b === other.b &&
          row.c === other.c &&
          row.d !== other.d &&
          row.expected !== other.expected,
      ),
    ),
    'stage 7 must depend on its newly introduced fourth input',
  );
  assert.equal(
    possibleSignatures(CIRCUIT_PUZZLES[7], ADVANCED_GATES, ['AB_CD'], false).has(expected(8)),
    false,
  );
  assert.equal(
    possibleSignatures(CIRCUIT_PUZZLES[8], ADVANCED_GATES, ['AB_CD']).has(expected(9)),
    false,
  );
  assert.equal(
    possibleSignatures(CIRCUIT_PUZZLES[9], ADVANCED_GATES, ['AB_CD', 'AC_BD']).has(expected(10)),
    false,
  );

  assert.equal(
    circuitMatches(CIRCUIT_PUZZLES[0], { ...DEFAULT_CIRCUIT, firstGate: 'NAND' }),
    false,
  );
  assert.equal(
    circuitMatches(CIRCUIT_PUZZLES[6], { ...CIRCUIT_PUZZLES[6].target, invert: true }),
    false,
  );
});

test('final circuit requires matching parity and conjunction across crossed pairs', () => {
  const final = CIRCUIT_PUZZLES[CIRCUIT_PUZZLES.length - 1];
  for (const row of circuitRows(final, final.target)) {
    assert.equal(row.expected, Number((row.a ^ row.d) === (row.b & row.c)));
  }
});

test('every logic circuit stage has a localized title and clue', () => {
  for (const language of ['en', 'ru', 'uz']) {
    const path = new URL(
      `../../../../app/locales/langs/${language}/games-minis.json`,
      import.meta.url,
    );
    const locale = JSON.parse(readFileSync(path, 'utf8')) as {
      gamesMinis: {
        logicCircuit: {
          secondPairGate: string;
          pairGate: string;
          pairing: string;
          combineGate: string;
          nandGateHelp: string;
          advancedGateHelp: string;
          puzzles: Record<string, { title: string; hint: string }>;
        };
      };
    };
    const copy = locale.gamesMinis.logicCircuit;
    assert.ok(
      copy.secondPairGate &&
        copy.pairGate &&
        copy.pairing &&
        copy.combineGate &&
        copy.nandGateHelp &&
        copy.advancedGateHelp,
      language,
    );
    for (const puzzle of CIRCUIT_PUZZLES) {
      assert.ok(
        copy.puzzles[puzzle.id]?.title && copy.puzzles[puzzle.id]?.hint,
        `${language}: ${puzzle.id}`,
      );
    }
  }
});
