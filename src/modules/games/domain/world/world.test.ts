import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORLD_JUMP_DURATION,
  WORLD_JUMP_PEAK_HEIGHT,
  WORLD_SECOND_ISLAND_CENTER,
  WORLD_SECOND_ISLAND_RADIUS,
  WORLD_SPEED,
  WORLD_STATION_HOLD,
  WORLD_STATION_WINDOW,
  clampToWorld,
  initialWorldRouteProgress,
  isWorldTerminalAnswerCorrect,
  isWorldTerminalAnswerFormat,
  validWorldIds,
  worldAdvanceRoute,
  worldBeaconTriggered,
  worldBeacons,
  worldBridge,
  worldBridgeContains,
  worldBridgeGapAt,
  worldBridgeGaps,
  worldBridgePointAt,
  worldChargeDelta,
  worldCoastRadius,
  worldCoastline,
  worldDistance,
  worldIsOutside,
  worldJumpBarriers,
  worldJumpHeight,
  worldMoveSpeed,
  worldObjectivesComplete,
  worldRoutes,
  worldScore,
  worldSecondCoastline,
  worldSentries,
  worldSentryPosition,
  worldShards,
  worldSlowZones,
  worldStationPulse,
  worldStations,
  worldTerminals,
  worldTraverse,
} from './world.ts';

test('saved world objectives ignore duplicate and unknown IDs', () => {
  assert.deepEqual(validWorldIds(['s1', 's1', 's99', 4, 's2'], worldShards), ['s1', 's2']);
  assert.deepEqual(validWorldIds(Array(14).fill('s1'), worldShards), ['s1']);
  assert.deepEqual(validWorldIds(Array(8).fill('t1'), worldTerminals), ['t1']);
  assert.deepEqual(validWorldIds(['b1', 'b1', 'b9'], worldBeacons), ['b1']);
  assert.deepEqual(validWorldIds(['r1', 'r2', 'r3'], worldRoutes), ['r1', 'r2']);
});

test('all open-world objectives are reachable across both islands', () => {
  for (const item of [...worldShards, ...worldTerminals, ...worldStations, ...worldBeacons]) {
    assert.equal(worldIsOutside(item), false, item.id);
  }
  assert.equal(new Set(worldShards.map((item) => item.id)).size, worldShards.length);
  assert.equal(new Set(worldTerminals.map((item) => item.id)).size, worldTerminals.length);
  assert.equal(worldShards.length, 14);
  assert.equal(worldTerminals.length, 8);
  assert.equal(worldStations.length, 4);
  assert.equal(worldBeacons.length, 3);
  assert.equal(worldRoutes.length, 2);
  const secondIslandObjectives = [
    ...worldShards.filter((item) => ['s4', 's8', 's10', 's14'].includes(item.id)),
    ...worldTerminals.filter((item) => ['t4', 't8'].includes(item.id)),
    worldStations.find((item) => item.id === 'p4')!,
    worldBeacons.find((item) => item.id === 'b3')!,
  ];
  assert.equal(secondIslandObjectives.length, 8);
  for (const objective of secondIslandObjectives) {
    assert.ok(worldDistance(objective, WORLD_SECOND_ISLAND_CENTER) < WORLD_SECOND_ISLAND_RADIUS);
  }
  assert.ok(
    worldRoutes
      .find((route) => route.id === 'r2')!
      .checkpoints.every(
        (point) => worldDistance(point, WORLD_SECOND_ISLAND_CENTER) < WORLD_SECOND_ISLAND_RADIUS,
      ),
  );
  assert.equal(new Set(worldStations.map((item) => item.id)).size, worldStations.length);
  assert.equal(worldTerminals.filter((item) => item.response === 'choice').length, 2);
  assert.equal(worldTerminals.filter((item) => item.response !== 'choice').length, 6);
  assert.ok(
    worldTerminals.every(
      (item) => item.response !== 'choice' || (item.answer >= 0 && item.answer < item.optionCount),
    ),
  );
  const outerObjectives = [...worldShards, ...worldTerminals, ...worldStations].filter(
    (item) => Math.hypot(item.x, item.z) > 11.2,
  );
  assert.ok(outerObjectives.length >= 8, 'the expanded trail must have real destinations');
  for (const route of worldRoutes) {
    assert.equal(route.checkpoints.length, 4);
    for (const checkpoint of route.checkpoints) {
      assert.equal(worldIsOutside(checkpoint), false, route.id);
    }
    const minimumTravel = route.checkpoints.slice(1).reduce((total, point, index) => {
      const previous = route.checkpoints[index];
      return total + Math.hypot(point.x - previous.x, point.z - previous.z) / 4.3;
    }, 0);
    assert.ok(route.timeLimit > minimumTravel * 2, `${route.id} needs recovery time`);
    assert.ok(route.timeLimit < minimumTravel * 5, `${route.id} should feel timed`);
  }
});

test('relay answers validate choice, integer and ordered-list formats', () => {
  const [choice, , integer, , , , , list] = worldTerminals;
  assert.equal(choice.response, 'choice');
  assert.equal(integer.response, 'integer');
  assert.equal(list.response, 'integer-list');

  assert.equal(isWorldTerminalAnswerCorrect(choice, 2), true);
  assert.equal(isWorldTerminalAnswerCorrect(choice, 1), false);
  assert.equal(isWorldTerminalAnswerFormat(choice, '2'), false);
  assert.equal(isWorldTerminalAnswerFormat(choice, 8), false);

  assert.equal(isWorldTerminalAnswerCorrect(integer, ' 05 '), true);
  assert.equal(isWorldTerminalAnswerCorrect(integer, '4'), false);
  assert.equal(isWorldTerminalAnswerFormat(integer, '5abc'), false);
  assert.equal(isWorldTerminalAnswerFormat(integer, '5.0'), false);

  for (const answer of ['[8,4,4]', '8, 4, 4', '8 4 4', '8;4;4']) {
    assert.equal(isWorldTerminalAnswerCorrect(list, answer), true, answer);
  }
  assert.equal(isWorldTerminalAnswerCorrect(list, '[4,8,4]'), false);
  for (const malformed of ['[8,4,4', '8,,4,4', '8,4,4,', '8 4 x']) {
    assert.equal(isWorldTerminalAnswerFormat(list, malformed), false, malformed);
  }
});

test('jump crosses low rails while grounded movement must go around an open end', () => {
  assert.equal(worldJumpBarriers.length, 3);
  assert.equal(worldJumpHeight(0), 0);
  assert.equal(worldJumpHeight(WORLD_JUMP_DURATION), 0);
  assert.equal(worldJumpHeight(WORLD_JUMP_DURATION / 2), WORLD_JUMP_PEAK_HEIGHT);
  assert.ok(worldJumpBarriers.every((barrier) => barrier.clearance < WORLD_JUMP_PEAK_HEIGHT));
  for (const barrier of worldJumpBarriers) {
    assert.equal(worldIsOutside(barrier.start), false, barrier.id);
    assert.equal(worldIsOutside(barrier.end), false, barrier.id);
    const midpoint = {
      x: (barrier.start.x + barrier.end.x) / 2,
      z: (barrier.start.z + barrier.end.z) / 2,
    };
    const approach = { x: midpoint.x, z: midpoint.z - 0.6 };
    const beyond = { x: midpoint.x, z: midpoint.z + 0.6 };
    assert.equal(worldTraverse(approach, beyond, 0).blockedBy, barrier.id);
    assert.deepEqual(worldTraverse(approach, beyond, WORLD_JUMP_PEAK_HEIGHT).position, beyond);
    const outside = { x: barrier.start.x - 0.45, z: midpoint.z - 0.6 };
    const around = { x: outside.x, z: midpoint.z + 0.6 };
    assert.equal(worldTraverse(outside, around, 0).blockedBy, null);
  }
});

test('beacons distinguish airborne contact from an accurate landing', () => {
  assert.deepEqual(
    worldBeacons.map((beacon) => beacon.kind),
    ['airborne', 'airborne', 'landing'],
  );
  const airborne = worldBeacons[0];
  assert.equal(
    worldBeaconTriggered(
      airborne,
      { point: airborne, height: 0 },
      { point: airborne, height: airborne.minHeight - 0.01 },
    ),
    false,
  );
  assert.equal(
    worldBeaconTriggered(
      airborne,
      { point: airborne, height: 0 },
      { point: airborne, height: airborne.minHeight + 0.01 },
    ),
    true,
  );
  const landing = worldBeacons[2];
  assert.equal(
    worldBeaconTriggered(landing, { point: landing, height: 0 }, { point: landing, height: 0 }),
    false,
  );
  assert.equal(
    worldBeaconTriggered(landing, { point: landing, height: 0.04 }, { point: landing, height: 0 }),
    true,
  );
  assert.equal(
    worldBeaconTriggered(
      landing,
      { point: landing, height: 0.04 },
      { point: { x: landing.x + landing.radius + 0.1, z: landing.z }, height: 0 },
    ),
    false,
  );
});

test('route trials require ordered checkpoints before their deadline', () => {
  for (const route of worldRoutes) {
    const initial = initialWorldRouteProgress();
    assert.deepEqual(initial, { nextCheckpoint: 0, startedAt: null });
    assert.deepEqual(worldAdvanceRoute(route, initial, route.checkpoints[1], 10).progress, initial);
    const started = worldAdvanceRoute(route, initial, route.checkpoints[0], 10);
    assert.deepEqual(started.progress, { nextCheckpoint: 1, startedAt: 10 });
    let progress: ReturnType<typeof initialWorldRouteProgress> = started.progress;
    for (let index = 1; index < route.checkpoints.length; index += 1) {
      const result = worldAdvanceRoute(route, progress, route.checkpoints[index], 10 + index);
      progress = result.progress;
      assert.equal(result.completed, index === route.checkpoints.length - 1);
    }
    const retained = worldAdvanceRoute(route, progress, route.checkpoints[0], 1000);
    assert.equal(retained.completed, true);
    assert.equal(retained.timedOut, false);
    assert.deepEqual(retained.progress, progress);
    const expired = worldAdvanceRoute(
      route,
      started.progress,
      route.checkpoints[1],
      10 + route.timeLimit + 0.01,
    );
    assert.equal(expired.timedOut, true);
    assert.deepEqual(expired.progress, initial);
  }
});

test('station pulses permit a deliberate hold and sentries stay on their marked tracks', () => {
  assert.ok(WORLD_STATION_HOLD < WORLD_STATION_WINDOW);
  assert.ok(
    Array(22)
      .fill(0.1)
      .reduce((total, frame) => total + worldChargeDelta(frame), 0) >= WORLD_STATION_HOLD,
  );
  assert.equal(worldChargeDelta(5), 0.25);
  for (const station of worldStations) {
    assert.equal(worldStationPulse(station, -station.phase), true);
    assert.equal(worldStationPulse(station, WORLD_STATION_WINDOW - station.phase + 0.01), false);
  }
  for (const sentry of worldSentries) {
    for (let second = 0; second < sentry.period * 2; second += 0.25) {
      const point = worldSentryPosition(sentry, second);
      assert.equal(worldIsOutside(point), false, sentry.id);
      assert.ok(point.x >= Math.min(sentry.start.x, sentry.end.x) - 0.001);
      assert.ok(point.x <= Math.max(sentry.start.x, sentry.end.x) + 0.001);
      assert.ok(point.z >= Math.min(sentry.start.z, sentry.end.z) - 0.001);
      assert.ok(point.z <= Math.max(sentry.start.z, sentry.end.z) + 0.001);
      for (const station of worldStations) {
        assert.ok(
          Math.hypot(point.x - station.x, point.z - station.z) > 1.7,
          `${sentry.id} crosses ${station.id} while the player holds a pulse`,
        );
      }
      for (const terminal of worldTerminals) {
        assert.ok(
          Math.hypot(point.x - terminal.x, point.z - terminal.z) > 1.7,
          `${sentry.id} crosses ${terminal.id} at its click-to-move destination`,
        );
      }
    }
  }
  assert.equal(worldSentries.length, 5);
});

test('visible slow terrain changes speed without stopping either control mode', () => {
  assert.equal(worldSlowZones.length, 4);
  assert.ok(worldSlowZones.every((zone) => !worldIsOutside(zone)));
  assert.equal(worldMoveSpeed({ x: 0, z: 0 }), 4.3);
  for (const zone of worldSlowZones) {
    assert.ok(worldMoveSpeed(zone) > 3);
    assert.ok(worldMoveSpeed(zone) < worldMoveSpeed({ x: 0, z: 0 }));
  }
});

test('the expanded coast is irregular and leaving it ends a run', () => {
  assert.equal(worldCoastline.length, 96);
  assert.equal(worldSecondCoastline.length, 96);
  const radii = worldCoastline.map((point) => Math.hypot(point.x, point.z));
  assert.ok(Math.max(...radii) - Math.min(...radii) > 3);
  const secondRadii = worldSecondCoastline.map((point) =>
    worldDistance(point, WORLD_SECOND_ISLAND_CENTER),
  );
  assert.ok(Math.max(...secondRadii) - Math.min(...secondRadii) > 1);
  const shoreline = { x: worldCoastRadius(0), z: 0 };
  assert.equal(worldIsOutside(shoreline), true);
  assert.deepEqual(worldTraverse({ x: 0, z: 0 }, shoreline, 0).position, shoreline);
  const point = clampToWorld({ x: 40, z: 40 });
  assert.equal(worldIsOutside(point), false);
  assert.deepEqual(clampToWorld({ x: 1, z: 1 }), { x: 1, z: 1 });
  const secondClamped = clampToWorld({ x: WORLD_SECOND_ISLAND_CENTER.x + 20, z: -11 });
  assert.equal(worldIsOutside(secondClamped), false);
  assert.ok(secondClamped.x > WORLD_SECOND_ISLAND_CENTER.x);
});

test('bridge joins both islands and its broken planks require a jump', () => {
  assert.equal(worldIsOutside(worldBridge.start), false);
  assert.equal(worldIsOutside(worldBridge.end), false);
  for (let t = 0; t <= 1.001; t += 0.025) {
    assert.equal(worldBridgeContains(worldBridgePointAt(t)), true);
    assert.equal(worldIsOutside(worldBridgePointAt(t)), false);
  }
  assert.equal(worldBridgeGaps.length, 1);
  const gap = worldBridgeGaps[0];
  const bridgeLength = worldDistance(worldBridge.start, worldBridge.end);
  assert.ok((gap.endT - gap.startT) * bridgeLength < WORLD_SPEED * WORLD_JUMP_DURATION);
  assert.equal(worldBridgeGapAt(worldBridgePointAt((gap.startT + gap.endT) / 2)), true);
  assert.equal(worldBridgeGapAt(worldBridgePointAt(0.2)), false);
  assert.equal(worldBridgeGapAt(worldBridge.start), false);
  assert.equal(worldBridgeGapAt(worldBridge.end), false);

  const midpoint = worldBridgePointAt(0.5);
  const dx = worldBridge.end.x - worldBridge.start.x;
  const dz = worldBridge.end.z - worldBridge.start.z;
  const length = Math.hypot(dx, dz);
  const offEdge = {
    x: midpoint.x + (-dz / length) * (worldBridge.width / 2 + 0.5),
    z: midpoint.z + (dx / length) * (worldBridge.width / 2 + 0.5),
  };
  assert.equal(worldBridgeContains(offEdge), false);
  assert.equal(worldBridgeGapAt(offEdge), false);
  assert.equal(worldIsOutside(offEdge), true);
  const bridgeClamped = clampToWorld(offEdge);
  assert.equal(worldIsOutside(bridgeClamped), false);
  assert.ok(worldDistance(bridgeClamped, midpoint) < worldBridge.width);
});

test('1000 needs all five objective types and a clean fast finish', () => {
  assert.equal(worldScore(0, 0, 0, 0, 0, 0), 0);
  assert.equal(worldScore(1, 1, 1, 10, 0, 0), 110);
  assert.equal(worldScore(14, 7, 4, 0, 0, 0), 705);
  assert.equal(worldScore(14, 8, 3, 0, 0, 0), 715);
  assert.equal(worldScore(14, 8, 4, 0, 0, 0), 760);
  assert.equal(worldScore(14, 8, 4, 420, 0, 0, 2, 2), 920);
  assert.equal(worldScore(14, 8, 4, 420, 0, 0, 3, 1), 900);
  assert.equal(worldScore(14, 8, 4, 420, 0, 0, 3, 2), 1000);
  assert.equal(worldScore(14, 8, 4, 421, 0, 0, 3, 2), 999);
  assert.equal(worldScore(14, 8, 4, 420, 1, 0, 3, 2), 992);
  assert.equal(worldScore(14, 8, 4, 420, 0, 1, 3, 2), 990);
  assert.equal(worldScore(14, 8, 4, 720, 0, 0, 3, 2), 980);
  assert.equal(worldScore(14, 8, 4, 1200, 2, 3, 3, 2), 950);
  assert.equal(worldScore(100, 100, 100, 0, 0, 0, 100, 100), 1000);
  assert.equal(
    worldObjectivesComplete({ shards: 14, terminals: 8, stations: 4, beacons: 3, routes: 1 }),
    false,
  );
  assert.equal(
    worldObjectivesComplete({ shards: 14, terminals: 8, stations: 4, beacons: 3, routes: 2 }),
    true,
  );
});
