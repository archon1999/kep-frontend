import type { Command, Level } from '../entities/game.types.ts';

let nextId = 0;
const move = (): Command => ({ id: `starter-${++nextId}`, kind: 'move' });
const left = (): Command => ({ id: `starter-${++nextId}`, kind: 'left' });
const right = (): Command => ({ id: `starter-${++nextId}`, kind: 'right' });
const repeat = (count: number, body: Command[]): Command => ({
  id: `starter-${++nextId}`,
  kind: 'repeat',
  count,
  body,
});

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
    id: 4,
    titleKey: 'game.levels.4.title',
    descriptionKey: 'game.levels.4.description',
    hintKey: 'game.levels.4.hint',
    conceptKey: 'game.concepts.debug',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked'],
    scenarios: [{ id: 'bug', map: ['S. ', ' ..', '  G'] }],
    starter: [move(), left(), move(), right(), move(), left(), move()],
    par: 7,
  },
  {
    id: 5,
    titleKey: 'game.levels.5.title',
    descriptionKey: 'game.levels.5.description',
    hintKey: 'game.levels.5.hint',
    conceptKey: 'game.concepts.final',
    available: ['move', 'left', 'right', 'repeat', 'ifBlocked'],
    scenarios: [
      { id: 'clear', map: ['     ', '     ', 'S.K.G'] },
      { id: 'blocked', map: ['..K..', '.   .', 'S   G'] },
    ],
    starter: [],
    par: 14,
  },
];

export const getLevel = (id: number) => levels.find((level) => level.id === id) ?? levels[0];

export const cloneCommands = (commands: readonly Command[]): Command[] =>
  commands.map((command) => {
    if (command.kind === 'repeat') return { ...command, body: cloneCommands(command.body) };
    if (command.kind === 'ifBlocked') {
      return { ...command, yes: cloneCommands(command.yes), no: cloneCommands(command.no) };
    }
    return { ...command };
  });
