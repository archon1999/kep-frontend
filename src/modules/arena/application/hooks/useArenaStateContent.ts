import { useMemo } from 'react';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

export const useArenaStateContent = (arena?: Arena) =>
  useMemo(() => {
    const status = arena?.status ?? ArenaStatus.NotStarted;
    const isUpcoming = status === ArenaStatus.NotStarted;
    const isOngoing = status === ArenaStatus.Already;
    const isFinished = status === ArenaStatus.Finished;

    return {
      status,
      isUpcoming,
      isOngoing,
      isFinished,
      statusKey: isOngoing ? 'live' : isFinished ? 'finished' : 'upcoming',
      insightsTitleKey: isUpcoming
        ? 'arena.insights.upcomingTitle'
        : isFinished
          ? 'arena.insights.finishedTitle'
          : 'arena.insights.liveTitle',
      descriptionKey: isUpcoming
        ? 'arena.stateDescriptions.upcoming'
        : isFinished
          ? 'arena.stateDescriptions.finished'
          : 'arena.stateDescriptions.ongoing',
    };
  }, [arena?.status]);
