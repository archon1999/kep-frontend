import type { GameProgress, GameProgressRepository } from '../../domain/contracts';
import { levels } from '../../domain/utils/levels.ts';

const emptyProgress = (): GameProgress => ({ completed: [], stars: {}, drafts: {} });

const storageKey = (player: string) => `kepper-code-islands:progress:${player}`;
const guestClaimKey = 'kepper-code-islands:guest-claim';
const hasProgress = (progress: GameProgress) =>
  progress.completed.length > 0 || Object.keys(progress.drafts).length > 0;

export class LocalGameProgressRepository implements GameProgressRepository {
  load(player: string): GameProgress {
    const account = this.read(player);
    if (player === 'guest' || hasProgress(account)) return account;
    this.claimGuestProgress(player);
    return this.read(player);
  }

  private claimGuestProgress(player: string): void {
    try {
      if (localStorage.getItem(guestClaimKey)) return;
      const guest = this.read('guest');
      if (!hasProgress(guest)) return;
      localStorage.setItem(storageKey(player), JSON.stringify(guest));
      localStorage.setItem(guestClaimKey, player);
      localStorage.removeItem(storageKey('guest'));
    } catch {
      // Preserve the guest copy if the account cannot be written.
    }
  }

  private read(player: string): GameProgress {
    try {
      const raw = localStorage.getItem(storageKey(player));
      if (!raw) return emptyProgress();
      const saved = JSON.parse(raw) as Partial<GameProgress>;
      const completed = Array.isArray(saved.completed)
        ? [
            ...new Set(
              saved.completed.filter(
                (id) => Number.isInteger(id) && id >= 1 && id <= levels.length,
              ),
            ),
          ]
        : [];
      const savedStars =
        saved.stars && typeof saved.stars === 'object' && !Array.isArray(saved.stars)
          ? saved.stars
          : {};
      const stars = Object.fromEntries(
        completed.map((id) => {
          const value = Number(savedStars[id]);
          return [id, Number.isFinite(value) ? Math.max(1, Math.min(3, Math.trunc(value))) : 1];
        }),
      );
      const savedDrafts =
        saved.drafts && typeof saved.drafts === 'object' && !Array.isArray(saved.drafts)
          ? saved.drafts
          : {};
      const drafts = Object.fromEntries(
        Object.entries(savedDrafts).filter(
          ([id, source]) =>
            Number.isInteger(Number(id)) &&
            Number(id) >= 1 &&
            Number(id) <= levels.length &&
            typeof source === 'string' &&
            source.length <= 10000,
        ),
      );
      return {
        completed,
        stars,
        drafts,
      };
    } catch {
      return emptyProgress();
    }
  }

  save(player: string, progress: GameProgress): void {
    try {
      localStorage.setItem(storageKey(player), JSON.stringify(progress));
      if (player === 'guest' && hasProgress(progress)) localStorage.removeItem(guestClaimKey);
    } catch {
      // The game remains playable when storage is disabled or full.
    }
  }
}

export const gameProgressRepository = new LocalGameProgressRepository();
