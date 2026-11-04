import { useContest, useContestsList } from 'modules/contests/application/queries';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { useFeaturedContestPromo } from './useFeaturedContestPromo';

const latestFinishedParams = { page: 1, pageSize: 1, status: String(ContestStatus.Finished) };

export const useHomeFeaturedContest = () => {
  const {
    promo,
    isLoading: isPromoLoading,
    error: promoError,
    mutate: retryPromos,
  } = useFeaturedContestPromo();
  const featured = useContest(promo ? String(promo.contestId) : undefined, { suspense: false });
  const latest = useContestsList(!isPromoLoading && !promo ? latestFinishedParams : null);
  const contest = promo
    ? featured.data && {
        ...featured.data,
        // The detail endpoint can substitute a viewer's virtual contest times.
        startTime: promo.startTime ?? featured.data.startTime,
        finishTime: promo.endTime ?? featured.data.finishTime,
      }
    : latest.data?.data[0];

  return {
    contest,
    isLoading: isPromoLoading || (promo ? featured.isLoading : latest.isLoading),
    error: !contest && (promo ? featured.error : (latest.error ?? promoError)),
    retry: () => {
      void retryPromos();
      if (promo) void featured.mutate();
      else void latest.mutate();
    },
  };
};
