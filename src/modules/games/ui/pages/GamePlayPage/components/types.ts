import type { useGameAudio } from 'modules/games/application';

export interface MiniGameProps {
  best: number;
  onScore: (score: number) => void;
  audio: ReturnType<typeof useGameAudio>;
}
