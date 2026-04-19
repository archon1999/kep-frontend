import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decodeChessSolutionBlob,
  encodeChessSolutionBlob,
} from './chessPuzzleSolution.ts';

test('decodeChessSolutionBlob restores xor1-obfuscated chess solution', () => {
  const solutionMoves = ['g1f3', 'b8c6', 'f3e5'];
  const solutionBlob = encodeChessSolutionBlob(42, 'puzzle-42', solutionMoves);

  assert.deepEqual(
    decodeChessSolutionBlob({
      questionId: 42,
      puzzleId: 'puzzle-42',
      solutionBlob,
      solutionCipher: 'xor1',
    }),
    solutionMoves,
  );
});

test('decodeChessSolutionBlob rejects unsupported cipher values', () => {
  const solutionBlob = encodeChessSolutionBlob(7, 'puzzle-7', ['e2e4']);

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
