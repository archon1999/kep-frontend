import { type GameId, gameIds } from '../domain/entities/games.types.ts';

export type ScoreStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const bestKey = (id: GameId, player: string) => `kep-games:best:${id}:${player}`;
export const pendingKey = (id: GameId, player: string) => `kep-games:pending:${id}:${player}`;
const claimKey = (id: GameId) => `kep-games:guest-claim:${id}`;

export const storedScore = (storage: ScoreStorage, key: string) => {
  try {
    const value = Number(storage.getItem(key));
    return Number.isInteger(value) && value >= 0 && value <= 1000 ? value : 0;
  } catch {
    return 0;
  }
};

export const saveScore = (storage: ScoreStorage, key: string, score: number) => {
  try {
    storage.setItem(key, String(score));
    return true;
  } catch {
    return false;
  }
};

export const clearGuestClaim = (storage: ScoreStorage, id: GameId) => {
  try {
    storage.removeItem(claimKey(id));
  } catch {
    // A later guest score still remains playable when device storage is unavailable.
  }
};

// Move a local guest run only once. Account and server records are monotonic;
// the pending key survives a failed upload and is retried on the next visit.
export const claimGuestScores = (storage: ScoreStorage, username: string) => {
  if (!username || username === 'guest') return [] as GameId[];
  const claimed: GameId[] = [];
  for (const id of gameIds) {
    try {
      if (storage.getItem(claimKey(id))) continue;
      const guestBest = storedScore(storage, bestKey(id, 'guest'));
      const guestPending = storedScore(storage, pendingKey(id, 'guest'));
      const candidate = Math.max(guestBest, guestPending);
      if (candidate <= 0) continue;
      const accountBest = storedScore(storage, bestKey(id, username));
      const accountPending = storedScore(storage, pendingKey(id, username));
      const mergedBest = Math.max(accountBest, candidate);
      storage.setItem(bestKey(id, username), String(mergedBest));
      storage.setItem(pendingKey(id, username), String(Math.max(accountPending, mergedBest)));
      storage.setItem(claimKey(id), username);
      storage.removeItem(bestKey(id, 'guest'));
      storage.removeItem(pendingKey(id, 'guest'));
      claimed.push(id);
    } catch {
      // Keep guest data available if the account/queue cannot be persisted.
    }
  }
  return claimed;
};
