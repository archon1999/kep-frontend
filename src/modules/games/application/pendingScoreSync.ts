import type { GameId, ScoreSubmission } from '../domain/entities/games.types.ts';
import {
  type ScoreStorage,
  bestKey,
  pendingKey,
  saveScore,
  storedScore,
} from './scorePersistence.ts';

type SyncResult = { bestScore: number; submitted: boolean };
type SubmitScore = (id: GameId, score: number) => Promise<ScoreSubmission>;
const flights = new Map<string, Promise<SyncResult>>();

export const flushPendingScore = (
  id: GameId,
  player: string,
  submit: SubmitScore,
  storage: ScoreStorage = localStorage,
): Promise<SyncResult> => {
  const key = pendingKey(id, player);
  const existing = flights.get(key);
  if (existing) return existing;

  const flight = (async () => {
    let bestScore = storedScore(storage, bestKey(id, player));
    let submitted = false;
    while (true) {
      const queued = storedScore(storage, key);
      if (queued <= 0) return { bestScore, submitted };
      const result = await submit(id, queued);
      submitted = true;
      bestScore = Math.max(bestScore, result.bestScore);
      saveScore(storage, bestKey(id, player), bestScore);
      if (storedScore(storage, key) <= result.bestScore) {
        try {
          storage.removeItem(key);
        } catch {
          // The server has this score; a later retry is harmless.
        }
        return { bestScore, submitted };
      }
    }
  })();

  flights.set(key, flight);
  const clear = () => {
    if (flights.get(key) === flight) flights.delete(key);
  };
  void flight.then(clear, clear);
  return flight;
};
