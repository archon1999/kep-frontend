import type { GameId } from 'modules/games/domain';

const gameCovers: Partial<Record<GameId, string>> = {
  'math-compare': 'math-compare-cover.svg',
  'quick-math': 'quick-math-cover.svg',
  'number-sequence': 'number-sequence-cover.svg',
  'number-hunt': 'number-hunt-cover.svg',
  'memory-matrix': 'memory-matrix-cover.svg',
};

export const gamePreviewSrc = (id: GameId) => {
  const fallback = `${id}-preview.${id === 'keppy-world' ? 'webp' : id === 'code-islands' ? 'png' : 'svg'}`;
  return `${import.meta.env.BASE_URL}games/${gameCovers[id] ?? fallback}`;
};
