import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Grid, Stack } from '@mui/material';
import {
  useKepcoinEarnHistory,
  useKepcoinSpendHistory,
  useKepcoinSummary,
  useTaskCategories,
} from '../../application/queries';
import { HistoryView } from '../types';
import { useAuth } from 'app/providers/AuthProvider';
import HowToEarnWidget from '../widgets/HowToEarnWidget';
import HowToSpendWidget from '../widgets/HowToSpendWidget';
import KepcoinActivityWidget from '../widgets/KepcoinActivityWidget';
import TaskCategoriesWidget from '../widgets/TaskCategoriesWidget';
import TaskActionDialog from '../components/TaskActionDialog';
import StreakWidget from '../widgets/StreakWidget';
import type { OneTimeTask } from '../../domain/entities/kepcoin.entity';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';

const PAGE_SIZE = 10;

const KepcoinPage = () => {
  const [view, setView] = useState<HistoryView>('earns');
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, refreshCurrentUser } = useAuth();
  const canViewOneTimeTasks = Boolean(currentUser?.isSuperuser);

  const { data: summary, isLoading: isSummaryLoading, mutate: reloadSummary } = useKepcoinSummary();
  const {
    data: taskCategoriesResponse,
    isLoading: isTasksLoading,
    mutate: reloadTasks,
  } = useTaskCategories(canViewOneTimeTasks);
  const {
    data: earnHistory,
    isLoading: isEarnHistoryLoading,
    error: earnError,
    mutate: reloadEarn,
  } = useKepcoinEarnHistory(page, PAGE_SIZE, view === 'earns');
  const {
    data: spendHistory,
    isLoading: isSpendHistoryLoading,
    error: spendError,
    mutate: reloadSpend,
  } = useKepcoinSpendHistory(page, PAGE_SIZE, view === 'spends');

  const activeHistory = view === 'earns' ? earnHistory : spendHistory;
  const isHistoryLoading = view === 'earns' ? isEarnHistoryLoading : isSpendHistoryLoading;
  const historyError = view === 'earns' ? earnError : spendError;
  const retryHistory = view === 'earns' ? reloadEarn : reloadSpend;
  const taskCategories = taskCategoriesResponse?.categories ?? [];
  const openTaskSlug = searchParams.get('openTask');
  const allTasks = useMemo(() => taskCategories.flatMap((category) => category.tasks), [taskCategories]);
  const selectedTask = useMemo(
    () => (canViewOneTimeTasks ? allTasks.find((task) => task.slug === openTaskSlug) ?? null : null),
    [allTasks, canViewOneTimeTasks, openTaskSlug],
  );

  useEffect(() => {
    if ((!canViewOneTimeTasks && openTaskSlug) || (openTaskSlug && allTasks.length > 0 && !selectedTask)) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('openTask');
        return next;
      });
    }
  }, [allTasks.length, canViewOneTimeTasks, openTaskSlug, selectedTask, setSearchParams]);

  const handleViewChange = (_: unknown, nextView: HistoryView | null) => {
    if (!nextView || nextView === view) {
      return;
    }

    setView(nextView);
    setPage(1);
  };

  const handlePageChange = (_: unknown, nextPage: number) => {
    setPage(nextPage);
  };

  const historyItems = activeHistory?.items ?? [];
  const pagesCount = activeHistory?.pagesCount ?? 1;

  const handlePurchaseStreakFreeze = async () => {
    await Promise.all([reloadSummary(), reloadSpend()]);
  };

  const handleOpenTask = (task: OneTimeTask) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('openTask', task.slug);
      return next;
    });
  };

  const handleCloseTask = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('openTask');
      return next;
    });
  };

  const handleTaskCompleted = async () => {
    const reloads: Array<Promise<unknown>> = [reloadSummary(), refreshCurrentUser()];
    if (canViewOneTimeTasks) {
      reloads.push(reloadTasks());
    }
    if (view === 'earns') {
      reloads.push(reloadEarn());
    }
    await Promise.all(reloads);
  };

  return (
    <>
      <Grid sx={responsivePagePaddingSx} size={12} container spacing={3}>
        <Grid size={{ sm: 12, lg: 6 }}>
          <Stack direction="column" spacing={3}>
            <StreakWidget
              balance={summary?.balance}
              streak={summary?.streak}
              maxStreak={summary?.maxStreak}
              streakFreeze={summary?.streakFreeze}
              isLoading={isSummaryLoading}
              onPurchaseStreakFreeze={handlePurchaseStreakFreeze}
            />

            <KepcoinActivityWidget
              view={view}
              onViewChange={handleViewChange}
              isLoading={isHistoryLoading}
              error={historyError}
              historyItems={historyItems}
              pagesCount={pagesCount}
              page={page}
              onPageChange={handlePageChange}
              onRetry={retryHistory}
            />
          </Stack>
        </Grid>

        <Grid size={{ sm: 12, lg: 6 }}>
          <Stack direction="column" spacing={3}>
            {canViewOneTimeTasks ? (
              <TaskCategoriesWidget
                categories={taskCategories}
                isLoading={isTasksLoading}
                onOpenTask={handleOpenTask}
              />
            ) : null}
            <HowToEarnWidget />
            <HowToSpendWidget />
          </Stack>
        </Grid>
      </Grid>

      {canViewOneTimeTasks ? (
        <TaskActionDialog
          open={Boolean(selectedTask)}
          task={selectedTask}
          onClose={handleCloseTask}
          onCompleted={handleTaskCompleted}
        />
      ) : null}
    </>
  );
};

export default KepcoinPage;
