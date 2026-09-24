import assert from 'node:assert/strict';
import test from 'node:test';
import {
  worldBeacons,
  worldRoutes,
  worldShards,
  worldStations,
  worldTerminals,
} from '../domain/world/world.ts';
import { type WorldSave, loadWorldSave } from './worldPersistence.ts';

const store = (save: Partial<WorldSave>) => ({
  getItem: (key: string) => (key === 'kep-games:world:player' ? JSON.stringify(save) : null),
  setItem: () => undefined,
  removeItem: () => undefined,
});

test('an incomplete save does not claim a completed expedition', () => {
  const completed: Partial<WorldSave> = {
    position: { x: 9, z: 4 },
    collected: worldShards.map((item) => item.id),
    solved: worldTerminals.map((item) => item.id),
    charged: worldStations.map((item) => item.id),
    mistakes: 2,
    hits: 3,
    lockedUntil: {},
    elapsed: 780,
    completed: true,
  };
  assert.deepEqual(loadWorldSave(store(completed), 'player'), {
    ...completed,
    beacons: [],
    routes: [],
    completed: false,
    fallen: false,
  });
});

test('an unfinished save keeps valid objectives and position', () => {
  const unfinished: Partial<WorldSave> = {
    position: { x: -8, z: -7 },
    collected: ['s1', 's2'],
    solved: ['t1'],
    charged: ['p1'],
    mistakes: 1,
    hits: 2,
    lockedUntil: { t2: 30 },
    elapsed: 120,
    completed: false,
  };
  assert.deepEqual(loadWorldSave(store(unfinished), 'player'), {
    ...unfinished,
    beacons: [],
    routes: [],
    fallen: false,
  });
});

test('a completed expedition requires and keeps every objective category', () => {
  const completed: WorldSave = {
    position: { x: 1, z: 2 },
    collected: worldShards.map((item) => item.id),
    solved: worldTerminals.map((item) => item.id),
    charged: worldStations.map((item) => item.id),
    beacons: worldBeacons.map((item) => item.id),
    routes: worldRoutes.map((item) => item.id),
    mistakes: 0,
    hits: 0,
    lockedUntil: {},
    elapsed: 400,
    completed: true,
    fallen: false,
  };
  assert.deepEqual(loadWorldSave(store(completed), 'player'), completed);
});

test('falling ends the saved run until the player restarts', () => {
  const saved: Partial<WorldSave> = {
    position: { x: 19, z: 2 },
    collected: ['s1'],
    fallen: true,
  };
  const loaded = loadWorldSave(store(saved), 'player');
  assert.equal(loaded.fallen, true);
  assert.equal(loaded.completed, false);
  assert.deepEqual(loaded.collected, ['s1']);
});

test('a saved run resumes on the second island', () => {
  const loaded = loadWorldSave(store({ position: { x: 44, z: -11 }, collected: ['s4'] }), 'player');
  assert.deepEqual(loaded.position, { x: 44, z: -11 });
  assert.deepEqual(loaded.collected, ['s4']);
});
