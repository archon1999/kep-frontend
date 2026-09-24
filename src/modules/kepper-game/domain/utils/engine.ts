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
  if (!rows.length) throw new Error('Invalid game map');
  const tiles = new Set<string>();
  const crystals = new Set<string>();
  const switches = new Set<string>();
  const gates = new Set<string>();
  const fragile = new Set<string>();
  const conveyors = new Map<string, Direction>();
  const teleportGroups = new Map<string, string[]>();
  const teleports = new Map<string, string>();
  let start: ParsedMap['start'] | undefined;
  let goal: ParsedMap['goal'] | undefined;
  rows.forEach((row, z) => {
    for (let x = 0; x < row.length; x += 1) {
      const cell = row[x];
      if (cell === ' ') continue;
      if (!'.SGKPDFAB><^v'.includes(cell)) throw new Error(`Unknown game tile: ${cell}`);
      const key = tileKey(x, z);
      tiles.add(key);
      if (cell === 'S') {
        if (start) throw new Error('Game map has multiple starts');
        start = { x, z };
      }
      if (cell === 'G') {
        if (goal) throw new Error('Game map has multiple goals');
        goal = { x, z };
      }
      if (cell === 'K') crystals.add(key);
      if (cell === 'P') switches.add(key);
      if (cell === 'D') gates.add(key);
      if (cell === 'F') fragile.add(key);
      if (cell === 'A' || cell === 'B') {
        teleportGroups.set(cell, [...(teleportGroups.get(cell) ?? []), key]);
      }
      if (cell === '>') conveyors.set(key, 0);
      if (cell === 'v') conveyors.set(key, 1);
      if (cell === '<') conveyors.set(key, 2);
      if (cell === '^') conveyors.set(key, 3);
    }
  });
  if (!start || !goal) throw new Error('Invalid game map');
  teleportGroups.forEach((points) => {
    if (points.length !== 2) throw new Error('Teleporters must be paired');
    teleports.set(points[0], points[1]);
    teleports.set(points[1], points[0]);
  });
  return {
    tiles,
    crystals,
    switches,
    gates,
    fragile,
    teleports,
    conveyors,
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
  let gateOpen = false;
  const collected = new Set<string>();
  const collapsed = new Set<string>();
  const trace: TraceFrame[] = [
    { x, z, direction, collected: [], gateOpen, collapsed: [], action: 'start' },
  ];
  let failure: RunResult['failure'];

  const passable = (targetX: number, targetZ: number) => {
    const key = tileKey(targetX, targetZ);
    return map.tiles.has(key) && !collapsed.has(key) && (gateOpen || !map.gates.has(key));
  };
  const ahead = () => {
    const [dx, dz] = vectors[direction];
    return tileKey(x + dx, z + dz);
  };
  const frame = (action: TraceFrame['action']) => {
    trace.push({
      x,
      z,
      direction,
      collected: [...collected],
      gateOpen,
      collapsed: [...collapsed],
      action,
    });
  };
  const arrived = () => {
    if (map.crystals.has(tileKey(x, z))) collected.add(tileKey(x, z));
    if (map.switches.has(tileKey(x, z))) gateOpen = true;
    if (x === map.goal.x && z === map.goal.z && collected.size !== map.crystals.size) {
      failure = 'crystal';
    }
  };
  const relocate = (targetX: number, targetZ: number, action: TraceFrame['action']) => {
    if (!passable(targetX, targetZ)) {
      failure = 'blocked';
      return;
    }
    const previous = tileKey(x, z);
    if (map.fragile.has(previous)) collapsed.add(previous);
    x = targetX;
    z = targetZ;
    arrived();
    frame(action);
  };
  const forcedMovement = () => {
    let mayTeleport = true;
    let hops = 0;
    while (!failure && hops < 16) {
      if (x === map.goal.x && z === map.goal.z) return;
      const key = tileKey(x, z);
      const destination = mayTeleport ? map.teleports.get(key) : undefined;
      if (destination) {
        const [targetX, targetZ] = destination.split(',').map(Number);
        relocate(targetX, targetZ, 'teleport');
        mayTeleport = false;
        hops += 1;
        continue;
      }
      const conveyorDirection = map.conveyors.get(key);
      if (conveyorDirection === undefined) return;
      const [dx, dz] = vectors[conveyorDirection];
      relocate(x + dx, z + dz, 'conveyor');
      mayTeleport = true;
      hops += 1;
    }
    if (hops >= 16) failure = 'limit';
  };
  const move = (distance: number, action: 'move' | 'jump') => {
    const [dx, dz] = vectors[direction];
    relocate(x + dx * distance, z + dz * distance, action);
    if (!failure) forcedMovement();
  };
  const won = () => x === map.goal.x && z === map.goal.z && collected.size === map.crystals.size;
  const execute = (commands: readonly Command[], depth: number) => {
    if (depth > 8) {
      failure = 'limit';
      return;
    }
    for (const command of commands) {
      if (failure || won()) return;
      if (command.kind === 'repeat') {
        if (!Number.isInteger(command.count) || command.count < 1 || command.count > 8) {
          failure = 'limit';
          return;
        }
        for (let index = 0; index < command.count && !failure && !won(); index += 1) {
          execute(command.body, depth + 1);
        }
        continue;
      }
      if (command.kind === 'ifBlocked' || command.kind === 'ifCrystalAhead') {
        const [dx, dz] = vectors[direction];
        const condition =
          command.kind === 'ifBlocked'
            ? !passable(x + dx, z + dz)
            : map.crystals.has(ahead()) && !collected.has(ahead());
        execute(condition ? command.yes : command.no, depth + 1);
        continue;
      }
      actions += 1;
      if (actions > 128) {
        failure = 'limit';
        return;
      }
      if (command.kind === 'left') direction = ((direction + 3) % 4) as Direction;
      if (command.kind === 'right') direction = ((direction + 1) % 4) as Direction;
      if (command.kind === 'move') move(1, 'move');
      if (command.kind === 'jump') move(2, 'jump');
      if (command.kind === 'left' || command.kind === 'right') frame(command.kind);
    }
  };

  execute(program, 0);
  const success = !failure && won();
  return { success, failure: success ? undefined : (failure ?? 'unfinished'), trace, actions };
};

export const runLevel = (level: Level, program: readonly Command[]) =>
  level.scenarios.map((scenario) => ({ scenario, result: runScenario(scenario, program) }));

export const countCommands = (commands: readonly Command[]): number =>
  commands.reduce((count, command) => {
    if (command.kind === 'repeat') return count + 1 + countCommands(command.body);
    if (command.kind === 'ifBlocked' || command.kind === 'ifCrystalAhead')
      return count + 1 + countCommands(command.yes) + countCommands(command.no);
    return count + 1;
  }, 0);
