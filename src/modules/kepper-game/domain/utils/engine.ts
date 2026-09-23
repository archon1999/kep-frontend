import type {
  Command,
  Direction,
  Level,
  ParsedMap,
  RunResult,
  Scenario,
  TraceFrame,
} from '../entities/game.types.ts';

export const tileKey = (x: number, z: number) => `${x},${z}`;

export const parseMap = (rows: readonly string[]): ParsedMap => {
  const tiles = new Set<string>();
  const crystals = new Set<string>();
  let start: ParsedMap['start'] | undefined;
  let goal: ParsedMap['goal'] | undefined;
  rows.forEach((row, z) => {
    for (let x = 0; x < row.length; x += 1) {
      const cell = row[x];
      if (cell === ' ') continue;
      tiles.add(tileKey(x, z));
      if (cell === 'S') start = { x, z };
      if (cell === 'G') goal = { x, z };
      if (cell === 'K') crystals.add(tileKey(x, z));
    }
  });
  if (!start || !goal) throw new Error('Invalid game map');
  return {
    tiles,
    crystals,
    start,
    goal,
    width: Math.max(...rows.map((row) => row.length)),
    height: rows.length,
  };
};

const vectors = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
] as const;

export const runScenario = (scenario: Scenario, program: readonly Command[]): RunResult => {
  const map = parseMap(scenario.map);
  let x = map.start.x;
  let z = map.start.z;
  let direction: Direction = 0;
  let actions = 0;
  const collected = new Set<string>();
  const trace: TraceFrame[] = [{ x, z, direction, collected: [], action: 'start' }];
  let failure: RunResult['failure'];

  const blocked = () => {
    const [dx, dz] = vectors[direction];
    return !map.tiles.has(tileKey(x + dx, z + dz));
  };
  const frame = (action: TraceFrame['action']) => {
    trace.push({ x, z, direction, collected: [...collected], action });
  };
  const execute = (commands: readonly Command[], depth: number) => {
    if (depth > 8) {
      failure = 'limit';
      return;
    }
    for (const command of commands) {
      if (failure || (x === map.goal.x && z === map.goal.z && collected.size === map.crystals.size))
        return;
      if (command.kind === 'repeat') {
        if (!Number.isInteger(command.count) || command.count < 1 || command.count > 8) {
          failure = 'limit';
          return;
        }
        for (let index = 0; index < command.count && !failure; index += 1) {
          execute(command.body, depth + 1);
        }
        continue;
      }
      if (command.kind === 'ifBlocked') {
        execute(blocked() ? command.yes : command.no, depth + 1);
        continue;
      }
      actions += 1;
      if (actions > 128) {
        failure = 'limit';
        return;
      }
      if (command.kind === 'left') direction = ((direction + 3) % 4) as Direction;
      if (command.kind === 'right') direction = ((direction + 1) % 4) as Direction;
      if (command.kind === 'move') {
        if (blocked()) {
          failure = 'blocked';
          return;
        }
        const [dx, dz] = vectors[direction];
        x += dx;
        z += dz;
        const key = tileKey(x, z);
        if (map.crystals.has(key)) collected.add(key);
      }
      frame(command.kind);
      if (x === map.goal.x && z === map.goal.z && collected.size !== map.crystals.size) {
        failure = 'crystal';
        return;
      }
    }
  };

  execute(program, 0);
  const success =
    !failure && x === map.goal.x && z === map.goal.z && collected.size === map.crystals.size;
  return { success, failure: success ? undefined : (failure ?? 'unfinished'), trace, actions };
};

export const runLevel = (level: Level, program: readonly Command[]) =>
  level.scenarios.map((scenario) => ({ scenario, result: runScenario(scenario, program) }));

export const countCommands = (commands: readonly Command[]): number =>
  commands.reduce((count, command) => {
    if (command.kind === 'repeat') return count + 1 + countCommands(command.body);
    if (command.kind === 'ifBlocked')
      return count + 1 + countCommands(command.yes) + countCommands(command.no);
    return count + 1;
  }, 0);
