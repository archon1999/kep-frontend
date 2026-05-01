import { useMemo } from 'react';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

export const useArenaStandingsPage = (arena?: Arena) => {
  const shouldAutoJumpToSelf = useMemo(
    () => Boolean(arena?.isRegistrated) && arena?.status !== ArenaStatus.NotStarted,
    [arena?.isRegistrated, arena?.status],
  );
  const { state, setField } = useRouteQueryState({
    defaults: {
      playersPage: shouldAutoJumpToSelf ? undefined : 1,
    },
    schema: {
      playersPage: {
        ...numberParam({ min: 1 }),
        param: 'playersPage',
      },
    },
    historyByKey: {
      playersPage: 'push',
    },
  });

  return {
    playersPage: state.playersPage,
    setPlayersPage: (value: number) => setField('playersPage', value),
    resetPlayersPage: () => {
      if (shouldAutoJumpToSelf) {
        setField('playersPage', undefined);
      }
    },
    shouldAutoJumpToSelf,
  };
};
