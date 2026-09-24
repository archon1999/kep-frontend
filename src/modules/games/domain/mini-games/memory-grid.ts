export const MEMORY_GRID_SIZE = 36;
export const MEMORY_ROUND_LENGTHS = [3, 5, 7, 9, 12, 15, 18, 21, 24, 28] as const;
export const MEMORY_ROUND_GRID_SIDES = [3, 3, 4, 4, 4, 5, 5, 5, 6, 6] as const;

export function memoryGridSide(round: number): number {
  const stage = Math.max(0, Math.min(MEMORY_ROUND_GRID_SIDES.length - 1, Math.floor(round)));
  return MEMORY_ROUND_GRID_SIDES[stage];
}

export function memoryPreviewTiming(round: number) {
  const stage = Math.max(0, Math.min(MEMORY_ROUND_LENGTHS.length - 1, Math.floor(round)));
  const interval = 1020 - stage * 55;
  return { interval, flash: Math.round(interval * 0.65) };
}

export function createMemorySequence(
  length: number,
  random: () => number = Math.random,
  gridSide = 4,
): number[] {
  const gridSize = Math.min(MEMORY_GRID_SIZE, Math.max(3, Math.floor(gridSide)) ** 2);
  const result: number[] = [];
  for (let index = 0; index < length; index += 1) {
    let cell = Math.min(gridSize - 1, Math.floor(random() * gridSize));
    if (cell === result[index - 1]) cell = (cell + 1) % gridSize;
    result.push(cell);
  }
  return result;
}

export function memoryGridScore(cleared: number, replays: number): number {
  return Math.max(
    0,
    Math.min(1000, Math.floor(cleared) * 100 - Math.max(0, Math.floor(replays)) * 25),
  );
}
