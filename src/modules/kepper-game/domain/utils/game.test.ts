import assert from 'node:assert/strict';
import test from 'node:test';
import { GameSyntaxError, formatProgram, parseProgram } from './code.ts';
import { runLevel } from './engine.ts';
import { levels } from './levels.ts';

const solutions = [
  'move\nmove\nmove',
  'repeat 2 {\n  move\n}\nright\nrepeat 2 {\n  move\n}',
  'if blocked {\n  left\n  move\n  right\n  repeat 3 {\n    move\n  }\n  right\n  move\n} else {\n  repeat 3 {\n    move\n  }\n}',
  'move\nright\nmove\nleft\nmove\nright\nmove',
  'if blocked {\n  left\n  repeat 2 {\n    move\n  }\n  right\n  repeat 4 {\n    move\n  }\n  right\n  repeat 2 {\n    move\n  }\n} else {\n  repeat 4 {\n    move\n  }\n}',
];

test('every level has a valid solution across all of its map variants', () => {
  levels.forEach((level, index) => {
    const program = parseProgram(solutions[index]);
    assert.ok(
      runLevel(level, program).every(({ result }) => result.success),
      `level ${level.id}`,
    );
    assert.equal(formatProgram(parseProgram(formatProgram(program))), formatProgram(program));
  });
});

test('walls, missing keys, and incomplete programs cannot win', () => {
  assert.equal(runLevel(levels[0], parseProgram('move\nmove\nmove\nmove'))[0].result.success, true);
  assert.equal(runLevel(levels[0], parseProgram('left\nmove'))[0].result.failure, 'blocked');
  assert.equal(
    runLevel(
      levels[4],
      parseProgram(
        'if blocked {\n  left\n  repeat 2 {\n    move\n  }\n  right\n  repeat 4 {\n    move\n  }\n  right\n  repeat 2 {\n    move\n  }\n} else {\n  move\n}',
      ),
    )[0].result.failure,
    'unfinished',
  );
  assert.equal(runLevel(levels[1], levels[1].starter)[0].result.failure, 'unfinished');
});

test('source parser rejects arbitrary code and malformed blocks', () => {
  assert.throws(() => parseProgram('window.alert(1)'), GameSyntaxError);
  assert.throws(() => parseProgram('repeat 2 {\nmove'), GameSyntaxError);
  assert.throws(() => parseProgram('if blocked {\nmove\n} else {\nright'), GameSyntaxError);
});
