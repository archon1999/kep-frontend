import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  WORLD_ACADEMY_BRIDGE,
  WORLD_BRIDGE,
  WORLD_BUILDINGS,
  WORLD_EXTRA_BRIDGES,
  WORLD_LANDMARKS,
  WORLD_ROCKS,
  WORLD_ZONES,
  type WorldBridge,
  type WorldPoint,
  bridgePointAt,
  worldStage,
  worldTreePositions,
} from 'modules/keppy-world/domain/utils/terrain';
import * as THREE from 'three';

type Shape = 'box' | 'cylinder' | 'roof' | 'leaf' | 'stone' | 'crystal' | 'dome';
type Triple = [number, number, number];
type Part = { shape: Shape; at: Triple; size: Triple; color: string; rotation?: Triple };
type PartWriter = (
  shape: Shape,
  at: Triple,
  size: Triple,
  color: string,
  rotation?: Triple,
) => void;
const stone = '#d7dbc9',
  timber = '#a48762',
  frame = '#c0a47b',
  glass = '#9dcbd1';
const roofColors = ['#bd8469', '#6996a4', '#7e91af', '#cfab76', '#799d92'];

const writeBuilding = (add: PartWriter, site: (typeof WORLD_BUILDINGS)[number], stage: number) => {
  const { x, z, halfWidth: w, halfDepth: d, id, zone } = site;
  const openingStage = WORLD_ZONES.indexOf(zone);
  const age = stage - openingStage;
  const progress =
    zone === 'academy' || zone === 'crystal-island'
      ? Math.min(3, 1 + age * 2)
      : zone === 'summit' || zone === 'citadel'
        ? 3
        : Math.min(
            3,
            age + (id === 'workshop' || id === 'archive' || zone === 'workshop-island' ? 1 : 0),
          );
  const color =
    zone === 'workshop-island'
      ? '#b77f5f'
      : zone === 'crystal-island'
        ? '#868db5'
        : zone === 'citadel'
          ? '#747c9f'
          : roofColors[WORLD_BUILDINGS.indexOf(site) % roofColors.length];
  const part: PartWriter = (shape, at, size, tint, rotation) =>
    add(shape, [x + at[0], at[1], z + at[2]], size, tint, rotation);
  part('box', [0, 0.12, 0], [w * 2, 0.24, d * 2], '#b0bbb0');
  part('box', [0, 0.29, 0], [w * 1.83, 0.14, d * 1.82], '#e2dfca');
  const floors =
    id === 'academy-hall' || id === 'citadel-archive' || id === 'workshop-enginehall'
      ? 2
      : id === 'inn' && stage >= 5
        ? 2
        : 1;
  const height = 2.2 * floors;

  if (id === 'monument' || id === 'summit-beacon') {
    const tiers = id === 'monument' ? 1 + Math.floor(stage / 2) : 4;
    part('cylinder', [0, 0.5, 0], [w * 0.95, 0.55, w * 0.95], '#a6b8b0');
    for (let tier = 0; tier < tiers; tier += 1) {
      const y = 1.35 + tier * 1.6;
      part('box', [0, y, 0], [w * (1.15 - tier * 0.1), 1.5, d * (1.15 - tier * 0.1)], '#eee9d6');
      part('box', [0, y + 0.65, 0], [w * 1.35, 0.18, d * 1.35], tier % 2 ? '#639eae' : '#c8b488');
      if (stage >= 2) {
        part('box', [0, y, d * (0.58 - tier * 0.05) + 0.03], [0.4, 0.65, 0.06], glass);
        part('box', [-w * (0.58 - tier * 0.05) - 0.03, y, 0], [0.06, 0.65, 0.4], glass);
      }
    }
    const top = 1.6 + tiers * 1.6;
    part('roof', [0, top - 0.25, 0], [w * 1.4, 1.2, d * 1.4], '#5e91ad', [0, Math.PI / 4, 0]);
    part(
      'crystal',
      [0, top + 0.85, 0],
      [0.48 + stage * 0.035, 0.85, 0.48 + stage * 0.035],
      '#8adbc7',
    );
    if (stage >= 4) {
      for (const turn of [-1, 1])
        part('box', [turn * w * 0.7, top - 0.6, 0], [0.1, 2, 0.1], timber);
      part('box', [w * 0.93, top + 0.05, 0], [0.75, 0.45, 0.08], '#dfbd6f');
    }
    return;
  }

  if (progress <= 1) {
    // Visible slabs, half walls and timber framing reserve the final footprint.
    part('box', [0, 0.58, -d * 0.7], [w * 1.75, 0.48, 0.28], stone);
    part('box', [-w * 0.8, 0.58, 0], [0.28, 0.48, d * 1.4], stone);
    if (progress === 1) {
      for (const side of [-1, 1]) {
        for (const depth of [-1, 1])
          part('box', [side * w * 0.78, 1.5, depth * d * 0.72], [0.16, 2.35, 0.16], frame);
        part('box', [0, 2.55, side * d * 0.72], [w * 1.7, 0.15, 0.16], frame);
        part('box', [side * w * 0.78, 2.55, 0], [0.16, 0.15, d * 1.6], frame);
        part('box', [side * w * 0.78, 1.45, 0], [0.11, Math.hypot(2, d * 1.4), 0.11], timber, [
          side * 0.55,
          0,
          0,
        ]);
      }
      part('box', [0, 1.1, -d * 0.72], [w * 1.45, 1.05, 0.22], '#e8e2ce');
      part('roof', [-w * 0.3, 2.8, 0], [w * 0.65, 0.75, d * 0.9], color, [0, Math.PI / 4, 0]);
    }
    part('box', [w * 0.38, 0.58, d * 0.3], [w * 0.62, 0.45, d * 0.53], '#d3bc97');
    part('box', [w * 0.38, 0.87, d * 0.3], [w * 0.65, 0.12, d * 0.55], timber);
    // A compact working crane remains inside the future building's footprint.
    part('box', [-w * 0.67, 1.75, d * 0.65], [0.18, 3.1, 0.18], '#bd9861');
    part('box', [-w * 0.05, 3.2, d * 0.65], [w * 1.45, 0.18, 0.2], '#c9a36d');
    part('box', [w * 0.56, 2.48, d * 0.65], [0.035, 1.25, 0.035], '#6b827d');
    part('box', [w * 0.56, 1.84, d * 0.65], [0.22, 0.12, 0.22], '#aeb4a2');
    return;
  }

  if (zone === 'citadel' && id !== 'citadel-archive') {
    const tower = (tx: number, tz: number, radius: number, height: number) => {
      part('cylinder', [tx, height / 2 + 0.3, tz], [radius, height, radius], '#d0d4ce');
      part('cylinder', [tx, height + 0.28, tz], [radius * 1.12, 0.35, radius * 1.12], '#b1bcb6');
      for (let tooth = 0; tooth < 8; tooth += 1) {
        const angle = (tooth / 8) * Math.PI * 2;
        part(
          'box',
          [
            tx + Math.sin(angle) * radius * 0.88,
            height + 0.62,
            tz + Math.cos(angle) * radius * 0.88,
          ],
          [0.4, 0.65, 0.4],
          '#d7d9ca',
        );
      }
      part('box', [tx, height * 0.62, tz + radius + 0.01], [0.35, 0.9, 0.05], '#668295');
      part('box', [tx, height + 1.9, tz], [0.07, 2.5, 0.07], '#8e967e');
      part('box', [tx + 0.45, height + 2.7, tz], [0.9, 0.64, 0.045], '#ad8c68');
    };
    if (id === 'citadel-castle') {
      part('box', [0, 2.6, 0], [w * 1.64, 4.7, d * 1.6], '#dfe0d0');
      part('roof', [0, 5.65, -0.25], [w * 1.15, 2.8, d * 1.1], color, [0, Math.PI / 4, 0]);
      for (const xSide of [-1, 1])
        for (const zSide of [-1, 1])
          tower(xSide * w * 0.75, zSide * d * 0.72, 1.1, zSide < 0 ? 8.1 : 6.7);
      part('box', [0, 1.53, d * 0.82], [1.8, 2.45, 0.12], '#657c82');
      for (const offset of [-2.3, 2.3])
        part('box', [offset, 3.3, d * 0.815], [0.75, 1.1, 0.09], '#a7cad3');
      part('crystal', [0, 4.1, d * 0.83], [0.55, 0.65, 0.16], '#d4b778');
    } else if (id === 'citadel-gatehouse') {
      for (const side of [-1, 1]) tower(side * w * 0.64, 0, 0.86, 5.7);
      part('box', [0, 3.75, 0], [w * 1.55, 1.3, d * 1.3], '#d4d8cb');
      part('box', [0, 1.65, 0.2], [1.65, 2.7, 0.3], '#63817f');
    } else {
      tower(0, 0, w * 0.66, id === 'citadel-lighthouse' ? 9.2 : 7.4);
      if (id === 'citadel-lighthouse') {
        part('cylinder', [0, 10.4, 0], [w * 0.45, 1.3, d * 0.45], '#cde5d5');
        part('roof', [0, 11.5, 0], [w * 0.9, 1.05, d * 0.9], color, [0, Math.PI / 4, 0]);
      }
    }
    return;
  }

  if (id === 'crystal-temple' || id === 'crystal-spire' || id === 'crystal-quarry') {
    if (id === 'crystal-quarry') {
      for (const side of [-1, 1])
        part('stone', [side * w * 0.42, 1, 0], [w * 0.48, 1.2, d * 0.65], '#a5aeb0');
      for (const offset of [-0.6, 0, 0.6])
        part('crystal', [offset * w, 2.1, offset * d * 0.5], [0.7, 2.1 + offset, 0.7], '#91c9c6', [
          0.12,
          offset,
          0.18,
        ]);
    } else {
      for (let tier = 0; tier < 3; tier += 1)
        part(
          'box',
          [0, 0.6 + tier * 0.65, 0],
          [w * (1.8 - tier * 0.35), 0.65, d * (1.8 - tier * 0.35)],
          tier % 2 ? '#cbd7d1' : '#dfe3d5',
        );
      part(
        'crystal',
        [0, 4.5, 0],
        [w * 0.43, id === 'crystal-spire' ? 4.1 : 3.2, d * 0.43],
        '#91bbcb',
      );
      for (const side of [-1, 1])
        part('crystal', [side * w * 0.73, 1.5, 0], [0.48, 1.3, 0.48], '#b4d2c4');
    }
    return;
  }

  const greenhouse = id === 'greenhouse' || id.includes('conservatory');
  const rounded = id.includes('observatory') || id === 'windmill' || id === 'workshop-watermill';
  if (rounded) {
    part('cylinder', [0, height / 2 + 0.35, 0], [w * 0.73, height, d * 0.73], stone);
    if (id === 'windmill' || id === 'workshop-watermill') {
      part('cylinder', [0, 3.05, 0], [w * 0.55, 1.3, d * 0.55], '#eee8d3');
      part('roof', [0, 4.12, 0], [w * 0.87, 1.4, d * 0.87], color, [0, Math.PI / 4, 0]);
      const front = d * 0.72;
      for (let index = 0; index < 4; index += 1) {
        const turn = (index * Math.PI) / 2 + 0.25;
        part(
          'box',
          [Math.sin(turn) * 1.25, 3.3 + Math.cos(turn) * 1.25, front],
          [0.52, 2.45, 0.12],
          '#e2dcc0',
          [0, 0, -turn],
        );
      }
      part('cylinder', [0, 3.3, front + 0.12], [0.27, 0.22, 0.27], timber, [Math.PI / 2, 0, 0]);
    } else {
      part('dome', [0, height + 0.65, 0], [w * 0.94, w * 0.82, d * 0.94], color);
      part('cylinder', [0.45, height + 1.25, 0.7], [0.28, 1.75, 0.28], '#526f82', [
        Math.PI / 3,
        0,
        -0.3,
      ]);
    }
  } else {
    part(
      'box',
      [0, height / 2 + 0.35, 0],
      [w * 1.68, height, d * 1.62],
      greenhouse ? '#b9d6c5' : '#eee9d9',
    );
    part(
      'roof',
      [0, height + 0.92, 0],
      [w * 1.45, 1.65, d * 1.45],
      greenhouse ? '#92b8af' : color,
      [0, Math.PI / 4, 0],
    );
    if (greenhouse) {
      for (const offset of [-0.55, 0, 0.55])
        part('box', [offset * w, 1.56, d * 0.82], [w * 0.4, 1.62, 0.06], '#80b8b9');
      for (const side of [-1, 1])
        part('box', [side * w * 0.85, 1.56, 0], [0.06, 1.6, d * 1.3], '#80b8b9');
    }
  }
  part('box', [0, 1.05, d * 0.825], [0.83, 1.4, 0.1], '#56777d');
  if (progress >= 3) {
    for (let floor = 0; floor < floors; floor += 1) {
      for (const offset of [-0.57, 0.57]) {
        part('box', [offset * w, 1.6 + floor * 2.1, d * 0.835], [w * 0.34, 0.68, 0.08], '#b4dbe0');
        part('box', [offset * w, 1.24 + floor * 2.1, d * 0.865], [w * 0.44, 0.1, 0.21], '#aebbac');
      }
      part('box', [-w * 0.845, 1.6 + floor * 2.1, 0], [0.07, 0.7, d * 0.48], '#b4dbe0');
    }
    part('box', [0, 2.17, d * 0.87], [Math.min(1.6, w), 0.34, 0.12], '#d4b974');
    part('box', [0, 0.26, d * 0.94], [w * 0.72, 0.27, 0.34], '#dad7c5');
    if (id === 'market' || id === 'inn' || id === 'makers-hall') {
      for (let stripe = 0; stripe < 5; stripe += 1)
        part(
          'box',
          [(stripe - 2) * w * 0.29, 2.18, d * 0.81],
          [w * 0.29, 0.13, 0.7],
          stripe % 2 ? '#eee6c9' : color,
          [0.18, 0, 0],
        );
    }
    if (id === 'workshop' || id === 'harbor-warehouse' || id === 'farmhouse') {
      part('box', [w * 0.48, height + 1.43, -d * 0.23], [0.42, 1.25, 0.48], '#a49c84');
      part('box', [w * 0.48, height + 2.09, -d * 0.23], [0.58, 0.14, 0.61], '#7f8982');
    }
    if (id === 'academy-hall') {
      for (const side of [-1, 1])
        part('cylinder', [side * w * 0.7, 2.15, d * 0.89], [0.18, 3.5, 0.18], '#d2d6c4');
      part('crystal', [0, 4.1, d * 0.86], [0.42, 0.6, 0.12], '#e3c47d');
    }
    if (id === 'workshop-foundry' || id === 'workshop-enginehall') {
      for (const offset of [-0.48, 0.48]) {
        part('cylinder', [offset * w, height + 1.8, -d * 0.25], [0.4, 3.3, 0.4], '#a28e79');
        part('cylinder', [offset * w, height + 3.47, -d * 0.25], [0.55, 0.22, 0.55], '#74837f');
      }
      for (const x of [-0.5, 0, 0.5])
        part('cylinder', [x * w, 1.15, d * 0.83], [0.43, 0.14, 0.43], '#b99160', [
          Math.PI / 2,
          0,
          0,
        ]);
    }
  }
};

const addBridge = (
  add: PartWriter,
  bridge: WorldBridge,
  built: boolean,
  unlocked: boolean,
  style = 0,
) => {
  const dx = bridge.end.x - bridge.start.x,
    dz = bridge.end.z - bridge.start.z;
  const length = Math.hypot(dx, dz),
    angle = -Math.atan2(dz, dx);
  const perpendicular = { x: -dz / length, z: dx / length };
  if (built) {
    const center = bridgePointAt(0.5, bridge);
    add('box', [center.x, -0.22, center.z], [length, 0.38, bridge.width], '#a9ac94', [0, angle, 0]);
    const count = Math.ceil(length / 0.72);
    for (let index = 0; index < count; index += 1) {
      const p = bridgePointAt((index + 0.5) / count, bridge);
      add(
        'box',
        [p.x, 0.01, p.z],
        [length / count - 0.045, 0.07, bridge.width],
        index % 3 ? '#cfc8aa' : '#bdba9e',
        [0, angle, 0],
      );
    }
    for (const side of [-1, 1])
      add(
        'box',
        [
          center.x + perpendicular.x * side * bridge.width * 0.47,
          0.82,
          center.z + perpendicular.z * side * bridge.width * 0.47,
        ],
        [length, 0.1, 0.09],
        '#839c95',
        [0, angle, 0],
      );
  }
  const postCount = built ? Math.ceil(length / 3.3) : 3;
  for (let index = 0; index <= postCount; index += 1) {
    const p = bridgePointAt(built ? index / postCount : (index / postCount) * 0.15, bridge);
    for (const side of [-1, 1]) {
      const x = p.x + perpendicular.x * side * bridge.width * 0.47;
      const z = p.z + perpendicular.z * side * bridge.width * 0.47;
      add('cylinder', [x, 0.42, z], [0.12, 1.2, 0.12], '#7e9891');
      if (style && index % 3 === 0) {
        add('box', [x, 1.45, z], [0.1, 1.65, 0.1], '#617d7b');
        add('box', [x, 2.28, z], [0.38, 0.36, 0.38], '#e8d79e');
      }
    }
  }
  if (!unlocked) {
    const p = bridgePointAt(built ? bridge.gateT : 0.08, bridge);
    add('box', [p.x, 0.85, p.z], [0.28, 1.5, bridge.width], '#95aca2', [0, angle, 0]);
    for (const side of [-1, 1])
      add(
        'box',
        [
          p.x + perpendicular.x * side * bridge.width * 0.26,
          1.12,
          p.z + perpendicular.z * side * bridge.width * 0.26,
        ],
        [0.31, 0.23, bridge.width * 0.26],
        '#ddbd73',
        [0, angle, 0],
      );
  }
};

const addPath = (
  add: PartWriter,
  from: WorldPoint,
  to: WorldPoint,
  width = 2.1,
  color = '#d9d6bf',
) => {
  const dx = to.x - from.x,
    dz = to.z - from.z;
  add(
    'box',
    [(from.x + to.x) / 2, 0.018, (from.z + to.z) / 2],
    [Math.hypot(dx, dz), 0.018, width],
    color,
    [0, -Math.atan2(dz, dx), 0],
  );
};

const buildParts = (zones: readonly string[]) => {
  const stage = worldStage(zones);
  const parts: Part[] = [];
  const add: PartWriter = (shape, at, size, color, rotation) =>
    parts.push({ shape, at, size, color, rotation });
  WORLD_BUILDINGS.filter((site) => site.zone === 'plaza' || zones.includes(site.zone)).forEach(
    (site) => writeBuilding(add, site, stage),
  );
  add('cylinder', [0, 0.008, 0], [3.8, 0.035, 3.8], '#e5dfca');
  for (let index = 0; index < 32; index += 1) {
    const a = (index / 32) * Math.PI * 2,
      b = ((index + 1) / 32) * Math.PI * 2;
    addPath(
      add,
      { x: Math.cos(a) * 16, z: Math.sin(a) * 16 },
      { x: Math.cos(b) * 16, z: Math.sin(b) * 16 },
      1.8,
    );
  }
  for (const p of [
    { x: 16, z: 0 },
    { x: -16, z: 0 },
    { x: 0, z: 16 },
    { x: 0, z: -16 },
  ])
    addPath(add, { x: 0, z: 0 }, p);
  addPath(add, { x: 14.5, z: -5.7 }, WORLD_BRIDGE.start);
  if (stage >= 1) addPath(add, { x: -16, z: 4 }, { x: -23, z: 4 }, 2.8);
  if (stage >= 2) addPath(add, { x: -16, z: -5 }, { x: -23, z: -9 }, 2.6);
  if (stage >= 3) {
    addPath(add, WORLD_BRIDGE.end, { x: 44, z: -11 });
    addPath(add, { x: 44, z: -11 }, { x: 52, z: -8 });
    add('cylinder', [44, 0.016, -11], [3.8, 0.035, 3.8], '#dbd8b9');
  }
  if (stage >= 4) {
    for (const [from, to] of [
      [
        { x: -23, z: 4 },
        { x: -40, z: 0 },
      ],
      [
        { x: -40, z: 0 },
        { x: -35, z: -26 },
      ],
      [
        { x: -35, z: -26 },
        { x: -22, z: -27 },
      ],
      [
        { x: -23, z: 4 },
        { x: -24, z: 24 },
      ],
    ])
      addPath(add, from, to, 2.7);
    for (let row = 0; row < 5; row += 1) {
      add('box', [-34 + row * 1.2, 0.04, 20], [0.7, 0.06, 7], '#acb68e');
      for (let plant = 0; plant < 7; plant += 1)
        add(
          'leaf',
          [-34 + row * 1.2, 0.37, 17 + plant],
          [0.28, 0.65, 0.28],
          plant % 3 ? '#829c65' : '#c6b778',
        );
    }
    addPath(add, { x: 49, z: -7 }, { x: 58, z: -5 });
    for (let i = 0; i < 5; i += 1) {
      add('box', [58 + i * 1.2, 0.32, -15], [0.85, 0.6, 0.85], '#bea77f');
      add('leaf', [58 + i * 1.2, 1, -15], [0.5, 1.1, 0.5], '#80a881');
    }
  }
  if (stage >= 5) {
    addPath(add, { x: -35, z: -26 }, WORLD_ACADEMY_BRIDGE.start, 3.2);
    addPath(add, WORLD_ACADEMY_BRIDGE.end, { x: -54, z: -91 }, 3.4);
    addPath(add, { x: -54, z: -91 }, { x: -64, z: -92 }, 3);
    addPath(add, { x: -54, z: -91 }, { x: -47, z: -98 }, 3);
    add('cylinder', [-54, 0.02, -91], [4.7, 0.06, 4.7], '#dcd8c4');
    add('cylinder', [-54, 0.08, -91], [2.7, 0.1, 2.7], '#b1c9c0');
    // Gardens become formal paths and pavilions as the academy is built.
    for (const x of [-45, -51, -57]) {
      add('box', [x, 0.3, 5], [3.8, 0.55, 1.4], '#96ad87');
      add('stone', [x, 1.08, 5], [1.5, 0.8, 0.65], '#7d9a79');
    }
    addPath(add, { x: -40, z: 0 }, { x: -61, z: 0 }, 3);
  }
  if (stage >= 6) {
    addPath(add, { x: -47, z: -98 }, { x: -48, z: -113 }, 3);
    addPath(add, { x: -64, z: -92 }, { x: -62, z: -106 }, 3);
    addPath(add, { x: 58, z: -5 }, { x: 73, z: -6 }, 2.5);
    for (const x of [65, 70, 75]) {
      add('cylinder', [x, 0.27, -6], [1.6, 0.5, 1.6], '#adc2b4');
      add('crystal', [x, 1.2, -6], [0.6, 1, 0.6], '#a6cfbd');
    }
  }
  const extraPaths: Array<{ zone: string; points: WorldPoint[][]; color: string }> = [
    {
      zone: 'workshop-island',
      color: '#d8c9ad',
      points: [
        [
          { x: -24, z: 24 },
          { x: -18, z: 48 },
        ],
        [
          { x: 7, z: 77 },
          { x: 20, z: 100 },
        ],
        [
          { x: 20, z: 100 },
          { x: 34, z: 95 },
        ],
        [
          { x: 20, z: 100 },
          { x: 9, z: 103 },
        ],
        [
          { x: 20, z: 100 },
          { x: 18, z: 116 },
        ],
        [
          { x: 18, z: 116 },
          { x: 27, z: 116 },
        ],
      ],
    },
    {
      zone: 'crystal-island',
      color: '#c7d3ce',
      points: [
        [
          { x: 70, z: -3 },
          { x: 75, z: -2 },
        ],
        [
          { x: 103, z: 11 },
          { x: 104, z: 25 },
        ],
        [
          { x: 104, z: 25 },
          { x: 125, z: 22 },
        ],
        [
          { x: 125, z: 22 },
          { x: 128, z: 17 },
        ],
        [
          { x: 125, z: 22 },
          { x: 141, z: 22 },
        ],
        [
          { x: 141, z: 22 },
          { x: 142, z: 34 },
        ],
      ],
    },
    {
      zone: 'citadel',
      color: '#c8cbbc',
      points: [
        [
          { x: -64, z: -106 },
          { x: -67, z: -107 },
        ],
        [
          { x: -111, z: -76 },
          { x: -119, z: -74 },
        ],
        [
          { x: -119, z: -74 },
          { x: -142, z: -72 },
        ],
        [
          { x: -142, z: -72 },
          { x: -143, z: -50 },
        ],
        [
          { x: -143, z: -50 },
          { x: -124, z: -51 },
        ],
        [
          { x: -124, z: -51 },
          { x: -131, z: -52 },
        ],
        [
          { x: -124, z: -51 },
          { x: -122, z: -45 },
        ],
      ],
    },
  ];
  extraPaths.forEach(({ zone, points, color }) => {
    if (zones.includes(zone)) points.forEach(([from, to]) => addPath(add, from, to, 3.1, color));
  });
  for (const { zone, bridge } of WORLD_EXTRA_BRIDGES) {
    if (zones.includes(zone)) addBridge(add, bridge, true, true, 1);
  }
  for (const [zone, x, z, color] of [
    ['workshop-island', 20, 100, '#ded4b8'],
    ['crystal-island', 125, 22, '#dce4d5'],
    ['citadel', -124, -51, '#d3d8c8'],
  ] as const) {
    if (zones.includes(zone)) add('cylinder', [x, 0.025, z], [4.2, 0.045, 4.2], color);
  }
  for (const landmark of WORLD_LANDMARKS) {
    if (!zones.includes(landmark.zone)) continue;
    const { x, z, kind } = landmark;
    if (kind === 'cargo') {
      add('box', [x, 0.6, z], [1.65, 1.2, 1.65], '#b69871');
      add('box', [x, 1.26, z], [1.7, 0.14, 1.7], '#8d8368');
      if (stage >= 8) add('box', [x, 1.78, z], [1.1, 0.9, 1.1], '#c5ac80');
    } else if (kind === 'crane') {
      add('cylinder', [x, 0.35, z], [0.45, 0.7, 0.45], '#87958b');
      add('box', [x, 3.5, z], [0.32, 6.7, 0.32], '#b7a176');
      add('box', [x + 2.1, 6.6, z], [4.6, 0.26, 0.32], '#bb9b64');
      add('box', [x + 4.1, 4.5, z], [0.045, 4, 0.045], '#678582');
      add('box', [x + 4.1, 2.4, z], [0.32, 0.2, 0.32], '#7e9286');
    } else if (kind === 'water-tower') {
      add('cylinder', [x, 0.15, z], [1.28, 0.3, 1.28], '#aeb8a3');
      for (const dx of [-0.7, 0.7])
        for (const dz of [-0.7, 0.7])
          add('box', [x + dx, 2.3, z + dz], [0.15, 4.4, 0.15], '#8d947b');
      add('cylinder', [x, 4.9, z], [1.25, 2.2, 1.25], '#aabeb7');
      add('roof', [x, 6.35, z], [1.8, 0.8, 1.8], '#aa8466', [0, Math.PI / 4, 0]);
    } else if (kind === 'crystal') {
      add('cylinder', [x, 0.15, z], [0.97, 0.3, 0.97], '#a8bcb3');
      add('crystal', [x, 1.65, z], [0.63, 1.8, 0.63], '#98bfcd', [0.05, 0, 0.12]);
      add('crystal', [x + 0.54, 0.9, z + 0.28], [0.34, 1, 0.34], '#b0d6c5', [0, 0, -0.25]);
      add('crystal', [x - 0.5, 0.7, z - 0.3], [0.3, 0.8, 0.3], '#a99ec2', [0, 0, 0.3]);
    } else if (kind === 'fountain') {
      add('cylinder', [x, 0.28, z], [1.78, 0.55, 1.78], '#b2c4bb');
      add('cylinder', [x, 0.57, z], [1.48, 0.05, 1.48], '#99c6c8');
      add('cylinder', [x, 1.13, z], [0.25, 1.15, 0.25], '#d8dcc8');
      add('cylinder', [x, 1.68, z], [0.83, 0.18, 0.83], '#c6d2c1');
      add('crystal', [x, 2.1, z], [0.28, 0.48, 0.28], '#afd9ca');
    } else {
      add('cylinder', [x, 2.1, z], [0.11, 4.2, 0.11], '#8d9a87');
      add('box', [x + 0.65, 3.65, z], [1.3, 0.95, 0.06], '#ae8b68');
    }
  }
  addBridge(add, WORLD_BRIDGE, zones.includes('bridge'), zones.includes('island'));
  if (stage >= 4)
    addBridge(add, WORLD_ACADEMY_BRIDGE, zones.includes('academy'), zones.includes('academy'), 1);
  // A dock, loading crane, cargo and moored boats progressively fill the harbor.
  if (stage >= 1) {
    add('box', [18, -0.02, -10.5], [4.2, 0.25, 4.3], '#bea981');
    for (const x of [16.5, 19.5])
      for (const z of [-12, -9]) add('cylinder', [x, 0.5, z], [0.12, 1.15, 0.12], timber);
    for (let i = 0; i <= Math.min(stage, 4); i += 1)
      add(
        'box',
        [17 + (i % 2) * 1.15, 0.45 + Math.floor(i / 2) * 0.73, -11.5],
        [0.95, 0.73, 0.9],
        i % 2 ? '#cda875' : '#b99671',
      );
    if (stage >= 2) {
      add('box', [19.4, 2.4, -11.7], [0.18, 4.7, 0.18], '#bb9d6f');
      add('box', [20.3, 4.6, -11.7], [2.3, 0.2, 0.2], '#b29b71');
      add('box', [21.25, 3.63, -11.7], [0.035, 1.75, 0.035], '#627f7e');
    }
  }
  WORLD_ROCKS.forEach((rock, index) =>
    add(
      'stone',
      [rock.x, rock.radius * 0.64, rock.z],
      [rock.radius, rock.radius * 0.75, rock.radius * 0.88],
      '#8faa99',
      [0, index, 0],
    ),
  );

  // The renderer and authoritative server consume the same saved tree/collider
  // placement. Adding land only adds instances; existing trees stay in place.
  for (const { x, z, scale } of worldTreePositions(zones)) {
    const lower =
      x > 95
        ? '#889bab'
        : z > 65
          ? '#829873'
          : x < -100
            ? '#497f7c'
            : z < -65
              ? '#578d93'
              : '#4c947f';
    const upper =
      x > 95
        ? '#b7c5d0'
        : z > 65
          ? '#adba90'
          : x < -100
            ? '#86aba0'
            : z < -65
              ? '#8aafb0'
              : '#81b09a';
    add('cylinder', [x, 0.5 * scale, z], [0.15 * scale, scale, 0.15 * scale], '#819077');
    add('leaf', [x, 1.6 * scale, z], [0.92 * scale, 2.1 * scale, 0.92 * scale], lower);
    add('leaf', [x, 2.3 * scale, z], [0.65 * scale, 1.5 * scale, 0.65 * scale], upper);
  }
  if (stage >= 2) {
    const stops = [
      { x: -5, z: 3 },
      { x: 5, z: 3 },
      { x: -17, z: 2 },
      { x: 15, z: -3 },
    ];
    if (stage >= 4)
      stops.push({ x: -28, z: 2 }, { x: -38, z: -8 }, { x: -27, z: 22 }, { x: 55, z: -8 });
    if (stage >= 5) stops.push({ x: -50, z: -83 }, { x: -57, z: -89 }, { x: -47, z: -99 });
    stops.forEach(({ x, z }) => {
      add('cylinder', [x, 1.25, z], [0.065, 2.5, 0.065], '#718a82');
      add('box', [x, 2.5, z], [0.43, 0.48, 0.43], '#e6d8a6');
      add('roof', [x, 2.83, z], [0.36, 0.25, 0.36], '#7c9a8d', [0, Math.PI / 4, 0]);
      add('box', [x + 1.1, 0.45, z], [1.6, 0.16, 0.56], '#bfa787');
      add('box', [x + 1.1, 0.75, z - 0.23], [1.6, 0.52, 0.09], '#bea585');
      for (const dx of [0.55, 1.65]) add('box', [x + dx, 0.24, z], [0.13, 0.4, 0.48], '#8b9c88');
    });
  }
  return parts;
};

const Geometry = ({ shape }: { shape: Shape }) => {
  switch (shape) {
    case 'box':
      return <boxGeometry args={[1, 1, 1]} />;
    case 'cylinder':
      return <cylinderGeometry args={[1, 1, 1, 10]} />;
    case 'roof':
      return <coneGeometry args={[1, 1, 4]} />;
    case 'leaf':
      return <coneGeometry args={[1, 1, 6]} />;
    case 'stone':
      return <dodecahedronGeometry args={[1, 0]} />;
    case 'crystal':
      return <octahedronGeometry args={[1, 0]} />;
    case 'dome':
      return <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />;
  }
};

const PartBatch = memo(({ shape, parts }: { shape: Shape; parts: Part[] }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const object = new THREE.Object3D(),
      tint = new THREE.Color();
    parts.forEach((part, index) => {
      object.position.set(...part.at);
      object.scale.set(...part.size);
      object.rotation.set(...(part.rotation ?? [0, 0, 0]));
      object.updateMatrix();
      mesh.current!.setMatrixAt(index, object.matrix);
      mesh.current!.setColorAt(index, tint.set(part.color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [parts]);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, parts.length]} receiveShadow>
      <Geometry shape={shape} />
      <meshStandardMaterial roughness={0.92} flatShading />
    </instancedMesh>
  );
});

export const WorldStructures = memo(({ zones }: { zones: string[] }) => {
  const stage = worldStage(zones);
  const group = useRef<THREE.Group>(null);
  const previousStage = useRef(stage);
  const progress = useRef(1);
  const batches = useMemo(() => {
    const parts = buildParts(zones);
    return (['box', 'cylinder', 'roof', 'leaf', 'stone', 'crystal', 'dome'] as Shape[]).map(
      (shape) => ({ shape, parts: parts.filter((part) => part.shape === shape) }),
    );
  }, [zones]);
  useFrame((_, delta) => {
    if (previousStage.current !== stage) {
      previousStage.current = stage;
      progress.current = 0;
    }
    if (progress.current < 1 && group.current) {
      progress.current = Math.min(1, progress.current + delta / 1.15);
      group.current.scale.y = 0.91 + 0.09 * (1 - Math.pow(1 - progress.current, 3));
    }
  });
  return (
    <group ref={group}>
      {batches.map(
        ({ shape, parts }) =>
          parts.length > 0 && <PartBatch key={shape} shape={shape} parts={parts} />,
      )}
    </group>
  );
});
