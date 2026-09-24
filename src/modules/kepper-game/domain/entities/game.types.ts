export type Direction = 0 | 1 | 2 | 3;

export type Command =
  | { id: string; kind: 'move' | 'left' | 'right' | 'jump' }
  | { id: string; kind: 'repeat'; count: number; body: Command[] }
  | { id: string; kind: 'ifBlocked' | 'ifCrystalAhead'; yes: Command[]; no: Command[] };

export type Scenario = {
  id: string;
  map: readonly string[];
};

export type Level = {
  id: number;
  titleKey: string;
  descriptionKey: string;
  hintKey: string;
  conceptKey: string;
  available: readonly Command['kind'][];
  scenarios: readonly Scenario[];
  starter: readonly Command[];
  par: number;
};

export type ParsedMap = {
  tiles: ReadonlySet<string>;
  crystals: ReadonlySet<string>;
  switches: ReadonlySet<string>;
  gates: ReadonlySet<string>;
  fragile: ReadonlySet<string>;
  teleports: ReadonlyMap<string, string>;
  conveyors: ReadonlyMap<string, Direction>;
  start: { x: number; z: number };
  goal: { x: number; z: number };
  width: number;
  height: number;
};

export type TraceFrame = {
  x: number;
  z: number;
  direction: Direction;
  collected: readonly string[];
  gateOpen: boolean;
  collapsed: readonly string[];
  action: 'start' | 'move' | 'left' | 'right' | 'jump' | 'teleport' | 'conveyor';
};

export type Failure = 'blocked' | 'crystal' | 'unfinished' | 'limit';

export type RunResult = {
  success: boolean;
  failure?: Failure;
  trace: TraceFrame[];
  actions: number;
};
