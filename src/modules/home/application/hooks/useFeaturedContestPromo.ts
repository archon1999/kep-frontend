import { useContestScheduleStatus } from 'modules/contests/application/hooks/useContestScheduleStatus';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { useHomePromos } from '../queries';

export const useFeaturedContestPromo = () => {
  const query = useHomePromos(30_000);
  const contests = (query.data ?? []).filter((promo) => promo.contestId !== undefined);
  const ongoing = contests.find((promo) => promo.status === 'active');
  const upcoming = contests.find((promo) => promo.status === 'upcoming');
  const ongoingStatus = useContestScheduleStatus(ongoing?.startTime, ongoing?.endTime);
  const upcomingStatus = useContestScheduleStatus(upcoming?.startTime, upcoming?.endTime);

  if (ongoingStatus === ContestStatus.Already) {
    return { ...query, promo: ongoing, status: ongoingStatus };
  }

  if (upcomingStatus === ContestStatus.Already || upcomingStatus === ContestStatus.NotStarted) {
    return { ...query, promo: upcoming, status: upcomingStatus };
  }

  return { ...query, promo: undefined, status: undefined };
};
