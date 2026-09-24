import { useCallback, useEffect, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';
import type { GameId } from '../domain';
import { gamesKeys } from './keys';
import { submitGameScore } from './mutations';
import { flushPendingScore } from './pendingScoreSync';
import { useGamesLeaderboard } from './queries';
import { bestKey, clearGuestClaim, pendingKey, saveScore, storedScore } from './scorePersistence';
import { useGuestScoreClaim } from './useGuestScoreClaim';

export const useGameScore = (id: GameId, username?: string) => {
  const player = username ?? 'guest';
  const owner = `${id}:${player}`;
  useGuestScoreClaim(username);
  const { mutate } = useSWRConfig();
  const { data: leaderboard } = useGamesLeaderboard(id);
  const [best, setBest] = useState(() => storedScore(localStorage, bestKey(id, player)));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const inFlight = useRef<string | null>(null);
  const ownerRef = useRef(owner);
  ownerRef.current = owner;

  useEffect(() => {
    setBest(storedScore(localStorage, bestKey(id, player)));
    setPending(false);
    setError(false);
  }, [id, player]);

  useEffect(() => {
    const serverScore = leaderboard?.currentUser?.score;
    if (!username || leaderboard?.currentUser?.username !== username || serverScore === undefined)
      return;
    setBest((current) => Math.max(current, serverScore));
    saveScore(
      localStorage,
      bestKey(id, player),
      Math.max(storedScore(localStorage, bestKey(id, player)), serverScore),
    );
  }, [id, leaderboard, player, username]);

  const send = useCallback(
    async (score: number) => {
      if (!username) return;
      const key = pendingKey(id, player);
      if (!saveScore(localStorage, key, Math.max(storedScore(localStorage, key), score))) {
        if (ownerRef.current === owner) setError(true);
        return;
      }
      if (inFlight.current === key) return;
      inFlight.current = key;
      if (ownerRef.current === owner) {
        setPending(true);
        setError(false);
      }
      try {
        const result = await flushPendingScore(id, player, submitGameScore);
        if (ownerRef.current === owner) {
          setBest((current) => Math.max(current, result.bestScore));
        }
        if (result.submitted) {
          void Promise.allSettled([
            mutate(gamesKeys.leaderboard(id)),
            mutate(gamesKeys.leaderboard('overall')),
            mutate(gamesKeys.overview(username)),
          ]);
        }
      } catch {
        if (ownerRef.current === owner) setError(true);
      } finally {
        if (inFlight.current === key) inFlight.current = null;
        if (ownerRef.current === owner) setPending(false);
      }
    },
    [id, mutate, owner, player, username],
  );

  useEffect(() => {
    if (!username) return;
    const queued = storedScore(localStorage, pendingKey(id, player));
    if (queued > 0) void send(queued);
  }, [id, player, send, username]);

  const record = useCallback(
    (rawScore: number) => {
      if (!Number.isFinite(rawScore)) return;
      const score = Math.min(1000, Math.max(0, Math.round(rawScore)));
      const previous = storedScore(localStorage, bestKey(id, player));
      if (score <= previous) return;
      const saved = saveScore(localStorage, bestKey(id, player), score);
      setBest(score);
      if (username) void send(score);
      else if (saved) clearGuestClaim(localStorage, id);
    },
    [id, player, send, username],
  );

  const retry = useCallback(() => {
    const queued = storedScore(localStorage, pendingKey(id, player));
    if (username && queued > 0) void send(queued);
  }, [id, player, send, username]);

  return { best, pending, error, record, retry };
};
