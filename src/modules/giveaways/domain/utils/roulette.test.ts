import assert from 'node:assert/strict';
import test from 'node:test';
import { buildWheel, remainingSeconds } from './roulette.ts';

test('equal sectors stop every possible server winner at the top pointer', () => {
  for (const count of [1, 2, 3, 7, 12, 30, 100]) {
    const users = Array.from({ length: count }, (_, id) => ({ id, username: `user${id}` }));
    for (const winner of users) {
      const wheel = buildWheel(users, winner);
      assert.deepEqual(
        wheel.segments.map((segment) => segment.person),
        users,
      );
      for (const segment of wheel.segments) {
        assert.ok(Math.abs(segment.endAngle - segment.startAngle - 360 / count) < 1e-9);
      }
      const winningSegment = wheel.segments.find((segment) => segment.person.id === winner.id)!;
      const finalAngle = (winningSegment.angle + wheel.rotation + 90) % 360;
      assert.ok(Math.min(Math.abs(finalAngle), Math.abs(finalAngle - 360)) < 1e-9);
      assert.ok(wheel.rotation >= 7 * 360);
      assert.deepEqual(wheel, buildWheel(users, winner));
    }
  }
});

test('empty draws and cutoff countdown are safe', () => {
  assert.deepEqual(buildWheel([], null), { segments: [], rotation: 0 });
  assert.equal(buildWheel([{ id: 1, username: 'one' }], null).rotation, 0);
  assert.equal(
    buildWheel([{ id: 1, username: 'one' }], { id: 2, username: 'missing' }).rotation,
    0,
  );
  const cutoff = '2026-09-19T15:05:00Z';
  assert.equal(remainingSeconds(cutoff, Date.parse(cutoff) - 1), 1);
  assert.equal(remainingSeconds(cutoff, Date.parse(cutoff)), 0);
  assert.equal(remainingSeconds(cutoff, Date.parse(cutoff) + 5000), 0);
});
