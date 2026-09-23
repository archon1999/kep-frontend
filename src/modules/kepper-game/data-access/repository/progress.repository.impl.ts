import type { GameProgress, GameProgressRepository } from '../../domain/contracts';

const emptyProgress = (): GameProgress => ({ completed: [], stars: {}, drafts: {} });

const storageKey = (player: string) => `kepper-code-islands:v1:${player}`;

export class LocalGameProgressRepository implements GameProgressRepository {
  load(player: string): GameProgress {
    try {
      const raw = localStorage.getItem(storageKey(player));
      if (!raw) return emptyProgress();
      const saved = JSON.parse(raw) as Partial<GameProgress>;
      return {
        completed: Array.isArray(saved.completed)
          ? saved.completed.filter((id): id is number => Number.isInteger(id) && id >= 1 && id <= 5)
          : [],
        stars: saved.stars && typeof saved.stars === 'object' ? saved.stars : {},
        drafts: saved.drafts && typeof saved.drafts === 'object' ? saved.drafts : {},
      };
    } catch {
      return emptyProgress();
    }
  }

  save(player: string, progress: GameProgress): void {
    try {
      localStorage.setItem(storageKey(player), JSON.stringify(progress));
    } catch {
      // The game remains playable when storage is disabled or full.
    }
  }
}

export const gameProgressRepository = new LocalGameProgressRepository();
