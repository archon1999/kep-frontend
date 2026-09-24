export type LogicGate = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR';
export type LogicInput = 0 | 1;
export type CircuitPairing = 'AB_CD' | 'AC_BD' | 'AD_BC';
export type CircuitInputLabel = 'A' | 'B' | 'C' | 'D';

export interface CircuitConfig {
  firstGate: LogicGate;
  secondGate: LogicGate;
  thirdGate: LogicGate;
  invert: boolean;
  pairing: CircuitPairing;
}

export interface CircuitPuzzle {
  id: string;
  inputCount: 2 | 3 | 4;
  gates: readonly LogicGate[];
  allowInvert: boolean;
  pairings: readonly CircuitPairing[];
  target: CircuitConfig;
}

export interface CircuitRow {
  a: LogicInput;
  b: LogicInput;
  c: LogicInput;
  d: LogicInput;
  expected: LogicInput;
  actual: LogicInput;
}

export const STARTER_GATES: readonly LogicGate[] = ['AND', 'OR'];
export const GATES: readonly LogicGate[] = [...STARTER_GATES, 'XOR'];
export const NAND_GATES: readonly LogicGate[] = [...GATES, 'NAND'];
export const ADVANCED_GATES: readonly LogicGate[] = [...NAND_GATES, 'NOR'];
export const CIRCUIT_PAIRINGS: readonly CircuitPairing[] = ['AB_CD', 'AC_BD', 'AD_BC'];
export const DEFAULT_PAIRING: CircuitPairing = 'AB_CD';
export const circuitPairLabels: Record<
  CircuitPairing,
  readonly [
    readonly [CircuitInputLabel, CircuitInputLabel],
    readonly [CircuitInputLabel, CircuitInputLabel],
  ]
> = {
  AB_CD: [
    ['A', 'B'],
    ['C', 'D'],
  ],
  AC_BD: [
    ['A', 'C'],
    ['B', 'D'],
  ],
  AD_BC: [
    ['A', 'D'],
    ['B', 'C'],
  ],
};

const firstPairing = CIRCUIT_PAIRINGS.slice(0, 1);
const firstTwoPairings = CIRCUIT_PAIRINGS.slice(0, 2);

// 2 inputs: A gate1 B
// 3 inputs: (A gate1 B) gate2 C
// 4 inputs: (pair1 gate1) gate3 (pair2 gate2), with pair wiring selected separately.
export const CIRCUIT_PUZZLES: readonly CircuitPuzzle[] = [
  {
    id: 'and',
    inputCount: 2,
    gates: STARTER_GATES,
    allowInvert: false,
    pairings: firstPairing,
    target: {
      firstGate: 'AND',
      secondGate: 'OR',
      thirdGate: 'OR',
      invert: false,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'xor',
    inputCount: 2,
    gates: GATES,
    allowInvert: false,
    pairings: firstPairing,
    target: {
      firstGate: 'XOR',
      secondGate: 'OR',
      thirdGate: 'OR',
      invert: false,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'xnor',
    inputCount: 2,
    gates: GATES,
    allowInvert: true,
    pairings: firstPairing,
    target: {
      firstGate: 'XOR',
      secondGate: 'OR',
      thirdGate: 'OR',
      invert: true,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'switch',
    inputCount: 3,
    gates: GATES,
    allowInvert: true,
    pairings: firstPairing,
    target: {
      firstGate: 'AND',
      secondGate: 'XOR',
      thirdGate: 'OR',
      invert: false,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'gate',
    inputCount: 3,
    gates: NAND_GATES,
    allowInvert: true,
    pairings: firstPairing,
    target: {
      firstGate: 'NAND',
      secondGate: 'OR',
      thirdGate: 'OR',
      invert: true,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'filter',
    inputCount: 3,
    gates: ADVANCED_GATES,
    allowInvert: true,
    pairings: firstPairing,
    target: {
      firstGate: 'NOR',
      secondGate: 'OR',
      thirdGate: 'OR',
      invert: true,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'splitChannels',
    inputCount: 4,
    gates: ADVANCED_GATES,
    allowInvert: false,
    pairings: firstPairing,
    target: {
      firstGate: 'AND',
      secondGate: 'XOR',
      thirdGate: 'XOR',
      invert: false,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'evenParity',
    inputCount: 4,
    gates: ADVANCED_GATES,
    allowInvert: true,
    pairings: firstPairing,
    target: {
      firstGate: 'XOR',
      secondGate: 'XOR',
      thirdGate: 'XOR',
      invert: true,
      pairing: DEFAULT_PAIRING,
    },
  },
  {
    id: 'mixed',
    inputCount: 4,
    gates: ADVANCED_GATES,
    allowInvert: true,
    pairings: firstTwoPairings,
    target: {
      firstGate: 'AND',
      secondGate: 'XOR',
      thirdGate: 'XOR',
      invert: false,
      pairing: 'AC_BD',
    },
  },
  {
    id: 'final',
    inputCount: 4,
    gates: ADVANCED_GATES,
    allowInvert: true,
    pairings: CIRCUIT_PAIRINGS,
    target: {
      firstGate: 'XOR',
      secondGate: 'AND',
      thirdGate: 'XOR',
      invert: true,
      pairing: 'AD_BC',
    },
  },
];

export const DEFAULT_CIRCUIT: CircuitConfig = {
  firstGate: 'OR',
  secondGate: 'OR',
  thirdGate: 'OR',
  invert: false,
  pairing: DEFAULT_PAIRING,
};

export function applyGate(gate: LogicGate, a: LogicInput, b: LogicInput): LogicInput {
  switch (gate) {
    case 'AND':
      return (a && b) as LogicInput;
    case 'OR':
      return (a || b) as LogicInput;
    case 'XOR':
      return (a ^ b) as LogicInput;
    case 'NAND':
      return (1 - (a && b)) as LogicInput;
    case 'NOR':
      return (1 - (a || b)) as LogicInput;
  }
}

export function evaluateCircuit(
  config: CircuitConfig,
  a: LogicInput,
  b: LogicInput,
  c: LogicInput,
  d: LogicInput,
  inputCount: 2 | 3 | 4,
): LogicInput {
  const inputs = { A: a, B: b, C: c, D: d };
  const [firstPair, secondPair] = circuitPairLabels[config.pairing];
  const first = applyGate(config.firstGate, inputs[firstPair[0]], inputs[firstPair[1]]);
  const output =
    inputCount === 2
      ? first
      : inputCount === 3
        ? applyGate(config.secondGate, first, c)
        : applyGate(
            config.thirdGate,
            first,
            applyGate(config.secondGate, inputs[secondPair[0]], inputs[secondPair[1]]),
          );
  return config.invert ? ((1 - output) as LogicInput) : output;
}

export function circuitRows(puzzle: CircuitPuzzle, config: CircuitConfig): CircuitRow[] {
  const combinations = 1 << puzzle.inputCount;
  return Array.from({ length: combinations }, (_, index) => {
    const a = ((index >> (puzzle.inputCount - 1)) & 1) as LogicInput;
    const b = ((index >> (puzzle.inputCount - 2)) & 1) as LogicInput;
    const c = (puzzle.inputCount >= 3 ? (index >> (puzzle.inputCount - 3)) & 1 : 0) as LogicInput;
    const d = (puzzle.inputCount === 4 ? index & 1 : 0) as LogicInput;
    return {
      a,
      b,
      c,
      d,
      expected: evaluateCircuit(puzzle.target, a, b, c, d, puzzle.inputCount),
      actual: evaluateCircuit(config, a, b, c, d, puzzle.inputCount),
    };
  });
}

export function circuitMatches(puzzle: CircuitPuzzle, config: CircuitConfig): boolean {
  if (
    !puzzle.gates.includes(config.firstGate) ||
    (puzzle.inputCount >= 3 && !puzzle.gates.includes(config.secondGate)) ||
    (puzzle.inputCount === 4 && !puzzle.gates.includes(config.thirdGate)) ||
    (config.invert && !puzzle.allowInvert) ||
    !puzzle.pairings.includes(config.pairing)
  ) {
    return false;
  }
  return circuitRows(puzzle, config).every((row) => row.actual === row.expected);
}

export function circuitRoundScore(attempts: number): number {
  return Math.max(40, 100 - (Math.max(1, Math.floor(attempts)) - 1) * 15);
}
