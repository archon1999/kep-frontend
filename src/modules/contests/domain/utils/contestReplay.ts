import type { ReplayFrame } from '../entities/contest-replay.types.ts';

export function findReplayFrame(frames: ReplayFrame[], time: number): number {
  let low = 0;
  let high = frames.length - 1;
  let found = -1;
  while (low <= high) {
    const middle = (low + high) >>> 1;
    if (frames[middle].at <= time) {
      found = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return found;
}

export function replayTime(start: number, elapsedMs: number, duration: number, minutes: number) {
  return Math.min(duration, start + (elapsedMs / (minutes * 60_000)) * duration);
}

export function formatReplayTime(time: number) {
  const seconds = Math.max(0, Math.floor(time));
  return [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}
