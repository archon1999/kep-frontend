import type { GameId } from 'modules/games/domain';

export const gamePreviewSrc = (id: GameId) =>
  `${import.meta.env.BASE_URL}games/${id}-preview.${id === 'keppy-world' ? 'webp' : id === 'code-islands' ? 'png' : 'svg'}`;
