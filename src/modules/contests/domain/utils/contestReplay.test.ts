import assert from 'node:assert/strict';
import test from 'node:test';
import { findReplayFrame, formatReplayTime, replayTime } from './contestReplay.ts';

test('seek works forwards and backwards, including simultaneous events and boundaries', () => {
  const frames = [0, 10, 10, 30].map((at) => ({ at, rows: [] }));
  assert.equal(findReplayFrame(frames, 100), 3);
  assert.equal(findReplayFrame(frames, 10), 2);
  assert.equal(findReplayFrame(frames, 9), 0);
  assert.equal(findReplayFrame(frames, 0), 0);
  assert.equal(findReplayFrame([], 0), -1);
});

test('1/2/3 minute playback spans the whole contest and never overshoots', () => {
  for (const minutes of [1, 2, 3]) {
    assert.equal(replayTime(0, minutes * 30_000, 7200, minutes), 3600);
    assert.equal(replayTime(0, minutes * 60_000, 7200, minutes), 7200);
    assert.equal(replayTime(7000, minutes * 60_000, 7200, minutes), 7200);
  }
  assert.equal(replayTime(3600, 30_000, 7200, 2), 5400);
  assert.equal(formatReplayTime(3661.99), '01:01:01');
});
