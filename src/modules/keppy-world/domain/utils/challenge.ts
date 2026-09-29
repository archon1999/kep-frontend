import type { WorldChallenge } from '../entities/world.types.ts';

const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const numbers = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
const positive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

/** A rolling release may serve a mission that this browser cannot render yet. */
export function isPlayableWorldChallenge(
  value: unknown,
): value is Exclude<WorldChallenge, { kind: 'unsupported' }> {
  if (!object(value) || typeof value.prompt !== 'string') return false;
  const grid = () => positive(value.rows) && positive(value.columns);
  const round = () =>
    positive(value.round) &&
    positive(value.totalRounds) &&
    typeof value.roundId === 'string' &&
    value.roundId.length > 0;
  switch (value.kind) {
    case 'math-compare':
      return round() && typeof value.left === 'string' && typeof value.right === 'string';
    case 'quick-math':
      return round() && typeof value.expression === 'string' && value.expression.length > 0;
    case 'number-sequence':
      return round() && numbers(value.sequence) && value.sequence.length > 0;
    case 'number-hunt':
      return round() && grid() && numbers(value.cells) && positive(value.next);
    case 'memory-matrix':
      return (
        round() &&
        grid() &&
        ['watch', 'recall'].includes(String(value.phase)) &&
        numbers(value.highlighted) &&
        numbers(value.selected) &&
        positive(value.targetCount)
      );
    case 'bug-hunt':
      return strings(value.code) && value.code.length > 0;
    case 'logic-circuit':
      return (
        strings(value.inputs) &&
        Array.isArray(value.rows) &&
        value.rows.every(
          (row) => object(row) && numbers(row.inputs) && typeof row.output === 'number',
        )
      );
    case 'code-islands':
      return strings(value.grid) && value.grid.length > 0 && positive(value.maxCommands);
    case 'memory-grid':
      return (
        grid() &&
        ['watch', 'recall'].includes(String(value.phase)) &&
        (value.reveal === null || (object(value.reveal) && typeof value.reveal.cell === 'number'))
      );
    case 'cargo':
      return (
        Array.isArray(value.items) &&
        value.items.every(
          (item) =>
            object(item) &&
            typeof item.id === 'string' &&
            typeof item.label === 'string' &&
            typeof item.weight === 'number' &&
            typeof item.value === 'number',
        )
      );
    case 'daily-task':
      return typeof value.href === 'string';
    default:
      return false;
  }
}
