import { useEffect, useMemo, useState } from 'react';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

export const useArenaStandingsPage = (arena?: Arena) => {
  const shouldAutoJumpToSelf = useMemo(
    () => Boolean(arena?.isRegistrated) && arena?.status !== ArenaStatus.NotStarted,
    [arena?.isRegistrated, arena?.status],
  );
  const [page, setPage] = useState<number | undefined>(shouldAutoJumpToSelf ? undefined : 1);

  useEffect(() => {
    setPage(shouldAutoJumpToSelf ? undefined : 1);
  }, [arena?.id, arena?.status, shouldAutoJumpToSelf]);

  return {
    playersPage: page,
    setPlayersPage: (value: number) => setPage(value),
    resetPlayersPage: () => {
      if (shouldAutoJumpToSelf) {
        setPage(undefined);
      }
    },
    shouldAutoJumpToSelf,
  };
};
