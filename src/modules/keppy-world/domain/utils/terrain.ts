import decorations from './world-decoration.json' with { type: 'json' };

export type WorldPoint = { x: number; z: number };
export type WorldDecorSolid = WorldPoint & {
  id: string;
  radius?: number;
  halfWidth?: number;
  halfDepth?: number;
};
export type WorldBridge = { start: WorldPoint; end: WorldPoint; width: number; gateT: number };

// The realtime server owns movement. Keep geometry and clearance in sync with
// realtime-server/src/movement.ts; rendering and local prediction use this map.
export const WORLD_ZONES = [
  'plaza',
  'harbor',
  'bridge',
  'island',
  'garden',
  'academy',
  'summit',
  'workshop-island',
  'crystal-island',
  'citadel',
] as const;
export const WORLD_MAIN_RADIUS = 25.5;
export const WORLD_ISLAND_CENTER: WorldPoint = { x: 44, z: -11 };
export const WORLD_ISLAND_RADIUS = 14.5;
export const WORLD_ACADEMY_CENTER: WorldPoint = { x: -54, z: -94 };
export const WORLD_PLAYER_RADIUS = 0.38;
export const WORLD_AVATAR_COLLISION_RADIUS = 0.95;
export const WORLD_QUEST_COLLISION_RADIUS = 0.6;
export const WORLD_MOVE_SPEED = 4.3;
export const WORLD_JUMP_SECONDS = 0.82;
export const WORLD_JUMP_HEIGHT = 1.25;
export const WORLD_INTERACT_DISTANCE = 4.5;
export const WORLD_BRIDGE: WorldBridge = {
  start: { x: 20.5, z: -6 },
  end: { x: 34, z: -8 },
  width: 3.5,
  gateT: 0.72,
};
export const WORLD_ACADEMY_BRIDGE: WorldBridge = {
  start: { x: -35, z: -37 },
  end: { x: -50, z: -78 },
  width: 4.8,
  gateT: 0.06,
};
export const WORLD_EXTRA_ISLANDS = [
  {
    id: 'workshop-island',
    center: { x: 20, z: 100 },
    startStage: 7,
    radii: [32, 38, 42],
    phase: 0.3,
  },
  { id: 'crystal-island', center: { x: 125, z: 20 }, startStage: 8, radii: [29, 35], phase: 1.2 },
  { id: 'citadel', center: { x: -129, z: -56 }, startStage: 9, radii: [36], phase: 2.1 },
] as const;
export const WORLD_EXTRA_BRIDGES: ReadonlyArray<{ zone: string; bridge: WorldBridge }> = [
  {
    zone: 'workshop-island',
    bridge: { start: { x: -18, z: 48 }, end: { x: 7, z: 77 }, width: 5.6, gateT: 0.06 },
  },
  {
    zone: 'crystal-island',
    bridge: { start: { x: 75, z: -2 }, end: { x: 103, z: 11 }, width: 5.2, gateT: 0.06 },
  },
  {
    zone: 'citadel',
    bridge: { start: { x: -67, z: -107 }, end: { x: -111, z: -76 }, width: 5.6, gateT: 0.06 },
  },
];
export const WORLD_LANDMARKS = [
  {
    id: 'workshop-cargo-a',
    x: 37,
    z: 102,
    halfWidth: 0.85,
    halfDepth: 0.85,
    zone: 'workshop-island',
    kind: 'cargo',
  },
  {
    id: 'workshop-cargo-b',
    x: 40,
    z: 102,
    halfWidth: 0.85,
    halfDepth: 0.85,
    zone: 'workshop-island',
    kind: 'cargo',
  },
  {
    id: 'workshop-cargo-c',
    x: 43,
    z: 102,
    halfWidth: 0.85,
    halfDepth: 0.85,
    zone: 'workshop-island',
    kind: 'cargo',
  },
  { id: 'workshop-crane', x: 40, z: 95, radius: 0.48, zone: 'workshop-island', kind: 'crane' },
  {
    id: 'workshop-water-tower',
    x: 7,
    z: 120,
    radius: 1.3,
    zone: 'workshop-island',
    kind: 'water-tower',
  },
  { id: 'crystal-cluster-west', x: 109, z: 23, radius: 1, zone: 'crystal-island', kind: 'crystal' },
  {
    id: 'crystal-cluster-south',
    x: 118,
    z: 41,
    radius: 1,
    zone: 'crystal-island',
    kind: 'crystal',
  },
  { id: 'crystal-cluster-east', x: 143, z: 17, radius: 1, zone: 'crystal-island', kind: 'crystal' },
  {
    id: 'crystal-cluster-north',
    x: 126,
    z: -2,
    radius: 1,
    zone: 'crystal-island',
    kind: 'crystal',
  },
  { id: 'citadel-fountain', x: -126, z: -43, radius: 1.8, zone: 'citadel', kind: 'fountain' },
  { id: 'citadel-flag-east', x: -120, z: -59, radius: 0.16, zone: 'citadel', kind: 'flag' },
  { id: 'citadel-flag-west', x: -140, z: -47, radius: 0.16, zone: 'citadel', kind: 'flag' },
  { id: 'citadel-flag-south', x: -151, z: -68, radius: 0.16, zone: 'citadel', kind: 'flag' },
] as const;
export const WORLD_ROCKS = [
  { x: -8, z: -8, radius: 1.2 },
  { x: 8, z: 7, radius: 1.3 },
  { x: -6, z: 10, radius: 1.1 },
] as const;

export const WORLD_BUILDINGS = [
  { id: 'workshop', x: -10, z: -11, halfWidth: 1.8, halfDepth: 1.5, zone: 'plaza' },
  { id: 'laboratory', x: 8, z: -12, halfWidth: 1.8, halfDepth: 1.5, zone: 'plaza' },
  { id: 'archive', x: -12, z: 5, halfWidth: 1.8, halfDepth: 1.5, zone: 'plaza' },
  { id: 'monument', x: 0, z: -6, halfWidth: 1.6, halfDepth: 1.6, zone: 'plaza' },
  { id: 'market', x: -23, z: 8, halfWidth: 2.6, halfDepth: 2, zone: 'harbor' },
  { id: 'harbor-warehouse', x: 12, z: -16, halfWidth: 1.8, halfDepth: 1.5, zone: 'harbor' },
  { id: 'inn', x: -23, z: -13, halfWidth: 2.6, halfDepth: 2, zone: 'bridge' },
  { id: 'observatory', x: 44, z: -17, halfWidth: 1.8, halfDepth: 1.5, zone: 'island' },
  { id: 'greenhouse', x: -22, z: -32, halfWidth: 3.8, halfDepth: 2.6, zone: 'garden' },
  { id: 'windmill', x: -38, z: -18, halfWidth: 2.7, halfDepth: 2.7, zone: 'garden' },
  { id: 'makers-hall', x: -40, z: 5, halfWidth: 3.5, halfDepth: 2.8, zone: 'garden' },
  { id: 'farmhouse', x: -26, z: 30, halfWidth: 3.2, halfDepth: 2.6, zone: 'garden' },
  { id: 'academy-hall', x: -56, z: -99, halfWidth: 4, halfDepth: 3, zone: 'academy' },
  { id: 'academy-residence', x: -65, z: -87, halfWidth: 3, halfDepth: 2.5, zone: 'academy' },
  { id: 'academy-observatory', x: -45, z: -91, halfWidth: 2.5, halfDepth: 2.5, zone: 'academy' },
  { id: 'summit-beacon', x: -62, z: -110, halfWidth: 2.5, halfDepth: 2.5, zone: 'summit' },
  { id: 'conservatory', x: -39, z: -101, halfWidth: 3, halfDepth: 2.5, zone: 'summit' },
  { id: 'workshop-foundry', x: 9, z: 98, halfWidth: 4.2, halfDepth: 3.2, zone: 'workshop-island' },
  {
    id: 'workshop-enginehall',
    x: 26,
    z: 110,
    halfWidth: 4.8,
    halfDepth: 3.6,
    zone: 'workshop-island',
  },
  {
    id: 'workshop-dockhouse',
    x: 34,
    z: 90,
    halfWidth: 3.5,
    halfDepth: 2.8,
    zone: 'workshop-island',
  },
  {
    id: 'workshop-watermill',
    x: 4,
    z: 111,
    halfWidth: 2.7,
    halfDepth: 2.7,
    zone: 'workshop-island',
  },
  { id: 'workshop-hangar', x: 25, z: 88, halfWidth: 5, halfDepth: 3.5, zone: 'workshop-island' },
  { id: 'crystal-temple', x: 128, z: 12, halfWidth: 4, halfDepth: 3.5, zone: 'crystal-island' },
  { id: 'crystal-observatory', x: 138, z: 29, halfWidth: 3, halfDepth: 3, zone: 'crystal-island' },
  { id: 'crystal-quarry', x: 115, z: 31, halfWidth: 3.6, halfDepth: 3, zone: 'crystal-island' },
  {
    id: 'crystal-conservatory',
    x: 112,
    z: 14,
    halfWidth: 3.3,
    halfDepth: 2.7,
    zone: 'crystal-island',
  },
  { id: 'crystal-spire', x: 130, z: 36, halfWidth: 2.5, halfDepth: 2.5, zone: 'crystal-island' },
  { id: 'citadel-castle', x: -131, z: -59, halfWidth: 6, halfDepth: 4.5, zone: 'citadel' },
  { id: 'citadel-gatehouse', x: -112, z: -66, halfWidth: 3.2, halfDepth: 2.6, zone: 'citadel' },
  { id: 'citadel-west-tower', x: -150, z: -58, halfWidth: 3, halfDepth: 3, zone: 'citadel' },
  { id: 'citadel-archive', x: -133, z: -40, halfWidth: 4, halfDepth: 3, zone: 'citadel' },
  { id: 'citadel-lighthouse', x: -120, z: -39, halfWidth: 3, halfDepth: 3, zone: 'citadel' },
] as const;

export const worldStage = (zones: readonly string[]) =>
  WORLD_ZONES.reduce((stage, zone, index) => (zones.includes(zone) ? index : stage), 0);
export const worldTreePositions = (zones: readonly string[]) =>
  decorations.stages[Math.min(worldStage(zones), decorations.stages.length - 1)].trees;
export const worldDecorSolids = (zones: readonly string[]): readonly WorldDecorSolid[] =>
  decorations.stages[Math.min(worldStage(zones), decorations.stages.length - 1)].solids;
export const worldAcademyRadius = (zones: readonly string[]) => (worldStage(zones) >= 6 ? 30 : 21);
const islandShape = (angle: number) =>
  0.92 + 0.05 * Math.sin(4 * angle + 0.7) + 0.02 * Math.cos(7 * angle - 0.4);

export const coastRadius = (angle: number, second = false, zones: readonly string[] = []) =>
  second
    ? WORLD_ISLAND_RADIUS * islandShape(angle) +
      [0, 0, 0, 0, 11, 19, 27][Math.min(6, worldStage(zones))] * 0.5 * (1 + Math.cos(angle))
    : WORLD_MAIN_RADIUS *
        (0.923 +
          0.045 * Math.sin(3 * angle + 0.4) +
          0.022 * Math.cos(5 * angle - 0.5) +
          0.01 * Math.sin(9 * angle + 1.1)) +
      [0, 6, 12, 20, 30, 42, 54][Math.min(6, worldStage(zones))] * 0.5 * (1 - Math.cos(angle));

export const extraIslandCoastRadius = (
  angle: number,
  island: (typeof WORLD_EXTRA_ISLANDS)[number],
  zones: readonly string[],
) => {
  const radius =
    island.radii[
      Math.max(0, Math.min(island.radii.length - 1, worldStage(zones) - island.startStage))
    ];
  return (
    radius *
    (0.93 + 0.045 * Math.sin(3 * angle + island.phase) + 0.025 * Math.cos(5 * angle - island.phase))
  );
};

const polygon = (center: WorldPoint, radius: (angle: number) => number): WorldPoint[] =>
  Array.from({ length: 96 }, (_, index) => {
    const angle = (index / 96) * Math.PI * 2;
    return {
      x: center.x + Math.cos(angle) * radius(angle),
      z: center.z + Math.sin(angle) * radius(angle),
    };
  });
export const coastline = (second = false, scale = 1, zones: readonly string[] = []): WorldPoint[] =>
  polygon(
    second ? WORLD_ISLAND_CENTER : { x: 0, z: 0 },
    (angle) => coastRadius(angle, second, zones) * scale,
  );
export const academyCoastline = (zones: readonly string[], scale = 1) =>
  polygon(WORLD_ACADEMY_CENTER, (angle) => worldAcademyRadius(zones) * islandShape(angle) * scale);
export const worldLandPolygons = (
  zones: readonly string[],
): Array<{ id: string; points: WorldPoint[]; center: WorldPoint }> => [
  { id: 'plaza', points: coastline(false, 1, zones), center: { x: 0, z: 0 } },
  ...(zones.includes('island')
    ? [{ id: 'island', points: coastline(true, 1, zones), center: WORLD_ISLAND_CENTER }]
    : []),
  ...(zones.includes('academy')
    ? [{ id: 'academy', points: academyCoastline(zones), center: WORLD_ACADEMY_CENTER }]
    : []),
  ...WORLD_EXTRA_ISLANDS.filter((island) => zones.includes(island.id)).map((island) => ({
    id: island.id,
    center: island.center,
    points: polygon(island.center, (angle) => extraIslandCoastRadius(angle, island, zones)),
  })),
];
export const bridgePointAt = (t: number, bridge: WorldBridge = WORLD_BRIDGE): WorldPoint => ({
  x: bridge.start.x + (bridge.end.x - bridge.start.x) * t,
  z: bridge.start.z + (bridge.end.z - bridge.start.z) * t,
});
export const bridgeCoordinates = (point: WorldPoint, bridge: WorldBridge = WORLD_BRIDGE) => {
  const dx = bridge.end.x - bridge.start.x,
    dz = bridge.end.z - bridge.start.z;
  const length = Math.hypot(dx, dz);
  const px = point.x - bridge.start.x,
    pz = point.z - bridge.start.z;
  return {
    t: (px * dx + pz * dz) / (length * length),
    offset: (px * -dz + pz * dx) / length,
    length,
  };
};
const bridges: ReadonlyArray<readonly [WorldBridge, string]> = [
  [WORLD_BRIDGE, 'bridge'],
  [WORLD_ACADEMY_BRIDGE, 'academy'],
  ...WORLD_EXTRA_BRIDGES.map(({ zone, bridge }) => [bridge, zone] as const),
];
export const worldBridges = (
  zones: readonly string[],
): Array<{ zone: string; bridge: WorldBridge }> =>
  bridges.filter(([, zone]) => zones.includes(zone)).map(([bridge, zone]) => ({ zone, bridge }));
export const hasWorldGround = (point: WorldPoint, zones: readonly string[]) => {
  if (
    Math.hypot(point.x, point.z) <=
    coastRadius(Math.atan2(point.z, point.x), false, zones) - 0.55
  )
    return true;
  if (zones.includes('island')) {
    const x = point.x - WORLD_ISLAND_CENTER.x,
      z = point.z - WORLD_ISLAND_CENTER.z;
    if (Math.hypot(x, z) <= coastRadius(Math.atan2(z, x), true, zones) - 0.55) return true;
  }
  if (zones.includes('academy')) {
    const x = point.x - WORLD_ACADEMY_CENTER.x,
      z = point.z - WORLD_ACADEMY_CENTER.z;
    if (Math.hypot(x, z) <= worldAcademyRadius(zones) * islandShape(Math.atan2(z, x)) - 0.55)
      return true;
  }
  for (const island of WORLD_EXTRA_ISLANDS) {
    if (!zones.includes(island.id)) continue;
    const x = point.x - island.center.x,
      z = point.z - island.center.z;
    if (Math.hypot(x, z) <= extraIslandCoastRadius(Math.atan2(z, x), island, zones) - 0.55)
      return true;
  }
  return bridges.some(([bridge, zone]) => {
    if (!zones.includes(zone)) return false;
    const { t, offset } = bridgeCoordinates(point, bridge);
    return t >= 0 && t <= 1 && Math.abs(offset) <= bridge.width / 2 - 0.25;
  });
};
export const hitsWorldObstacle = (point: WorldPoint, zones: readonly string[]) => {
  if (
    WORLD_BUILDINGS.some(
      (building) =>
        (building.zone === 'plaza' || zones.includes(building.zone)) &&
        Math.abs(point.x - building.x) < building.halfWidth + WORLD_PLAYER_RADIUS &&
        Math.abs(point.z - building.z) < building.halfDepth + WORLD_PLAYER_RADIUS,
    )
  )
    return true;
  if (
    WORLD_ROCKS.some(
      (rock) => Math.hypot(point.x - rock.x, point.z - rock.z) < rock.radius + WORLD_PLAYER_RADIUS,
    )
  )
    return true;
  if (
    worldDecorSolids(zones).some((solid) =>
      solid.radius !== undefined
        ? Math.hypot(point.x - solid.x, point.z - solid.z) < solid.radius + WORLD_PLAYER_RADIUS
        : Math.abs(point.x - solid.x) < (solid.halfWidth ?? 0) + WORLD_PLAYER_RADIUS &&
          Math.abs(point.z - solid.z) < (solid.halfDepth ?? 0) + WORLD_PLAYER_RADIUS,
    )
  )
    return true;
  if (
    bridges.some(([bridge, zone]) => {
      if (!zones.includes(zone)) return false;
      const { t, offset } = bridgeCoordinates(point, bridge);
      return (
        t >= 0 &&
        t <= 1 &&
        Math.abs(Math.abs(offset) - bridge.width * 0.47) < 0.045 + WORLD_PLAYER_RADIUS
      );
    })
  )
    return true;
  if (!zones.includes('island')) {
    const { t, offset, length } = bridgeCoordinates(point);
    const gateT = zones.includes('bridge') ? WORLD_BRIDGE.gateT : 0.08;
    if (
      Math.abs(t - gateT) * length < WORLD_PLAYER_RADIUS + 0.35 &&
      Math.abs(offset) < WORLD_BRIDGE.width / 2 + WORLD_PLAYER_RADIUS
    )
      return true;
  }
  return false;
};
export const hitsWorldQuest = (point: WorldPoint, kiosks: readonly WorldPoint[]) =>
  kiosks.some(
    (kiosk) =>
      Math.hypot(point.x - kiosk.x, point.z - kiosk.z) <
      WORLD_QUEST_COLLISION_RADIUS + WORLD_PLAYER_RADIUS,
  );

export const predictWorldStep = (
  start: WorldPoint,
  velocity: WorldPoint,
  seconds: number,
  zones: readonly string[],
  peers: readonly WorldPoint[] = [],
  kiosks: readonly WorldPoint[] = [],
): WorldPoint => {
  const hitsPlayer = (point: WorldPoint, players = peers) =>
    players.some(
      (peer) =>
        Math.hypot(point.x - peer.x, point.z - peer.z) <
        WORLD_AVATAR_COLLISION_RADIUS * 2 - 0.00001,
    );
  const blocked = (point: WorldPoint) =>
    hitsWorldObstacle(point, zones) || hitsWorldQuest(point, kiosks) || hitsPlayer(point);
  let next = {
    x: start.x + velocity.x * WORLD_MOVE_SPEED * seconds,
    z: start.z + velocity.z * WORLD_MOVE_SPEED * seconds,
  };
  if (hitsPlayer(next)) {
    for (const peer of peers) {
      if (!hitsPlayer(next, [peer])) continue;
      const dx = start.x - peer.x,
        dz = start.z - peer.z,
        length = Math.hypot(dx, dz);
      if (length < 0.00001) return start;
      const nx = dx / length,
        nz = dz / length;
      const vx = next.x - start.x,
        vz = next.z - start.z;
      const inward = Math.min(0, vx * nx + vz * nz);
      next = { x: start.x + vx - inward * nx, z: start.z + vz - inward * nz };
    }
    if (hitsPlayer(next)) return start;
  }
  if (!hasWorldGround(next, zones)) return start;
  if (!blocked(next)) return next;
  const result = { ...start };
  const slideX = { x: next.x, z: start.z };
  if (hasWorldGround(slideX, zones) && !blocked(slideX)) result.x = slideX.x;
  const slideZ = { x: result.x, z: next.z };
  if (hasWorldGround(slideZ, zones) && !blocked(slideZ)) result.z = slideZ.z;
  return result;
};
