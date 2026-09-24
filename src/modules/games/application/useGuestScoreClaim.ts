import { useEffect } from 'react';
import { useSWRConfig } from 'swr';
import { gameIds } from '../domain/entities/games.types.ts';
import { gamesKeys } from './keys.ts';
import { submitGameScore } from './mutations.ts';
import { flushPendingScore } from './pendingScoreSync.ts';
import { claimGuestScores, pendingKey, storedScore } from './scorePersistence.ts';

export const useGuestScoreClaim = (username?: string) => {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!username) return;
    claimGuestScores(localStorage, username);
    const pendingIds = gameIds.filter(
      (id) => storedScore(localStorage, pendingKey(id, username)) > 0,
    );
    if (!pendingIds.length) return;

    void Promise.allSettled(
      pendingIds.map((id) => flushPendingScore(id, username, submitGameScore)),
    ).then((results) => {
      const updatedIds = pendingIds.filter((_, index) => {
        const result = results[index];
        return result.status === 'fulfilled' && result.value.submitted;
      });
      if (!updatedIds.length) return;
      void Promise.allSettled([
        ...updatedIds.map((id) => mutate(gamesKeys.leaderboard(id))),
        mutate(gamesKeys.leaderboard('overall')),
        mutate(gamesKeys.overview(username)),
      ]);
    });
  }, [mutate, username]);
};
