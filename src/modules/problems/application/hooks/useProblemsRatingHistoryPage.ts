import { useMemo } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import { useProblemsRatingHistory } from 'modules/problems/application/queries';
import { ProblemsRatingHistoryType } from 'modules/problems/domain/entities/problem.entity';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';

const historyPageSize = 10;

export const useProblemsRatingHistoryPage = () => {
  const { currentUser } = useAuth();

  const { state, setField } = useRouteQueryState({
    defaults: {
      dailyPage: 1,
      weeklyPage: 1,
      monthlyPage: 1,
    },
    schema: {
      dailyPage: {
        ...numberParam({ min: 1 }),
        param: 'dailyPage',
      },
      weeklyPage: {
        ...numberParam({ min: 1 }),
        param: 'weeklyPage',
      },
      monthlyPage: {
        ...numberParam({ min: 1 }),
        param: 'monthlyPage',
      },
    },
    historyByKey: {
      dailyPage: 'push',
      weeklyPage: 'push',
      monthlyPage: 'push',
    },
  });

  const dailyParams = useMemo(
    () => ({ type: 1, page: state.dailyPage, pageSize: historyPageSize }),
    [state.dailyPage],
  );

  const weeklyParams = useMemo(
    () => ({ type: 2, page: state.weeklyPage, pageSize: historyPageSize }),
    [state.weeklyPage],
  );

  const monthlyParams = useMemo(
    () => ({ type: 3, page: state.monthlyPage, pageSize: historyPageSize }),
    [state.monthlyPage],
  );

  const dailyHistory = useProblemsRatingHistory(dailyParams);

  const weeklyHistory = useProblemsRatingHistory(weeklyParams);

  const monthlyHistory = useProblemsRatingHistory(monthlyParams);

  const dailyBestParams = useMemo(
    () => ({ type: 1, ordering: '-result', page: 1, pageSize: 1 }),
    [],
  );

  const weeklyBestParams = useMemo(
    () => ({ type: 2, ordering: '-result', page: 1, pageSize: 1 }),
    [],
  );

  const monthlyBestParams = useMemo(
    () => ({ type: 3, ordering: '-result', page: 1, pageSize: 1 }),
    [],
  );

  const dailyBest = useProblemsRatingHistory(dailyBestParams);

  const weeklyBest = useProblemsRatingHistory(weeklyBestParams);

  const monthlyBest = useProblemsRatingHistory(monthlyBestParams);

  const isLoading =
    dailyHistory.isLoading ||
    weeklyHistory.isLoading ||
    monthlyHistory.isLoading ||
    dailyHistory.isValidating ||
    weeklyHistory.isValidating ||
    monthlyHistory.isValidating ||
    dailyBest.isLoading ||
    weeklyBest.isLoading ||
    monthlyBest.isLoading ||
    dailyBest.isValidating ||
    weeklyBest.isValidating ||
    monthlyBest.isValidating;

  const handlePageChange = (type: ProblemsRatingHistoryType, page: number) => {
    if (type === 1) {
      setField('dailyPage', page);
      return;
    }

    if (type === 2) {
      setField('weeklyPage', page);
      return;
    }

    setField('monthlyPage', page);
  };
  return {
    currentUser,
    state,
    dailyHistory,
    weeklyHistory,
    monthlyHistory,
    dailyBest,
    weeklyBest,
    monthlyBest,
    isLoading,
    handlePageChange,
  };
};
