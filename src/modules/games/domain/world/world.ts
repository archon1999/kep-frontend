export type WorldPoint = { x: number; z: number };

export type WorldCollectible = WorldPoint & { id: string };
export type WorldTerminal = WorldPoint & { id: string } & (
    | { response: 'choice'; answer: number; optionCount: number }
    | { response: 'integer'; answer: number }
    | { response: 'integer-list'; answer: readonly number[] }
  );
export type WorldStation = WorldPoint & { id: string; phase: number };
export type WorldSentry = {
  id: string;
  start: WorldPoint;
  end: WorldPoint;
  period: number;
  phase: number;
};
export type WorldSlowZone = WorldPoint & { radius: number; speedFactor: number };
export type WorldJumpBarrier = {
  id: string;
  start: WorldPoint;
  end: WorldPoint;
  clearance: number;
};
export type WorldBridge = { start: WorldPoint; end: WorldPoint; width: number };
export type WorldBridgeGap = { startT: number; endT: number };
export type WorldBeacon = WorldPoint & {
  id: string;
  kind: 'airborne' | 'landing';
  radius: number;
  minHeight: number;
};
export type WorldRoute = {
  id: string;
  checkpoints: readonly WorldPoint[];
  radius: number;
  timeLimit: number;
};
export type WorldRouteProgress = { nextCheckpoint: number; startedAt: number | null };
export type WorldMotionSample = { point: WorldPoint; height: number };
export type WorldProgressCounts = {
  shards: number;
  terminals: number;
  stations: number;
  beacons: number;
  routes: number;
};

export const WORLD_RADIUS = 25.5;
export const WORLD_SECOND_ISLAND_CENTER: WorldPoint = { x: 44, z: -11 };
export const WORLD_SECOND_ISLAND_RADIUS = 14.5;
export const WORLD_LAYOUT_SCALE = 1.55;
export const WORLD_SPEED = 4.3;
export const WORLD_STATION_PERIOD = 4.8;
export const WORLD_STATION_WINDOW = 2.2;
export const WORLD_STATION_HOLD = 1.35;
export const WORLD_STATION_RADIUS = 0.88;
export const WORLD_SENTRY_RADIUS = 0.78;
export const WORLD_JUMP_DURATION = 0.82;
export const WORLD_JUMP_PEAK_HEIGHT = 1.25;
export const WORLD_EDGE_INSET = 0.55;
const WORLD_BRIDGE_EDGE_INSET = 0.25;

export const worldCoastRadius = (angle: number) =>
  WORLD_RADIUS *
  (0.923 +
    0.045 * Math.sin(3 * angle + 0.4) +
    0.022 * Math.cos(5 * angle - 0.5) +
    0.01 * Math.sin(9 * angle + 1.1));

export const worldCoastline: readonly WorldPoint[] = Array.from({ length: 96 }, (_, index) => {
  const angle = (index / 96) * Math.PI * 2;
  const radius = worldCoastRadius(angle);
  return { x: radius * Math.cos(angle), z: radius * Math.sin(angle) };
});

export const worldSecondCoastRadius = (angle: number) =>
  WORLD_SECOND_ISLAND_RADIUS *
  (0.92 + 0.05 * Math.sin(4 * angle + 0.7) + 0.02 * Math.cos(7 * angle - 0.4));

export const worldSecondCoastline: readonly WorldPoint[] = Array.from(
  { length: 96 },
  (_, index) => {
    const angle = (index / 96) * Math.PI * 2;
    const radius = worldSecondCoastRadius(angle);
    return {
      x: WORLD_SECOND_ISLAND_CENTER.x + radius * Math.cos(angle),
      z: WORLD_SECOND_ISLAND_CENTER.z + radius * Math.sin(angle),
    };
  },
);

// The bridge overlaps dry ground at both ends. Its safe walking width is inset
// from the visible deck so the avatar does not appear to hover beyond an edge.
export const worldBridge: WorldBridge = {
  start: { x: 20.5, z: -6 },
  end: { x: 34, z: -8 },
  width: 3.5,
};
export const worldBridgeGaps: readonly WorldBridgeGap[] = [{ startT: 0.44, endT: 0.57 }];

export const worldBridgePointAt = (t: number): WorldPoint => ({
  x: worldBridge.start.x + (worldBridge.end.x - worldBridge.start.x) * t,
  z: worldBridge.start.z + (worldBridge.end.z - worldBridge.start.z) * t,
});

const bridgeCoordinates = (point: WorldPoint) => {
  const dx = worldBridge.end.x - worldBridge.start.x;
  const dz = worldBridge.end.z - worldBridge.start.z;
  const length = Math.hypot(dx, dz);
  const px = point.x - worldBridge.start.x;
  const pz = point.z - worldBridge.start.z;
  return {
    t: (px * dx + pz * dz) / (length * length),
    offset: (px * -dz + pz * dx) / length,
    normal: { x: -dz / length, z: dx / length },
  };
};

export const worldBridgeContains = (point: WorldPoint) => {
  const { t, offset } = bridgeCoordinates(point);
  return (
    t >= -1e-9 &&
    t <= 1 + 1e-9 &&
    Math.abs(offset) <= worldBridge.width / 2 - WORLD_BRIDGE_EDGE_INSET
  );
};

const spreadPoint = <T extends WorldPoint>(point: T): T => ({
  ...point,
  x: Number((point.x * WORLD_LAYOUT_SCALE).toFixed(2)),
  z: Number((point.z * WORLD_LAYOUT_SCALE).toFixed(2)),
});

const secondIslandPoint = <T extends WorldPoint>(point: T): T => ({
  ...point,
  x: Number((WORLD_SECOND_ISLAND_CENTER.x + point.x * WORLD_LAYOUT_SCALE).toFixed(2)),
  z: Number((WORLD_SECOND_ISLAND_CENTER.z + point.z * WORLD_LAYOUT_SCALE).toFixed(2)),
});

export const worldSlowZones: readonly WorldSlowZone[] = [
  { x: -8.5, z: -8.5, radius: 2, speedFactor: 0.72 },
  { x: 8.3, z: -7.4, radius: 1.8, speedFactor: 0.72 },
  { x: -7.7, z: 8, radius: 1.9, speedFactor: 0.72 },
  { x: 7, z: 8.5, radius: 1.9, speedFactor: 0.72 },
].map((zone) => ({ ...spreadPoint(zone), radius: zone.radius * WORLD_LAYOUT_SCALE }));

export const worldMoveSpeed = (point: WorldPoint) => {
  const zone = worldSlowZones.find((item) => worldDistance(point, item) < item.radius);
  return WORLD_SPEED * (zone?.speedFactor ?? 1);
};

export const worldShards: readonly WorldCollectible[] = [
  { id: 's1', x: -10.5, z: -8 },
  { id: 's2', x: -4, z: -3 },
  { id: 's3', x: 1, z: -11.5 },
  { id: 's4', x: -3, z: -4 },
  { id: 's5', x: -9, z: 2 },
  { id: 's6', x: -2, z: 4 },
  { id: 's7', x: 4, z: 1 },
  { id: 's8', x: 3, z: -3 },
  { id: 's9', x: -7.5, z: 10 },
  { id: 's10', x: 0, z: 4 },
  { id: 's11', x: -6.5, z: 1.2 },
  { id: 's12', x: 3, z: -3 },
  { id: 's13', x: -1, z: 9 },
  { id: 's14', x: 6, z: 0 },
].map((shard) =>
  ['s4', 's8', 's10', 's14'].includes(shard.id) ? secondIslandPoint(shard) : spreadPoint(shard),
);

export const worldTerminals: readonly WorldTerminal[] = (
  [
    { id: 't1', x: -7, z: -0.8, response: 'choice', answer: 2, optionCount: 4 },
    { id: 't2', x: -7, z: 8, response: 'choice', answer: 2, optionCount: 4 },
    { id: 't3', x: 0, z: -5, response: 'integer', answer: 5 },
    { id: 't4', x: -2, z: -1, response: 'integer', answer: 4 },
    { id: 't5', x: 9.5, z: 8.5, response: 'integer', answer: 7 },
    { id: 't6', x: -10.5, z: 5.5, response: 'integer', answer: 16 },
    { id: 't7', x: 1.5, z: 8.6, response: 'integer', answer: 9 },
    { id: 't8', x: 4, z: 3, response: 'integer-list', answer: [8, 4, 4] },
  ] satisfies WorldTerminal[]
).map((terminal) =>
  ['t4', 't8'].includes(terminal.id) ? secondIslandPoint(terminal) : spreadPoint(terminal),
);

const parseInteger = (value: string): number | null => {
  const trimmed = value.trim();
  if (!/^[+-]?\d+$/.test(trimmed)) return null;
  const number = Number(trimmed);
  return Number.isSafeInteger(number) ? number : null;
};

const parseIntegerList = (value: string): number[] | null => {
  let trimmed = value.trim();
  if (trimmed.startsWith('[') !== trimmed.endsWith(']')) return null;
  if (trimmed.startsWith('[')) trimmed = trimmed.slice(1, -1).trim();
  if (!/^[+-]?\d+(?:\s*(?:,|;|\s+)\s*[+-]?\d+)*$/.test(trimmed)) return null;
  const values = trimmed.split(/[\s,;]+/).map(Number);
  return values.every(Number.isSafeInteger) ? values : null;
};

export const isWorldTerminalAnswerFormat = (terminal: WorldTerminal, response: number | string) => {
  if (terminal.response === 'choice') {
    return (
      typeof response === 'number' &&
      Number.isInteger(response) &&
      response >= 0 &&
      response < terminal.optionCount
    );
  }
  if (typeof response !== 'string') return false;
  return terminal.response === 'integer'
    ? parseInteger(response) !== null
    : parseIntegerList(response) !== null;
};

export const isWorldTerminalAnswerCorrect = (
  terminal: WorldTerminal,
  response: number | string,
) => {
  if (!isWorldTerminalAnswerFormat(terminal, response)) return false;
  if (terminal.response === 'choice') return response === terminal.answer;
  if (typeof response !== 'string') return false;
  if (terminal.response === 'integer') return parseInteger(response) === terminal.answer;
  const values = parseIntegerList(response);
  return (
    values?.length === terminal.answer.length &&
    values.every((value, index) => value === terminal.answer[index])
  );
};

// The pulse phases are staggered so crossing the island is a timing decision.
export const worldStations: readonly WorldStation[] = [
  { id: 'p1', x: -5, z: -5, phase: 0 },
  { id: 'p2', x: 6.5, z: -10.5, phase: 1.2 },
  { id: 'p3', x: -4.5, z: 10, phase: 2.4 },
  { id: 'p4', x: -1, z: 5, phase: 3.6 },
].map((station) => (station.id === 'p4' ? secondIslandPoint(station) : spreadPoint(station)));

export const worldSentries: readonly WorldSentry[] = [
  { id: 'g1', start: { x: -7, z: -2.7 }, end: { x: 7, z: -2.7 }, period: 8, phase: 0.2 },
  { id: 'g2', start: { x: -5, z: 6.3 }, end: { x: 5, z: 6.3 }, period: 7, phase: 0.65 },
  { id: 'g3', start: { x: 6, z: -8 }, end: { x: 6, z: 8 }, period: 9, phase: 0.1 },
  { id: 'g4', start: { x: -3, z: -6 }, end: { x: 4, z: -6 }, period: 8.5, phase: 0.35 },
  { id: 'g5', start: { x: -11, z: -7 }, end: { x: -8, z: 5 }, period: 9.5, phase: 0.72 },
].map((sentry) => ({
  ...sentry,
  start: sentry.id === 'g4' ? secondIslandPoint(sentry.start) : spreadPoint(sentry.start),
  end: sentry.id === 'g4' ? secondIslandPoint(sentry.end) : spreadPoint(sentry.end),
}));

// Each short rail cuts across a useful route but leaves both ends open. A jump
// takes the direct path; walking around remains possible if a player misses it.
export const worldJumpBarriers: readonly WorldJumpBarrier[] = [
  { id: 'j1', start: { x: -4.5, z: -1.8 }, end: { x: -1.5, z: -1.8 }, clearance: 0.54 },
  { id: 'j2', start: { x: -8, z: 4.1 }, end: { x: -5, z: 4.1 }, clearance: 0.54 },
  { id: 'j3', start: { x: 0, z: -4.3 }, end: { x: 3, z: -4.3 }, clearance: 0.54 },
].map((barrier) => ({
  ...barrier,
  start: barrier.id === 'j3' ? secondIslandPoint(barrier.start) : spreadPoint(barrier.start),
  end: barrier.id === 'j3' ? secondIslandPoint(barrier.end) : spreadPoint(barrier.end),
}));

// Two crystals must be touched in the air; the third is a precise landing.
// They sit just beyond rails so a jump can both clear a rail and earn progress.
export const worldBeacons: readonly WorldBeacon[] = (
  [
    { id: 'b1', x: -3, z: -0.65, kind: 'airborne', radius: 0.95, minHeight: 0.55 },
    { id: 'b2', x: -6.5, z: 5.2, kind: 'airborne', radius: 0.95, minHeight: 0.55 },
    { id: 'b3', x: 1, z: -3, kind: 'landing', radius: 1.05, minHeight: 0 },
  ] satisfies WorldBeacon[]
).map((beacon) => (beacon.id === 'b3' ? secondIslandPoint(beacon) : spreadPoint(beacon)));

// Route checkpoints are ordered and timed. They involve traversal rather than
// another multiple-choice question; progress within a run is intentionally
// transient while the completed route ID is persisted.
export const worldRoutes: readonly WorldRoute[] = [
  {
    id: 'r1',
    checkpoints: [
      { x: -12, z: -3 },
      { x: -7.5, z: -0.4 },
      { x: -5.2, z: 2.1 },
      { x: -6.5, z: 5.2 },
    ],
    radius: 0.9,
    timeLimit: 11,
  },
  {
    id: 'r2',
    checkpoints: [
      { x: -5, z: 1 },
      { x: -3, z: -4 },
      { x: 2, z: -4.5 },
      { x: 5, z: 2 },
    ],
    radius: 0.9,
    timeLimit: 13,
  },
].map((route) => ({
  ...route,
  checkpoints: route.checkpoints.map(route.id === 'r2' ? secondIslandPoint : spreadPoint),
  timeLimit: Math.ceil(route.timeLimit * WORLD_LAYOUT_SCALE),
}));

export const worldJumpHeight = (secondsSinceTakeoff: number) => {
  if (secondsSinceTakeoff <= 0 || secondsSinceTakeoff >= WORLD_JUMP_DURATION) return 0;
  const progress = secondsSinceTakeoff / WORLD_JUMP_DURATION;
  return WORLD_JUMP_PEAK_HEIGHT * 4 * progress * (1 - progress);
};

const segmentsCross = (a: WorldPoint, b: WorldPoint, c: WorldPoint, d: WorldPoint) => {
  const rx = b.x - a.x;
  const rz = b.z - a.z;
  const sx = d.x - c.x;
  const sz = d.z - c.z;
  const denominator = rx * sz - rz * sx;
  if (Math.abs(denominator) < 1e-8) return false;
  const dx = c.x - a.x;
  const dz = c.z - a.z;
  const t = (dx * sz - dz * sx) / denominator;
  const u = (dx * rz - dz * rx) / denominator;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

export const worldTraverse = (
  from: WorldPoint,
  to: WorldPoint,
  jumpHeight: number,
): { position: WorldPoint; blockedBy: string | null } => {
  const barrier = worldJumpBarriers.find(
    (item) => jumpHeight < item.clearance && segmentsCross(from, to, item.start, item.end),
  );
  return barrier ? { position: from, blockedBy: barrier.id } : { position: to, blockedBy: null };
};

export const worldBeaconTriggered = (
  beacon: WorldBeacon,
  previous: WorldMotionSample,
  current: WorldMotionSample,
) => {
  if (worldDistance(current.point, beacon) > beacon.radius) return false;
  if (beacon.kind === 'airborne') return current.height >= beacon.minHeight;
  return previous.height > 0 && current.height === 0;
};

export const initialWorldRouteProgress = (): WorldRouteProgress => ({
  nextCheckpoint: 0,
  startedAt: null,
});

export const worldAdvanceRoute = (
  route: WorldRoute,
  previous: WorldRouteProgress,
  point: WorldPoint,
  elapsedSeconds: number,
): { progress: WorldRouteProgress; completed: boolean; timedOut: boolean } => {
  if (previous.nextCheckpoint >= route.checkpoints.length) {
    return { progress: previous, completed: true, timedOut: false };
  }
  const timedOut =
    previous.startedAt !== null && elapsedSeconds - previous.startedAt > route.timeLimit;
  const progress = timedOut ? initialWorldRouteProgress() : previous;
  const checkpoint = route.checkpoints[progress.nextCheckpoint];
  if (worldDistance(point, checkpoint) > route.radius) {
    return { progress, completed: false, timedOut };
  }
  const nextCheckpoint = progress.nextCheckpoint + 1;
  return {
    progress: {
      nextCheckpoint,
      startedAt: progress.startedAt ?? elapsedSeconds,
    },
    completed: nextCheckpoint === route.checkpoints.length,
    timedOut,
  };
};

export const worldStationPulse = (station: WorldStation, elapsedSeconds: number) => {
  const phase =
    (((elapsedSeconds + station.phase) % WORLD_STATION_PERIOD) + WORLD_STATION_PERIOD) %
    WORLD_STATION_PERIOD;
  return phase < WORLD_STATION_WINDOW;
};

// Use real frame time for holding a pulse, even if movement steps are capped.
export const worldChargeDelta = (frameSeconds: number) => Math.max(0, Math.min(frameSeconds, 0.25));

export const worldSentryPosition = (sentry: WorldSentry, elapsedSeconds: number): WorldPoint => {
  const phase = (((elapsedSeconds / sentry.period + sentry.phase) % 1) + 1) % 1;
  const fraction = 1 - Math.abs(2 * phase - 1);
  return {
    x: sentry.start.x + (sentry.end.x - sentry.start.x) * fraction,
    z: sentry.start.z + (sentry.end.z - sentry.start.z) * fraction,
  };
};

export const validWorldIds = (value: unknown, objectives: readonly { id: string }[]): string[] => {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(objectives.map((item) => item.id));
  return [
    ...new Set(value.filter((id): id is string => typeof id === 'string' && allowed.has(id))),
  ];
};

export const worldDistance = (a: WorldPoint, b: WorldPoint) => Math.hypot(a.x - b.x, a.z - b.z);

const isInsideMainIsland = (point: WorldPoint) =>
  Math.hypot(point.x, point.z) < worldCoastRadius(Math.atan2(point.z, point.x)) - WORLD_EDGE_INSET;

const isInsideSecondIsland = (point: WorldPoint) => {
  const dx = point.x - WORLD_SECOND_ISLAND_CENTER.x;
  const dz = point.z - WORLD_SECOND_ISLAND_CENTER.z;
  return Math.hypot(dx, dz) < worldSecondCoastRadius(Math.atan2(dz, dx)) - WORLD_EDGE_INSET;
};

// The missing planks stay part of the bridge's outline. Scene movement decides
// whether KEPPER is high enough to jump over them or falls through.
export const worldBridgeGapAt = (point: WorldPoint) => {
  if (!worldBridgeContains(point) || isInsideMainIsland(point) || isInsideSecondIsland(point)) {
    return false;
  }
  const { t } = bridgeCoordinates(point);
  return worldBridgeGaps.some((gap) => t >= gap.startT && t <= gap.endT);
};

export const worldIsOutside = (point: WorldPoint) =>
  !isInsideMainIsland(point) && !isInsideSecondIsland(point) && !worldBridgeContains(point);

export const clampToWorld = (point: WorldPoint): WorldPoint => {
  if (!worldIsOutside(point)) return point;
  const clampToCoast = (center: WorldPoint, coastRadius: (angle: number) => number): WorldPoint => {
    const dx = point.x - center.x;
    const dz = point.z - center.z;
    const distance = Math.hypot(dx, dz);
    const radius = coastRadius(Math.atan2(dz, dx)) - 0.9;
    if (distance <= radius) return point;
    const scale = radius / distance;
    return { x: center.x + dx * scale, z: center.z + dz * scale };
  };
  const { t, offset, normal } = bridgeCoordinates(point);
  const bridgeCenter = worldBridgePointAt(Math.max(0, Math.min(1, t)));
  const bridgeOffset = Math.max(
    -worldBridge.width / 2 + WORLD_BRIDGE_EDGE_INSET + 0.1,
    Math.min(worldBridge.width / 2 - WORLD_BRIDGE_EDGE_INSET - 0.1, offset),
  );
  const bridgePoint = {
    x: bridgeCenter.x + normal.x * bridgeOffset,
    z: bridgeCenter.z + normal.z * bridgeOffset,
  };
  return [
    clampToCoast({ x: 0, z: 0 }, worldCoastRadius),
    clampToCoast(WORLD_SECOND_ISLAND_CENTER, worldSecondCoastRadius),
    bridgePoint,
  ]
    .filter((candidate) => !worldIsOutside(candidate))
    .reduce((closest, candidate) =>
      worldDistance(candidate, point) < worldDistance(closest, point) ? candidate : closest,
    );
};

export const worldObjectivesComplete = ({
  shards,
  terminals,
  stations,
  beacons,
  routes,
}: WorldProgressCounts) =>
  shards >= worldShards.length &&
  terminals >= worldTerminals.length &&
  stations >= worldStations.length &&
  beacons >= worldBeacons.length &&
  routes >= worldRoutes.length;

export const worldScore = (
  shards: number,
  terminals: number,
  stations: number,
  elapsedSeconds: number,
  mistakes: number,
  hits: number,
  beacons = 0,
  routes = 0,
) => {
  const exploration = Math.min(worldShards.length, Math.max(0, shards)) * 10;
  const puzzles = Math.min(worldTerminals.length, Math.max(0, terminals)) * 55;
  const pulses = Math.min(worldStations.length, Math.max(0, stations)) * 45;
  const airborne = Math.min(worldBeacons.length, Math.max(0, beacons)) * 30;
  const trials = Math.min(worldRoutes.length, Math.max(0, routes)) * 50;
  const complete = worldObjectivesComplete({ shards, terminals, stations, beacons, routes });
  const finishBonus = complete
    ? Math.max(
        0,
        50 -
          Math.ceil(Math.max(0, elapsedSeconds - 420) / 15) -
          Math.max(0, mistakes) * 8 -
          Math.max(0, hits) * 10,
      )
    : 0;
  return Math.min(
    1000,
    Math.round(exploration + puzzles + pulses + airborne + trials + finishBonus),
  );
};
