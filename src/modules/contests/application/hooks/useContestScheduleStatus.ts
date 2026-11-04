import { useEffect, useReducer } from 'react';
import { ContestStatus, getContestScheduleStatus } from '../../domain/entities/contest-status';

export const useContestScheduleStatus = (startTime?: string | null, finishTime?: string | null) => {
  const [, refresh] = useReducer((revision: number) => revision + 1, 0);
  const status = getContestScheduleStatus(startTime, finishTime);
  const boundary =
    status === ContestStatus.NotStarted
      ? Date.parse(startTime!)
      : status === ContestStatus.Already
        ? Date.parse(finishTime!)
        : undefined;

  useEffect(() => {
    if (boundary === undefined) return;
    let timer: number | undefined;
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          if (Date.now() < boundary) schedule();
          else refresh();
        },
        Math.min(Math.max(boundary - Date.now(), 0), 2_147_483_647),
      );
    };

    schedule();
    return () => window.clearTimeout(timer);
  }, [boundary]);

  return status;
};
