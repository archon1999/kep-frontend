import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORLD_ACADEMY_BRIDGE,
  WORLD_ACADEMY_CENTER,
  WORLD_BRIDGE,
  WORLD_BUILDINGS,
  WORLD_EXTRA_BRIDGES,
  WORLD_EXTRA_ISLANDS,
  WORLD_LANDMARKS,
  WORLD_PLAYER_RADIUS,
  WORLD_ROCKS,
  WORLD_ZONES,
  bridgePointAt,
  coastRadius,
  hasWorldGround,
  hitsWorldObstacle,
  hitsWorldQuest,
  predictWorldStep,
  worldBridges,
  worldDecorSolids,
  worldLandPolygons,
  worldTreePositions,
} from './terrain.ts';

const zonesFor = (stage: number) => WORLD_ZONES.slice(0, stage + 1);
const area = (points: { x: number; z: number }[]) =>
  Math.abs(
    points.reduce((total, p, i) => {
      const next = points[(i + 1) % points.length];
      return total + p.x * next.z - next.x * p.z;
    }, 0),
  ) / 2;

test('main coast is walkable only within the avatar safety inset', () => {
  for (let index = 0; index < 96; index += 1) {
    const angle = (index / 96) * Math.PI * 2;
    const point = (radius: number) => ({
      x: radius * Math.cos(angle),
      z: radius * Math.sin(angle),
    });
    assert.equal(hasWorldGround(point(coastRadius(angle) - 0.56), []), true);
    assert.equal(hasWorldGround(point(coastRadius(angle) - 0.54), []), false);
  }
});

test('community unlocks change bridge ground and gate without opening the island early', () => {
  assert.equal(hasWorldGround(bridgePointAt(0.5), []), false);
  assert.equal(hasWorldGround(bridgePointAt(0.5), ['bridge']), true);
  assert.equal(hasWorldGround({ x: 44, z: -11 }, ['bridge']), false);
  assert.equal(hasWorldGround({ x: 44, z: -11 }, ['bridge', 'island']), true);
  assert.equal(hitsWorldObstacle(bridgePointAt(0.08), []), true);
  assert.equal(hitsWorldObstacle(bridgePointAt(0.08), ['bridge']), false);
  assert.equal(hitsWorldObstacle(bridgePointAt(0.72), ['bridge']), true);
  assert.equal(hitsWorldObstacle(bridgePointAt(0.72), ['bridge', 'island']), false);
});

test('every growth stage preserves old shores and increases map area', () => {
  let previous = 0;
  for (let stage = 0; stage < 7; stage += 1) {
    const zones = zonesFor(stage);
    const sum = worldLandPolygons(zones).reduce((total, land) => total + area(land.points), 0);
    assert.ok(sum > previous);
    if (stage > 0)
      for (let i = 0; i < 360; i += 1) {
        const angle = (i / 360) * Math.PI * 2;
        assert.ok(
          coastRadius(angle, false, zones) >= coastRadius(angle, false, zonesFor(stage - 1)),
        );
        assert.ok(coastRadius(angle, true, zones) >= coastRadius(angle, true, zonesFor(stage - 1)));
      }
    previous = sum;
  }
  const initial = worldLandPolygons(zonesFor(0)).reduce(
    (total, land) => total + area(land.points),
    0,
  );
  assert.ok(previous / initial > 8);
  assert.equal(worldLandPolygons(zonesFor(6)).length, 3);
  assert.equal(coastRadius(0, false, zonesFor(6)), coastRadius(0));
  assert.equal(coastRadius(Math.PI, true, zonesFor(6)), coastRadius(Math.PI, true));
});

test('academy land and complete connecting bridge open together at level six', () => {
  assert.equal(hasWorldGround(WORLD_ACADEMY_CENTER, zonesFor(4)), false);
  assert.equal(hasWorldGround(WORLD_ACADEMY_CENTER, zonesFor(5)), true);
  assert.equal(hasWorldGround(bridgePointAt(0.5, WORLD_ACADEMY_BRIDGE), zonesFor(4)), false);
  for (let i = 0; i <= 100; i += 1) {
    const point = bridgePointAt(i / 100, WORLD_ACADEMY_BRIDGE);
    assert.equal(hasWorldGround(point, zonesFor(5)), true);
    assert.equal(hitsWorldObstacle(point, zonesFor(5)), false);
  }
});

test('bridge rails block the avatar while both bridge centerlines stay clear', () => {
  for (const bridge of [WORLD_BRIDGE, WORLD_ACADEMY_BRIDGE]) {
    const center = bridgePointAt(0.5, bridge);
    const dx = bridge.end.x - bridge.start.x,
      dz = bridge.end.z - bridge.start.z;
    const length = Math.hypot(dx, dz);
    assert.equal(hitsWorldObstacle(center, zonesFor(6)), false);
    for (const side of [-1, 1])
      assert.equal(
        hitsWorldObstacle(
          {
            x: center.x - (dz / length) * bridge.width * 0.47 * side,
            z: center.z + (dx / length) * bridge.width * 0.47 * side,
          },
          zonesFor(6),
        ),
        true,
      );
  }
});

test('prediction respects solid boulders and buildings from their foundation stage', () => {
  for (const rock of WORLD_ROCKS) {
    assert.equal(hitsWorldObstacle(rock, zonesFor(6)), true);
    assert.equal(
      hitsWorldObstacle(
        { x: rock.x + rock.radius + WORLD_PLAYER_RADIUS - 0.01, z: rock.z },
        zonesFor(6),
      ),
      true,
    );
  }
  for (const building of WORLD_BUILDINGS) {
    const zones = zonesFor(WORLD_ZONES.indexOf(building.zone));
    assert.equal(hitsWorldObstacle(building, zones), true, building.id);
    for (const x of [-1, 1])
      for (const z of [-1, 1])
        assert.equal(
          hasWorldGround(
            {
              x: building.x + x * (building.halfWidth + WORLD_PLAYER_RADIUS),
              z: building.z + z * (building.halfDepth + WORLD_PLAYER_RADIUS),
            },
            zones,
          ),
          true,
          building.id,
        );
    const start = {
      x: building.x,
      z: building.z + building.halfDepth + WORLD_PLAYER_RADIUS + 0.02,
    };
    assert.equal(predictWorldStep(start, { x: 0, z: -1 }, 0.1, zones).z, start.z);
  }
});

test('saved scenery collision data covers every visible tree and never removes old solids', () => {
  let previous: readonly { id: string }[] = [];
  for (let stage = 0; stage < WORLD_ZONES.length; stage += 1) {
    const zones = zonesFor(stage),
      solids = worldDecorSolids(zones);
    assert.equal(new Set(solids.map((solid) => solid.id)).size, solids.length);
    for (const old of previous)
      assert.ok(
        solids.some((solid) => solid.id === old.id),
        old.id,
      );
    for (const tree of worldTreePositions(zones)) {
      assert.ok(
        solids.some(
          (solid) => solid.x === tree.x && solid.z === tree.z && solid.id.startsWith('tree-'),
        ),
      );
      assert.equal(hitsWorldObstacle(tree, zones), true);
    }
    for (const solid of solids) assert.equal(hitsWorldObstacle(solid, zones), true, solid.id);
    previous = solids;
  }
});

test('three late islands add substantial land while preserving the first seven shores', () => {
  for (let stage = 7; stage < WORLD_ZONES.length; stage += 1) {
    const zones = zonesFor(stage);
    assert.equal(worldLandPolygons(zones).length, stage - 3);
    assert.equal(worldBridges(zones).length, stage - 4);
    for (let i = 0; i < 96; i += 1) {
      const angle = (i / 96) * Math.PI * 2;
      assert.equal(coastRadius(angle, false, zones), coastRadius(angle, false, zonesFor(6)));
      assert.equal(coastRadius(angle, true, zones), coastRadius(angle, true, zonesFor(6)));
    }
    for (const { zone, bridge } of WORLD_EXTRA_BRIDGES) {
      if (!zones.includes(zone as (typeof WORLD_ZONES)[number])) continue;
      for (let i = 0; i <= 100; i += 1) {
        const point = bridgePointAt(i / 100, bridge);
        assert.equal(hasWorldGround(point, zones), true, zone);
        assert.equal(hitsWorldObstacle(point, zones), false, `${zone} ${i}`);
      }
    }
  }
  for (const island of WORLD_EXTRA_ISLANDS) {
    assert.equal(hasWorldGround(island.center, zonesFor(island.startStage - 1)), false);
    assert.equal(hasWorldGround(island.center, zonesFor(island.startStage)), true);
  }
  const landArea = (stage: number) =>
    worldLandPolygons(zonesFor(stage)).reduce((sum, land) => sum + area(land.points), 0);
  assert.ok(landArea(9) > landArea(6) * 1.75);
  assert.ok(landArea(9) > landArea(0) * 14);
});

test('new visible landmarks have matching active collision footprints', () => {
  for (const landmark of WORLD_LANDMARKS) {
    const zones = zonesFor(WORLD_ZONES.indexOf(landmark.zone));
    assert.equal(hasWorldGround(landmark, zones), true, landmark.id);
    assert.equal(hitsWorldObstacle(landmark, zones), true, landmark.id);
    assert.ok(worldDecorSolids(zones).some((solid) => solid.id === landmark.id));
  }
});

test('prediction keeps nearby avatars apart and permits sliding alongside them', () => {
  assert.deepEqual(predictWorldStep({ x: 0, z: 2 }, { x: 1, z: 0 }, 0.1, [], [{ x: 2.1, z: 2 }]), {
    x: 0,
    z: 2,
  });
  const result = predictWorldStep({ x: 0, z: 2 }, { x: 1, z: 1 }, 0.1, [], [{ x: 1.95, z: 2 }]);
  assert.equal(result.x, 0);
  assert.ok(result.z > 2);
});

test('live quest kiosks block prediction and release ground immediately when claimed', () => {
  const kiosk = { x: 1.2, z: 2 };
  const start = { x: 0, z: 2 };
  assert.equal(hitsWorldQuest({ x: kiosk.x + 0.979, z: kiosk.z }, [kiosk]), true);
  assert.equal(hitsWorldQuest({ x: kiosk.x + 0.981, z: kiosk.z }, [kiosk]), false);
  assert.deepEqual(predictWorldStep(start, { x: 1, z: 0 }, 0.1, [], [], [kiosk]), start);
  assert.deepEqual(predictWorldStep(start, { x: 1, z: 0 }, 0.1, [], [], []), { x: 0.43, z: 2 });
});

test('prediction never fabricates a jump off an unconfirmed edge', () => {
  const start = { x: 0, z: coastRadius(Math.PI / 2) - 0.6 };
  assert.deepEqual(predictWorldStep(start, { x: 0, z: 1 }, 0.1, []), start);
  assert.deepEqual(predictWorldStep({ x: 0, z: 0 }, { x: 1, z: 0 }, 0.1, []), { x: 0.43, z: 0 });
});
