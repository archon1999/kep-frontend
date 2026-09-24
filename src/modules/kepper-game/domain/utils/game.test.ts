import assert from 'node:assert/strict';
import test from 'node:test';
import { GameSyntaxError, formatProgram, parseProgram } from './code.ts';
import { countCommands, parseMap, runLevel, runScenario } from './engine.ts';
import { levels } from './levels.ts';
import { codeIslandsScore } from './progress.ts';

const solutions = [
  'move\nmove\nmove',
  'repeat 2 {\n  move\n}\nright\nrepeat 2 {\n  move\n}',
  'move\nright\nmove\nleft\nmove\nright\nmove',
  'if blocked {\n  left\n  move\n  right\n  repeat 3 {\n    move\n  }\n  right\n  move\n} else {\n  repeat 3 {\n    move\n  }\n}',
  'if blocked {\n  left\n  repeat 2 {\n    move\n  }\n  right\n  repeat 4 {\n    move\n  }\n  right\n  repeat 2 {\n    move\n  }\n  left\n} else {\n  repeat 4 {\n    move\n  }\n}\nrepeat 2 {\n  move\n}\nright\nrepeat 2 {\n  move\n}',
  'repeat 2 {\n  move\n}\nleft\nif blocked {\n  right\n  right\n  move\n  right\n  right\n  move\n  right\n} else {\n  move\n  right\n  right\n  move\n  left\n}\nrepeat 4 {\n  move\n}\nright\nrepeat 2 {\n  move\n}',
  [
    'repeat 2 {',
    '  move',
    '}',
    'if blocked {',
    '  left',
    '  move',
    '  right',
    '  repeat 2 {',
    '    move',
    '  }',
    '  right',
    '  move',
    '  left',
    '} else {',
    '  repeat 2 {',
    '    move',
    '  }',
    '}',
    'repeat 2 {',
    '  move',
    '}',
    'repeat 2 {',
    '  move',
    '}',
    'right',
    'repeat 2 {',
    '  move',
    '}',
    'left',
    'repeat 3 {',
    '  move',
    '}',
  ].join('\n'),
  [
    'if blocked {',
    '  jump',
    '  move',
    '} else {',
    '  move',
    '  jump',
    '}',
    'move',
    'right',
    'move',
    'if blocked {',
    '  jump',
    '} else {',
    '  move',
    '  move',
    '}',
    'left',
    'move',
    'jump',
    'right',
    'move',
    'left',
    'move',
    'right',
    'repeat 2 {',
    '  move',
    '}',
    'left',
    'repeat 2 {',
    '  move',
    '}',
    'left',
    'repeat 2 {',
    '  move',
    '}',
  ].join('\n'),
  [
    'repeat 2 {',
    '  if crystal ahead {',
    '    move',
    '    jump',
    '  } else {',
    '    repeat 3 {',
    '      move',
    '    }',
    '  }',
    '}',
    'right',
    'move',
    'if crystal ahead {',
    '  move',
    '  jump',
    '} else {',
    '  repeat 3 {',
    '    move',
    '  }',
    '}',
    'left',
    'move',
    'right',
    'move',
    'left',
    'move',
    'repeat 3 {',
    '  right',
    '  if crystal ahead {',
    '    move',
    '    jump',
    '  } else {',
    '    jump',
    '    move',
    '  }',
    '}',
    'left',
    'move',
    'jump',
    'right',
    'jump',
  ].join('\n'),
  [
    'if blocked {',
    '  jump',
    '} else {',
    '  repeat 2 {',
    '    move',
    '  }',
    '}',
    'if crystal ahead {',
    '  move',
    '  jump',
    '} else {',
    '  repeat 3 {',
    '    move',
    '  }',
    '}',
    'repeat 3 {',
    '  move',
    '}',
    'if crystal ahead {',
    '  move',
    '  jump',
    '} else {',
    '  repeat 3 {',
    '    move',
    '  }',
    '}',
    'right',
    'move',
    'left',
    'jump',
    'move',
    'repeat 2 {',
    '  if crystal ahead {',
    '    move',
    '    jump',
    '  } else {',
    '    jump',
    '    move',
    '  }',
    '}',
    'repeat 3 {',
    '  move',
    '}',
    'right',
    'move',
    'move',
    'left',
    'if crystal ahead {',
    '  move',
    '  jump',
    '} else {',
    '  jump',
    '  move',
    '}',
  ].join('\n'),
];

test('every level has a valid solution across all of its map variants', () => {
  assert.equal(levels.length, 10);
  assert.equal(solutions.length, levels.length);
  levels.forEach((level, index) => {
    const program = parseProgram(solutions[index]);
    assert.ok(
      runLevel(level, program).every(({ result }) => result.success),
      `level ${level.id}`,
    );
    assert.ok(countCommands(program) <= level.par, `level ${level.id} par`);
    assert.ok(
      level.par - countCommands(program) <= 1,
      `level ${level.id} attainable 3-star target`,
    );
    if (index > 0) {
      assert.ok(level.par > levels[index - 1].par, `level ${level.id} par progression`);
    }
    assert.equal(formatProgram(parseProgram(formatProgram(program))), formatProgram(program));
  });
});

test('new tiles change the simulation rather than only its appearance', () => {
  const gate = runScenario({ id: 'closed', map: ['SDG', 'P..'] }, parseProgram('move'));
  assert.equal(gate.failure, 'blocked');
  const switchRun = runLevel(levels[5], parseProgram(solutions[5]))[0].result;
  assert.equal(switchRun.success, true);
  assert.ok(switchRun.trace.some((frame) => frame.gateOpen));

  const portal = runLevel(levels[6], parseProgram(solutions[6]))[0].result;
  assert.ok(portal.trace.some((frame) => frame.action === 'teleport'));
  assert.throws(() => parseMap(['SA.G']), /paired/);

  const fragile = runScenario(
    { id: 'return', map: ['SF.', '..G'] },
    parseProgram('move\nright\nmove\nright\nmove\nright\nmove\nright\nmove'),
  );
  assert.equal(fragile.failure, 'blocked');
  assert.ok(fragile.trace.some((frame) => frame.collapsed.includes('1,0')));

  const gap = runLevel(levels[7], parseProgram('move\nmove'))[0].result;
  assert.equal(gap.failure, 'blocked');
  const belt = runLevel(levels[7], parseProgram(solutions[7]))[0].result;
  assert.equal(belt.success, true);
  assert.equal(belt.trace.filter((frame) => frame.action === 'conveyor').length, 1);
  assert.equal(runScenario(levels[9].scenarios[0], parseProgram('move')).failure, 'blocked');
  assert.equal(
    runScenario(levels[9].scenarios[1], parseProgram('repeat 3 {\n  move\n}')).success,
    false,
  );
});

test('later islands require distinct routes, repeated sensing, and a full final crossing', () => {
  assert.deepEqual(
    levels.map((level) => level.scenarios.length),
    [1, 1, 1, 2, 2, 2, 2, 3, 4, 4],
  );
  const portalRoutes = runLevel(levels[6], parseProgram(solutions[6]));
  assert.equal(portalRoutes.length, 2);
  assert.equal(
    portalRoutes[0].result.trace.some((frame) => frame.z === 1),
    false,
  );
  assert.equal(
    portalRoutes[1].result.trace.some((frame) => frame.z === 1),
    true,
  );

  const gapRoute = runLevel(levels[7], parseProgram(solutions[7]))[0].result;
  assert.equal(gapRoute.trace.filter((frame) => frame.action === 'jump').length, 3);
  assert.equal(gapRoute.trace[gapRoute.trace.length - 1]?.collected.length, 8);
  assert.equal(
    runLevel(levels[7], parseProgram(solutions[7]))[2].result.trace.slice(-1)[0]?.collected.length,
    9,
  );

  const sensedRoutes = runLevel(levels[8], parseProgram(solutions[8]));
  assert.equal(sensedRoutes.length, 4);
  assert.ok(sensedRoutes.every(({ result }) => result.success));
  assert.ok(sensedRoutes.every(({ result }) => result.trace.slice(-1)[0]?.collected.length === 11));
  assert.ok(
    sensedRoutes.every(
      ({ result }) => result.trace.filter((frame) => frame.action === 'jump').length >= 6,
    ),
  );
  assert.ok(
    runLevel(levels[8], parseProgram('repeat 6 {\n  move\n}')).every(
      ({ result }) => !result.success,
    ),
  );

  const finalRoutes = runLevel(levels[9], parseProgram(solutions[9]));
  assert.equal(finalRoutes.length, 4);
  for (const { result } of finalRoutes) {
    assert.equal(result.success, true);
    assert.ok(result.trace.some((frame) => frame.gateOpen));
    assert.ok(result.trace.some((frame) => frame.action === 'teleport'));
    assert.ok(result.trace.some((frame) => frame.action === 'conveyor'));
    assert.ok(result.trace.some((frame) => frame.action === 'jump'));
  }
  assert.ok(finalRoutes[0].result.trace.filter((frame) => frame.action === 'jump').length >= 3);
  assert.equal(
    finalRoutes[0].result.trace[finalRoutes[0].result.trace.length - 1]?.collected.length,
    8,
  );
  assert.equal(
    finalRoutes[1].result.trace[finalRoutes[1].result.trace.length - 1]?.collected.length,
    9,
  );
  assert.ok(
    finalRoutes.every(
      ({ result }) => result.trace.filter((frame) => frame.action === 'teleport').length === 2,
    ),
  );
  assert.ok(
    finalRoutes.every(
      ({ result }) => result.trace.filter((frame) => frame.action === 'conveyor').length >= 8,
    ),
  );
  assert.ok(
    runLevel(levels[9], parseProgram('repeat 8 {\n  move\n}')).every(
      ({ result }) => !result.success,
    ),
  );
  assert.equal(runScenario(levels[9].scenarios[1], parseProgram('jump')).success, false);
});

test('all crystals are required and score is capped at 1000', () => {
  assert.equal(
    runScenario({ id: 'two-crystals', map: ['SK.G', '  K.'] }, parseProgram('repeat 3 {\nmove\n}'))
      .failure,
    'crystal',
  );
  assert.equal(codeIslandsScore({ completed: [], stars: {}, drafts: {} }), 0);
  assert.equal(
    codeIslandsScore({
      completed: levels.map((level) => level.id),
      stars: Object.fromEntries(levels.map((level) => [level.id, 3])),
      drafts: {},
    }),
    1000,
  );
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
  assert.throws(() => parseProgram('if crystal ahead {\nmove'), GameSyntaxError);
});
