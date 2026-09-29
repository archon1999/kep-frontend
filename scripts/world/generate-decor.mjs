/**
 * Canonical deterministic tree placement and solid scenery footprint generator.
 * Run with Node 22.6+ from any directory. --check never writes either repository.
 * Geometry and prop placements must match WorldStructures.tsx and terrain.ts.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  WORLD_ACADEMY_BRIDGE,
  WORLD_BRIDGE,
  WORLD_BUILDINGS,
  WORLD_EXTRA_BRIDGES,
  WORLD_EXTRA_ISLANDS,
  WORLD_LANDMARKS,
  WORLD_ROCKS,
  WORLD_ZONES,
  bridgeCoordinates,
  coastRadius,
  extraIslandCoastRadius,
  hasWorldGround,
} from '../../src/modules/keppy-world/domain/utils/terrain.ts';

const sourceFile = new URL(
  '../../src/modules/keppy-world/domain/utils/world-decoration.json',
  import.meta.url,
);
const backendFile = new URL(
  '../../../kep-backend/realtime-server/src/world-decoration.json',
  import.meta.url,
);
const flags = new Set(process.argv.slice(2));
const permitted = new Set(['--check', '--write', '--sync-backend']);
if (
  [...flags].some((flag) => !permitted.has(flag)) ||
  flags.has('--check') === flags.has('--write') ||
  (flags.has('--sync-backend') && !flags.has('--write'))
) {
  console.error('Usage: node --experimental-strip-types scripts/world/generate-decor.mjs --check');
  console.error(
    '   or: node --experimental-strip-types scripts/world/generate-decor.mjs --write [--sync-backend]',
  );
  process.exit(2);
}
let seed = 971;
const random = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
};
const candidates = Array.from({ length: 420 }, () => ({
  x: -90 + random() * 175,
  z: -127 + random() * 190,
  scale: 0.75 + random() * 0.9,
}));
// Preserve the old candidate stream; new samples only target the added islands.
const extraCandidates = WORLD_EXTRA_ISLANDS.flatMap((island) =>
  Array.from({ length: 140 }, () => ({
    x: island.center.x - 46 + random() * 92,
    z: island.center.z - 46 + random() * 92,
    scale: 0.85 + random() * 0.95,
    zone: island.id,
  })),
);
const fixed = [
  [-20, -3, 1.1],
  [-18, 7, 1.3],
  [-18, -9, 1.1],
  [-13, -17, 1],
  [-5, -20, 1.2],
  [5, -20, 0.9],
  [14, -17, 1.2],
  [20, 4, 1.1],
  [18, 10, 1.3],
  [12, 18, 0.9],
  [3, 20, 1.2],
  [-10, 18, 1.1],
  [-17, 13, 0.8],
  [-4, -11, 1.1],
  [10, -9, 0.9],
  [12, 4, 1.1],
  [3, 12, 0.9],
].map(([x, z, scale]) => ({ x, z, scale }));
const anchors = [
  ...Array.from({ length: 16 }, (_, i) => ({
    x: 16 * Math.cos((i * Math.PI) / 8),
    z: 16 * Math.sin((i * Math.PI) / 8),
  })),
  ...[
    [16, -5],
    [17, -8],
    [14, -12],
    [18, -4],
    [44, -11],
    [48, -7],
    [40, -15],
    [49, -14],
    [-37, -5],
    [-28, 24],
    [-38, -28],
    [-54, -91],
    [-66, -97],
    [-47, -104],
    [-48, -113],
    [-71, -106],
    [20, 100],
    [9, 87],
    [36, 107],
    [16, 120],
    [125, 22],
    [136, 15],
    [119, 4],
    [113, 24],
    [-124, -51],
    [-140, -69],
    [-114, -52],
    [-142, -42],
  ].map(([x, z]) => ({ x, z })),
];
const stages = WORLD_ZONES.map((_, stage) => {
  const zones = WORLD_ZONES.slice(0, stage + 1),
    solids = [];
  const circle = (id, x, z, radius) => solids.push({ id, x, z, radius });
  const box = (id, x, z, halfWidth, halfDepth) => solids.push({ id, x, z, halfWidth, halfDepth });
  const trees = [
    ...fixed.filter(
      (p) =>
        !WORLD_BUILDINGS.some(
          (s) => Math.abs(p.x - s.x) < s.halfWidth + 0.7 && Math.abs(p.z - s.z) < s.halfDepth + 0.7,
        ),
    ),
    ...[...candidates, ...extraCandidates].filter(({ x, z, zone }) => {
      if (zone && !zones.includes(zone)) return false;
      const point = { x, z };
      if (!hasWorldGround(point, zones)) return false;
      if (WORLD_ROCKS.some((r) => Math.hypot(x - r.x, z - r.z) < r.radius + 1.5)) return false;
      if (
        [
          WORLD_BRIDGE,
          WORLD_ACADEMY_BRIDGE,
          ...(zone ? WORLD_EXTRA_BRIDGES.map((entry) => entry.bridge) : []),
        ].some((b) => {
          const c = bridgeCoordinates(point, b);
          return c.t >= -0.1 && c.t <= 1.1 && Math.abs(c.offset) < b.width / 2 + 2;
        })
      )
        return false;
      if (Math.hypot(x, z) < 20 || Math.abs(z) < 3.5 || Math.abs(x) < 3.5) return false;
      if (
        WORLD_BUILDINGS.some(
          (s) => Math.abs(x - s.x) < s.halfWidth + 2.7 && Math.abs(z - s.z) < s.halfDepth + 2.7,
        )
      )
        return false;
      if (
        WORLD_LANDMARKS.some(
          (p) =>
            Math.hypot(x - p.x, z - p.z) <
            ('radius' in p ? p.radius : Math.hypot(p.halfWidth, p.halfDepth)) + 2,
        )
      )
        return false;
      if (anchors.some((p) => Math.hypot(x - p.x, z - p.z) < 2.4)) return false;
      const mainSafe = Math.hypot(x, z) <= coastRadius(Math.atan2(z, x), false, zones) - 2.2;
      const islandSafe =
        zones.includes('island') &&
        Math.hypot(x - 44, z + 11) <= coastRadius(Math.atan2(z + 11, x - 44), true, zones) - 2.2;
      const a = Math.atan2(z + 94, x + 54),
        academySafe =
          zones.includes('academy') &&
          Math.hypot(x + 54, z + 94) <=
            (stage >= 6 ? 30 : 21) *
              (0.92 + 0.05 * Math.sin(4 * a + 0.7) + 0.02 * Math.cos(7 * a - 0.4)) -
              2.2;
      const extraSafe = WORLD_EXTRA_ISLANDS.some(
        (island) =>
          zones.includes(island.id) &&
          Math.hypot(x - island.center.x, z - island.center.z) <=
            extraIslandCoastRadius(
              Math.atan2(z - island.center.z, x - island.center.x),
              island,
              zones,
            ) -
              2.2,
      );
      if (zone && !extraSafe) return false;
      if (!mainSafe && !islandSafe && !academySafe && !extraSafe) return false;
      if (x < -30 && x > -54 && z < -25 && z > -80) return false;
      if (Math.hypot(x - 44, z + 11) < 9 || Math.hypot(x + 54, z + 91) < 7) return false;
      return true;
    }),
  ];
  trees.forEach(({ x, z, scale }) =>
    circle(`tree-${x.toFixed(4)}-${z.toFixed(4)}`, x, z, 0.2 * scale),
  );
  if (stage >= 1) {
    for (const x of [16.5, 19.5])
      for (const z of [-12, -9]) circle(`dock-post-${x}-${z}`, x, z, 0.14);
    for (const x of [17, 18.15]) box(`cargo-${x}`, x, -11.5, 0.5, 0.47);
    if (stage >= 2) circle('harbor-crane', 19.4, -11.7, 0.2);
  }
  if (stage >= 4) {
    for (let row = 0; row < 5; row++) box(`crop-bed-${row}`, -34 + row * 1.2, 20, 0.43, 3.7);
    for (let i = 0; i < 5; i++) box(`island-planter-${i}`, 58 + i * 1.2, -15, 0.45, 0.45);
  }
  if (stage >= 5) for (const x of [-45, -51, -57]) box(`hedge-${x}`, x, 5, 1.95, 0.75);
  if (stage >= 6) for (const x of [65, 70, 75]) circle(`island-crystal-${x}`, x, -6, 1.62);
  const lamps = [];
  if (stage >= 2) {
    lamps.push(
      ...[
        [-5, 3],
        [5, 3],
        [-17, 2],
        [15, -3],
      ],
    );
    if (stage >= 4)
      lamps.push(
        ...[
          [-28, 2],
          [-38, -8],
          [-27, 22],
          [55, -8],
        ],
      );
    if (stage >= 5)
      lamps.push(
        ...[
          [-50, -83],
          [-57, -89],
          [-47, -99],
        ],
      );
    lamps.forEach(([x, z]) => {
      circle(`lamp-${x}-${z}`, x, z, 0.15);
      box(`bench-${x}-${z}`, x + 1.1, z, 0.85, 0.34);
    });
  }
  for (const { zone, kind, ...solid } of WORLD_LANDMARKS) {
    if (zones.includes(zone)) solids.push(solid);
  }
  return { stage, zones, trees: trees.map(({ x, z, scale }) => ({ x, z, scale })), solids };
});
for (const [index, stage] of stages.entries()) {
  const ids = new Set(stage.solids.map((solid) => solid.id));
  assert.equal(ids.size, stage.solids.length, 'Every solid must have a stable unique id.');
  for (const solid of stage.solids) {
    assert.ok(Number.isFinite(solid.x) && Number.isFinite(solid.z), solid.id);
    assert.ok(solid.radius > 0 || (solid.halfWidth > 0 && solid.halfDepth > 0), solid.id);
  }
  if (index > 0)
    for (const previous of stages[index - 1].solids) {
      assert.ok(
        ids.has(previous.id),
        'World growth must not remove existing solids: ' + previous.id,
      );
    }
}
// Extending later levels must not alter any existing level's saved placement.
const existing = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
assert.ok(
  JSON.stringify(stages.slice(0, 7)) === JSON.stringify(existing.stages.slice(0, 7)),
  'The original seven decoration stages must remain unchanged.',
);
const content = JSON.stringify({ schema: 1, stages }, null, 2) + '\n';
if (flags.has('--check')) {
  for (const file of [sourceFile, backendFile]) {
    assert.equal(
      fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'),
      content,
      'Regenerate/synchronize decoration manifest: ' + fileURLToPath(file),
    );
  }
  console.log('Canonical frontend manifest and backend mirror match the deterministic generator.');
} else {
  fs.writeFileSync(sourceFile, content);
  if (flags.has('--sync-backend')) fs.writeFileSync(backendFile, content);
  console.log('Wrote ' + fileURLToPath(sourceFile));
  if (flags.has('--sync-backend')) console.log('Mirrored ' + fileURLToPath(backendFile));
}
console.table(
  stages.map((stage) => ({
    level: stage.stage + 1,
    trees: stage.trees.length,
    solids: stage.solids.length,
  })),
);
