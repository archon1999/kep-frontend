import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decodeChessSolutionBlob,
  encodeChessSolutionBlob,
} from './chessPuzzleSolution.ts';

test('decodeChessSolutionBlob restores xor1-obfuscated chess solution', () => {
  const solutionLines = [
    ['g1f3', 'b8c6', 'f3e5'],
    ['d2d4', 'd7d5', 'c2c4'],
  ];
  const solutionBlob = encodeChessSolutionBlob(42, 'puzzle-42', solutionLines);

  assert.deepEqual(
    decodeChessSolutionBlob({
      questionId: 42,
      puzzleId: 'puzzle-42',
      solutionBlob,
      solutionCipher: 'xor1',
    }),
    solutionLines,
  );
});

test('decodeChessSolutionBlob rejects unsupported cipher values', () => {
  const solutionBlob = encodeChessSolutionBlob(7, 'puzzle-7', [['e2e4']]);

  assert.deepEqual(
    decodeChessSolutionBlob({
      questionId: 7,
      puzzleId: 'puzzle-7',
      solutionBlob,
      solutionCipher: 'other',
    }),
    [],
  );
});
