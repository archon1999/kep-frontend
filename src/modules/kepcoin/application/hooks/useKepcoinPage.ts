import {
  useKepcoinEarnHistory,
  useKepcoinSpendHistory,
  useKepcoinSummary,
} from 'modules/kepcoin/application/queries';
import { HistoryView } from 'modules/kepcoin/domain/entities/history.types';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam } from 'shared/lib/queryParams';

const PAGE_SIZE = 10;

export const useKepcoinPage = () => {
  const { state, setField } = useRouteQueryState<{
    view: HistoryView;
    page: number;
  }>({
    defaults: {
      view: 'earns',
      page: 1,
    },
    schema: {
      view: {
        ...enumParam(['earns', 'spends'] as const),
        param: 'view',
      },
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
    },
    historyByKey: {
      view: 'push',
      page: 'push',
    },
    pageResetKeys: ['view'],
  });

  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    mutate: reloadSummary,
  } = useKepcoinSummary();

  const {
    data: earnHistory,
    isLoading: isEarnHistoryLoading,
    error: earnError,
    mutate: reloadEarn,
  } = useKepcoinEarnHistory(state.page, PAGE_SIZE, state.view === 'earns');

  const {
    data: spendHistory,
    isLoading: isSpendHistoryLoading,
    error: spendError,
    mutate: reloadSpend,
  } = useKepcoinSpendHistory(state.page, PAGE_SIZE, state.view === 'spends');

  const activeHistory = state.view === 'earns' ? earnHistory : spendHistory;

  const isHistoryLoading = state.view === 'earns' ? isEarnHistoryLoading : isSpendHistoryLoading;

  const historyError = state.view === 'earns' ? earnError : spendError;

  const retryHistory = state.view === 'earns' ? reloadEarn : reloadSpend;

  const handleViewChange = (_: unknown, nextView: HistoryView | null) => {
    if (!nextView || nextView === state.view) {
      return;
    }

    setField('view', nextView);
  };

  const handlePageChange = (_: unknown, nextPage: number) => {
    setField('page', nextPage);
  };

  const historyItems = activeHistory?.items ?? [];

  const pagesCount = activeHistory?.pagesCount ?? 1;

  const handlePurchaseStreakFreeze = async () => {
    await Promise.all([reloadSummary(), reloadSpend()]);
  };
  return {
    state,
    summary,
    isSummaryLoading,
    summaryError,
    reloadSummary,
    isHistoryLoading,
    historyError,
    retryHistory,
    handleViewChange,
    handlePageChange,
    historyItems,
    pagesCount,
    handlePurchaseStreakFreeze,
  };
};
