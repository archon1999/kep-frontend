import type { Command, Level } from '../entities/game.types.ts';

let nextId = 0;
const move = (): Command => ({ id: 'starter-' + ++nextId, kind: 'move' });
const left = (): Command => ({ id: 'starter-' + ++nextId, kind: 'left' });
const right = (): Command => ({ id: 'starter-' + ++nextId, kind: 'right' });
const jump = (): Command => ({ id: 'starter-' + ++nextId, kind: 'jump' });
const repeat = (count: number, body: Command[]): Command => ({
  id: 'starter-' + ++nextId,
  kind: 'repeat',
  count,
  body,
});

const drawMap = (
  width: number,
  height: number,
  base: readonly string[],
  additions: readonly (readonly [number, number, string])[],
): string[] => {
  const cells = Array.from({ length: height }, () => Array<string>(width).fill(' '));
  base.forEach((row, z) => {
    for (let x = 0; x < row.length; x += 1) cells[z][x] = row[x];
  });
  additions.forEach(([x, z, tile]) => {
    cells[z][x] = tile;
  });
  return cells.map((row) => row.join('').trimEnd());
};

const sensorLoopMap = (base: readonly string[], near: readonly [boolean, boolean, boolean]) =>
  drawMap(9, 10, base, [
    [2, 4, 'G'],
    [2, 5, '.'],
    [2, 6, 'K'],
    [3, 6, '.'],
    [4, 6, 'K'],
    [5, 6, '.'],
    [7, 6, 'F'],
    [8, 6, 'K'],
    [8, 7, near[0] ? 'K' : ' '],
    [8, 8, near[0] ? ' ' : 'K'],
    [8, 9, '.'],
    [7, 9, near[1] ? 'K' : ' '],
    [6, 9, near[1] ? ' ' : 'K'],
    [5, 9, '.'],
    [5, 8, near[2] ? 'K' : ' '],
    [5, 7, near[2] ? ' ' : 'K'],
  ]);

const finalIslandMap = (base: readonly string[], secondNear: boolean, finalNear: boolean) =>
  drawMap(10, 11, base, [
    [7, 5, 'K'],
    [8, 5, 'B'],
    [0, 8, 'B'],
    [1, 8, 'K'],
    [3, 8, '.'],
    [4, 8, secondNear ? 'K' : ' '],
    [5, 8, secondNear ? ' ' : 'K'],
    [6, 8, '.'],
    [7, 8, 'D'],
    [8, 8, 'D'],
    [9, 8, 'K'],
    [2, 9, 'K'],
    ...([3, 4, 5, 6, 7, 8, 9] as const).map((x) => [x, 9, '<'] as const),
    [2, 10, '.'],
    [3, 10, finalNear ? 'K' : ' '],
    [4, 10, finalNear ? ' ' : 'K'],
    [5, 10, 'G'],
  ]);

export const levels: readonly Level[] = [
  {
    id: 1,
    titleKey: 'game.levels.1.title',
    descriptionKey: 'game.levels.1.description',
    hintKey: 'game.levels.1.hint',
    conceptKey: 'game.concepts.sequence',
    available: ['move', 'left', 'right'],
    scenarios: [{ id: 'first', map: ['S..G'] }],
    starter: [move()],
    par: 3,
  },
  {
    id: 2,
    titleKey: 'game.levels.2.title',
    descriptionKey: 'game.levels.2.description',
    hintKey: 'game.levels.2.hint',
    conceptKey: 'game.concepts.loop',
    available: ['move', 'left', 'right', 'repeat'],
    scenarios: [{ id: 'bend', map: ['S..', '  .', '  G'] }],
    starter: [repeat(2, [move()])],
    par: 5,
  },
  {
    id: 3,
    titleKey: 'game.levels.3.title',
    descriptionKey: 'game.levels.3.description',
    hintKey: 'game.levels.3.hint',
    conceptKey: 'game.concepts.debug',
    available: ['move', 'left', 'right', 'repeat'],
    scenarios: [{ id: 'bug', map: ['S. ', ' ..', '  G'] }],
    starter: [move(), left(), move(), right(), move(), left(), move()],
    par: 7,
  },
  {
    id: 4,
    titleKey: 'game.levels.4.title',
    descriptionKey: 'game.levels.4.description',
    hintKey: 'game.levels.4.hint',
    conceptKey: 'game.concepts.condition',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked'],
    scenarios: [
      { id: 'clear', map: ['    ', 'S..G'] },
      { id: 'blocked', map: ['....', 'S  G'] },
    ],
    starter: [{ id: 'starter-condition', kind: 'ifBlocked', yes: [left()], no: [move()] }],
    par: 11,
  },
  {
    id: 5,
    titleKey: 'game.levels.5.title',
    descriptionKey: 'game.levels.5.description',
    hintKey: 'game.levels.5.hint',
    conceptKey: 'game.concepts.final',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked'],
    scenarios: [
      { id: 'clear', map: ['       ', '       ', 'S.K.K.K', '      .', '      G'] },
      { id: 'blocked', map: ['..K..', '.   .', 'S   K.K', '      .', '      G'] },
    ],
    starter: [],
    par: 18,
  },
  {
    id: 6,
    titleKey: 'game.levels.6.title',
    descriptionKey: 'game.levels.6.description',
    hintKey: 'game.levels.6.hint',
    conceptKey: 'game.concepts.switchGate',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked'],
    scenarios: [
      { id: 'north-switch', map: ['       ', '  P    ', 'S..D..K', '      .', '      G'] },
      { id: 'south-switch', map: ['       ', '       ', 'S..D..K', '  P   .', '      G'] },
    ],
    starter: [repeat(2, [move()])],
    par: 21,
  },
  {
    id: 7,
    titleKey: 'game.levels.7.title',
    descriptionKey: 'game.levels.7.description',
    hintKey: 'game.levels.7.hint',
    conceptKey: 'game.concepts.teleport',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked'],
    scenarios: [
      {
        id: 'open-exit',
        map: ['SFA', '        ', '   A..KB', '        ', '        ', '  BFK', '    .', '    ..KG'],
      },
      {
        id: 'closed-exit',
        map: ['SFA', '   ...', '   A .KB', '        ', '        ', '  BFK', '    .', '    ..KG'],
      },
    ],
    starter: [repeat(2, [move()])],
    par: 23,
  },
  {
    id: 8,
    titleKey: 'game.levels.8.title',
    descriptionKey: 'game.levels.8.description',
    hintKey: 'game.levels.8.hint',
    conceptKey: 'game.concepts.jump',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked', 'jump'],
    scenarios: [
      {
        id: 'near-crystal',
        map: [
          'SK .v',
          '    K',
          '    .',
          '         ',
          '    K. K',
          '       .K G',
          '        K K',
          '        K..',
        ],
      },
      {
        id: 'far-crystal',
        map: [
          'S K.v',
          '    K',
          '    .',
          '         ',
          '    K. K',
          '       .K G',
          '        K K',
          '        K..',
        ],
      },
      {
        id: 'solid-crossing',
        map: [
          'SK .v',
          '    K',
          '    .',
          '    K    ',
          '    K. K',
          '       .K G',
          '        K K',
          '        K..',
        ],
      },
    ],
    starter: [move(), jump()],
    par: 28,
  },
  {
    id: 9,
    titleKey: 'game.levels.9.title',
    descriptionKey: 'game.levels.9.description',
    hintKey: 'game.levels.9.hint',
    conceptKey: 'game.concepts.crystalSensor',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked', 'jump', 'ifCrystalAhead'],
    scenarios: [
      {
        id: 'near-then-far',
        map: sensorLoopMap(
          ['SK ..Kv', '      K', '      .', '      K', '         ', '      .K', '       .G'],
          [true, false, true],
        ),
      },
      {
        id: 'far-then-near',
        map: sensorLoopMap(
          ['S.K.K v', '      K', '      .', '      .', '      K', '      .K', '       .G'],
          [false, true, false],
        ),
      },
      {
        id: 'near-loop',
        map: sensorLoopMap(
          ['SK ..Kv', '      K', '      .', '      K', '         ', '      .K', '       .G'],
          [false, false, true],
        ),
      },
      {
        id: 'far-loop',
        map: sensorLoopMap(
          ['S.K.K v', '      K', '      .', '      .', '      K', '      .K', '       .G'],
          [true, true, false],
        ),
      },
    ],
    starter: [{ id: 'starter-sensor', kind: 'ifCrystalAhead', yes: [move()], no: [move()] }],
    par: 31,
  },
  {
    id: 10,
    titleKey: 'game.levels.10.title',
    descriptionKey: 'game.levels.10.description',
    hintKey: 'game.levels.10.hint',
    conceptKey: 'game.concepts.mastery',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked', 'jump', 'ifCrystalAhead'],
    scenarios: [
      {
        id: 'broken-bridge',
        map: finalIslandMap(
          ['S FK PDDA', '         ', '         ', '  AK v', '     .', '     . .G'],
          true,
          false,
        ),
      },
      {
        id: 'crystal-bridge',
        map: finalIslandMap(
          ['SKF.KPDDA', '         ', '         ', '  A.Kv', '     .', '     . .G'],
          false,
          true,
        ),
      },
      {
        id: 'broken-switchback',
        map: finalIslandMap(
          ['S FK PDDA', '         ', '         ', '  AK v', '     .', '     . .G'],
          false,
          false,
        ),
      },
      {
        id: 'crystal-switchback',
        map: finalIslandMap(
          ['SKF.KPDDA', '         ', '         ', '  A.Kv', '     .', '     . .G'],
          true,
          false,
        ),
      },
    ],
    starter: [
      { id: 'starter-final-branch', kind: 'ifBlocked', yes: [jump()], no: [move(), move()] },
    ],
    par: 38,
  },
];

export const getLevel = (id: number) => levels.find((level) => level.id === id) ?? levels[0];

export const cloneCommands = (commands: readonly Command[]): Command[] =>
  commands.map((command) => {
    if (command.kind === 'repeat') return { ...command, body: cloneCommands(command.body) };
    if (command.kind === 'ifBlocked' || command.kind === 'ifCrystalAhead') {
      return { ...command, yes: cloneCommands(command.yes), no: cloneCommands(command.no) };
    }
    return { ...command };
  });
