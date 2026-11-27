import { useEffect } from 'react';
import { useContestScheduleStatus } from 'modules/contests/application/hooks/useContestScheduleStatus';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { useHomePromos } from '../queries';

export const useFeaturedContestPromo = ({ revalidateOnUpcomingStart = false } = {}) => {
  const query = useHomePromos(30_000);
  const contests = (query.data ?? []).filter((promo) => promo.contestId !== undefined);
  const ongoing = contests.find((promo) => promo.status === 'active');
  const upcoming = contests.find((promo) => promo.status === 'upcoming');
  const ongoingStatus = useContestScheduleStatus(ongoing?.startTime, ongoing?.endTime);
  const upcomingStatus = useContestScheduleStatus(upcoming?.startTime, upcoming?.endTime);

  const { mutate } = query;
  const startedContestId =
    upcomingStatus === ContestStatus.Already || upcomingStatus === ContestStatus.Finished
      ? upcoming?.contestId
      : undefined;

  useEffect(() => {
    if (revalidateOnUpcomingStart && startedContestId !== undefined) {
      void mutate().catch(() => undefined);
    }
  }, [mutate, revalidateOnUpcomingStart, startedContestId]);

  const nextContest = upcomingStatus === ContestStatus.NotStarted ? upcoming : undefined;
  const result = { ...query, nextContest };

  if (ongoingStatus === ContestStatus.Already) {
    return { ...result, promo: ongoing, status: ongoingStatus };
  }

  if (upcomingStatus === ContestStatus.Already || upcomingStatus === ContestStatus.NotStarted) {
    return { ...result, promo: upcoming, status: upcomingStatus };
  }

  return { ...result, promo: undefined, status: undefined };
};
