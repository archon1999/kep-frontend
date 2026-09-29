export const BRAIN_GAME_IDS = [
  'math-compare',
  'quick-math',
  'number-sequence',
  'number-hunt',
  'memory-matrix',
] as const;

export type BrainGameId = (typeof BRAIN_GAME_IDS)[number];
export type BrainAnswer = { choice?: 'left' | 'equal' | 'right'; value?: string; cell?: number };
export type BrainPuzzle =
  | { kind: 'math-compare'; left: string; right: string }
  | { kind: 'quick-math'; expression: string }
  | { kind: 'number-sequence'; sequence: number[] }
  | { kind: 'number-hunt'; rows: number; columns: number; cells: number[]; next: number }
  | {
      kind: 'memory-matrix';
      rows: number;
      columns: number;
      phase: 'watch' | 'recall';
      highlighted?: number[];
      selected: number[];
      targetCount: number;
    };

export type BrainLevel = {
  level: number;
  rounds: number;
  seconds: number;
  mistakes: number;
  side: number;
  targets: number;
  previewMs: number;
};

const SIDES = [3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
const TARGETS = [3, 4, 5, 6, 8, 10, 12, 15, 18, 22];
const HUNT_SIDES = [3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
const HUNT_SECONDS = [45, 30, 45, 32, 48, 38, 50, 40, 48, 36];

/** One-based levels. A level only awards points after every round is cleared. */
export function brainLevel(id: BrainGameId, level: number): BrainLevel {
  const bounded = Math.max(1, Math.min(10, Math.trunc(level)));
  const index = bounded - 1;
  return {
    level: bounded,
    rounds:
      id === 'number-hunt' ? 1 : id === 'memory-matrix' ? 2 + Math.floor(index / 3) : 4 + index,
    seconds:
      id === 'number-hunt'
        ? HUNT_SECONDS[index]
        : id === 'memory-matrix'
          ? 32 + index * 4
          : 50 + index * 5,
    mistakes: bounded < 5 ? 2 : 1,
    side: id === 'number-hunt' ? HUNT_SIDES[index] : SIDES[index],
    targets: TARGETS[index],
    previewMs: 2600 - index * 160,
  };
}

export function brainScore(cleared: number): number {
  return Number.isFinite(cleared) ? Math.max(0, Math.min(10, Math.trunc(cleared))) * 100 : 0;
}

type Random = () => number;
const integer = (random: Random, min: number, max: number) =>
  min + Math.floor(Math.max(0, Math.min(0.999999999, random())) * (max - min + 1));

export function shuffleBrainCells(size: number, random: Random = Math.random): number[] {
  const cells = Array.from({ length: size }, (_, index) => index);
  for (let index = cells.length - 1; index > 0; index -= 1) {
    const other = integer(random, 0, index);
    [cells[index], cells[other]] = [cells[other], cells[index]];
  }
  return cells;
}

/** Generate an expression with a known integer result, without eval. */
function expressionFor(target: number, level: number, random: Random): string {
  const a = integer(random, 2, level < 5 ? 9 : 19);
  const b = integer(random, 2, level < 7 ? 9 : 17);
  const c = integer(random, 2, 9);
  const offset = (expression: string, amount: number) =>
    `${expression} ${amount < 0 ? '−' : '+'} ${Math.abs(amount)}`;
  switch (level) {
    case 1:
      return `${target - a} + ${a}`;
    case 2:
      return `${target + a} − ${a}`;
    case 3:
      return offset(`${a} × ${b}`, target - a * b);
    case 4:
      return offset(`${a} × ${b + 5}`, target - a * (b + 5));
    case 5:
      return `(${(target + a) * b}) ÷ ${b} − ${a}`;
    case 6:
      return `(${target + a * b}) − ${a} × ${b}`;
    case 7:
      return `(${target * b - a}) + ${a} − ${target * (b - 1)}`;
    case 8:
      return offset(`${a} × (${b} + ${c})`, target - a * (b + c));
    case 9:
      return `(${target * c + a * b} − ${a} × ${b}) ÷ ${c}`;
    default:
      return `(${offset(`${a}² + ${b} × ${c}`, target * c - a * a - b * c)}) ÷ ${c}`;
  }
}

function arithmetic(level: number, random: Random): { expression: string; answer: number } {
  const a = integer(random, level < 3 ? 2 : 11, level < 3 ? 15 : 39);
  const b = integer(random, 2, level < 5 ? 9 : 19);
  const c = integer(random, 2, 9);
  const d = integer(random, 2, 9);
  switch (level) {
    case 1:
      return { expression: `${a} + ${b}`, answer: a + b };
    case 2:
      return { expression: `${a * 3 + b * 2} − ${b * 2}`, answer: a * 3 };
    case 3:
      return { expression: `${b} × ${c}`, answer: b * c };
    case 4:
      return { expression: `${a} + ${b} × ${c}`, answer: a + b * c };
    case 5:
      return { expression: `(${a} + ${b}) × ${c}`, answer: (a + b) * c };
    case 6:
      return { expression: `${a * b} ÷ ${b} + ${c} × ${d}`, answer: a + c * d };
    case 7:
      return { expression: `${a} × ${b} − ${c} × ${d}`, answer: a * b - c * d };
    case 8:
      return { expression: `(${a} × ${b} − ${c * d}) + ${d}²`, answer: a * b - c * d + d * d };
    case 9:
      return {
        expression: `(${a * c} − ${b * c}) ÷ ${c} + ${b} × ${d}`,
        answer: a - b + b * d,
      };
    default:
      return {
        expression: `(${a}² − ${b}²) + (${c * d} ÷ ${c} − ${b}) × ${d}`,
        answer: a * a - b * b + (d - b) * d,
      };
  }
}

function sequence(level: number, random: Random): { values: number[]; answer: number } {
  const start = integer(random, 1, 15);
  const step = integer(random, 2, 6);
  const values: number[] = [];
  const length = level >= 7 ? 8 : 6;
  for (let index = 0; index <= length; index += 1) {
    const previous = values[index - 1];
    switch (level) {
      case 1:
        values.push(start + index * step);
        break;
      case 2:
        values.push(start + 70 - index * (step + 2));
        break;
      case 3:
        values.push(start * 2 ** index);
        break;
      case 4:
        values.push(start + (index * (index + 1) * step) / 2);
        break;
      case 5:
        values.push(index === 0 ? start : previous + (index % 2 ? step : -1));
        break;
      case 6:
        values.push(index < 2 ? start + index * step : previous + values[index - 2]);
        break;
      case 7:
        values.push(
          index % 2 === 0 ? start + (index / 2) * step : (start + 2) * 2 ** Math.floor(index / 2),
        );
        break;
      case 8:
        values.push(index === 0 ? start : previous * 2 + index);
        break;
      case 9:
        values.push(start + index ** 3 + index * step);
        break;
      default:
        values.push(
          index < 2 ? start + index * step : previous * 2 - values[index - 2] + index * step,
        );
    }
  }
  return { values: values.slice(0, -1), answer: values[values.length - 1] };
}

export type BrainChallenge = {
  puzzle: BrainPuzzle;
  solution: string | number | number[];
};

export function createBrainChallenge(
  id: BrainGameId,
  level: number,
  random: Random = Math.random,
): BrainChallenge {
  const config = brainLevel(id, level);
  const difficulty = config.level;
  if (id === 'math-compare') {
    const target = integer(random, difficulty < 3 ? 12 : 30, difficulty < 3 ? 30 : 160);
    const difference = integer(random, -1, 1) * integer(random, 1, difficulty + 3);
    return {
      puzzle: {
        kind: id,
        left: expressionFor(target, difficulty, random),
        right: expressionFor(target + difference, difficulty, random),
      },
      solution: difference < 0 ? 'left' : difference > 0 ? 'right' : 'equal',
    };
  }
  if (id === 'quick-math') {
    const question = arithmetic(difficulty, random);
    return { puzzle: { kind: id, expression: question.expression }, solution: question.answer };
  }
  if (id === 'number-sequence') {
    const question = sequence(difficulty, random);
    return { puzzle: { kind: id, sequence: question.values }, solution: question.answer };
  }
  if (id === 'number-hunt') {
    const cells = shuffleBrainCells(config.side ** 2, random).map((cell) => cell + 1);
    return {
      puzzle: { kind: id, rows: config.side, columns: config.side, cells, next: 1 },
      solution: cells.map((_, index) => cells.indexOf(index + 1)),
    };
  }
  const highlighted = shuffleBrainCells(config.side ** 2, random).slice(0, config.targets);
  return {
    puzzle: {
      kind: id,
      rows: config.side,
      columns: config.side,
      phase: 'watch',
      highlighted,
      selected: [],
      targetCount: config.targets,
    },
    solution: highlighted,
  };
}

export function brainNumericAnswerMatches(value: string | undefined, expected: number): boolean {
  const normalized = value?.trim().replace('−', '-');
  return Boolean(normalized && /^-?\d+$/.test(normalized) && Number(normalized) === expected);
}
