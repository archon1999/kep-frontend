import { useAuth } from 'app/providers/AuthProvider';
import {
  useChallengeUserStatistics,
  useUserChallenges,
} from 'modules/challenges/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';

export const useChallengesUserStatisticsPage = () => {
  const { currentUser, isAuthLoading } = useAuth();

  const username = currentUser?.username;

  const { state, setField } = useRouteQueryState<{ page: number; selectedYear?: number }>({
    defaults: { page: 1, selectedYear: undefined },
    schema: {
      page: numberParam({ min: 1 }),
      selectedYear: { ...numberParam({ min: 1, max: 9999 }), param: 'year' },
    },
    historyByKey: { page: 'push' },
  });

  const statisticsQuery = useChallengeUserStatistics(username);

  const historyQuery = useUserChallenges({ username, page: state.page, pageSize: 6 });

  const statistics = statisticsQuery.data;

  const loading = isAuthLoading || statisticsQuery.isLoading;

  const hasChallenges = statistics?.general
    ? statistics.general.totalChallenges > 0
    : Boolean(statistics?.ratingHistory.length);
  return {
    currentUser,
    state,
    setField,
    statisticsQuery,
    historyQuery,
    username,
    statistics,
    loading,
    hasChallenges,
  };
};
