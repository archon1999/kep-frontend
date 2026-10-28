import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Box, Grid, Stack } from '@mui/material';
import { useProblemsListPage } from 'modules/problems/application/hooks/useProblemsListPage';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import ProblemDifficultiesCard from './components/ProblemDifficultiesCard.tsx';
import ProblemList from './components/ProblemList.tsx';
import ProblemStudyPlansShowcase from './components/ProblemStudyPlansShowcase.tsx';
import ProblemTabsCard from './components/ProblemTabsCard.tsx';
import ProblemsFilterDrawer from './components/ProblemsFilterDrawer.tsx';
import ProblemsListFilterBar from './components/ProblemsListFilterBar';
import ProblemsListHeaderActions from './components/ProblemsListHeaderActions';
import ProblemStudyPlanAdvisorDialog from './dialogs/ProblemStudyPlanAdvisorDialog.tsx';

const filterDrawerWidth = DEFAULT_FILTER_DRAWER_WIDTH;
const ProblemsListPage = () => {
  const { t } = useTranslation();
  const filterDrawer = useFilterDrawer();
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('recommend') !== '1') return;
    setIsAdvisorOpen(true);
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete('recommend');
        return next;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams]);
  const {
    filter,
    activeTab,
    handleFilterChange,
    handleFilterPatch,
    handlePageChange,
    handleTabChange,
    handleAdvisorApply,
    isAuthenticated,
    problems,
    total,
    isProblemsLoading,
    languages,
    categories,
    groups,
    studyPlans,
    isStudyPlansLoading,
    studyPlansError,
    retryStudyPlans,
    rating,
    isSummaryLoading,
    summaryError,
    retrySummary,
    attempts,
    isAttemptsLoading,
    attemptsError,
    retryAttempts,
    lastContest,
    isLastContestLoading,
    lastContestError,
    retryLastContest,
    mostViewed,
    isMostViewedLoading,
    mostViewedError,
    retryMostViewed,
  } = useProblemsListPage();
  return (
    <FilterDrawerLayout
      anchorEl={filterDrawer.anchorEl}
      open={filterDrawer.open}
      drawerWidth={filterDrawerWidth}
      drawer={
        <ProblemsFilterDrawer
          open={filterDrawer.open}
          handleClose={filterDrawer.close}
          drawerWidth={filterDrawerWidth}
          languages={languages ?? []}
          categories={categories ?? []}
          groups={groups ?? []}
          filter={filter}
          onChange={handleFilterChange}
          onPatch={handleFilterPatch}
        />
      }
    >
      <Stack direction="column" spacing={0}>
        <PageHeader
          title={t('problems.title2')}
          actionComponent={<ProblemsListHeaderActions isAuthenticated={isAuthenticated} />}
        />

        <Box sx={{ minWidth: 0 }}>
          <Grid container spacing={0}>
            <Grid size={12}>
              <ProblemsListFilterBar
                languages={languages ?? []}
                categories={categories ?? []}
                groups={groups ?? []}
                filter={filter}
                filtersOpen={filterDrawer.open}
                onToggleFilters={filterDrawer.toggle}
                onChange={handleFilterChange}
                onPatch={handleFilterPatch}
                onOpenAdvisor={() => setIsAdvisorOpen(true)}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 8 }}
              sx={{ borderRight: { md: '1px solid var(--kep-line)' } }}
            >
              <Stack direction="column" spacing={0}>
                <ProblemList
                  problems={problems}
                  isLoading={isProblemsLoading}
                  filter={filter}
                  total={total}
                  onPageChange={handlePageChange}
                />
              </Stack>
            </Grid>

            <Grid
              component="aside"
              size={{ xs: 12, md: 4 }}
              sx={{ minWidth: 0, borderTop: { xs: '1px solid var(--kep-line)', md: 0 } }}
            >
              <Stack direction="column" spacing={0}>
                {isAuthenticated && (
                  <ProblemDifficultiesCard
                    difficulties={rating?.difficulties}
                    isLoading={isSummaryLoading}
                    error={summaryError}
                    onRetry={() => void retrySummary()}
                    selectedDifficulty={filter.difficulty}
                    onSelectDifficulty={(value) => handleFilterChange('difficulty', value)}
                  />
                )}

                {isAuthenticated && (
                  <ProblemStudyPlansShowcase
                    studyPlans={studyPlans ?? []}
                    isLoading={isStudyPlansLoading}
                    error={studyPlansError}
                    onRetry={() => void retryStudyPlans()}
                  />
                )}

                <ProblemTabsCard
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  attempts={{
                    isLoading: isAttemptsLoading,
                    items: attempts ?? [],
                    error: attemptsError,
                    onRetry: () => void retryAttempts(),
                  }}
                  lastContest={{
                    isLoading: isLastContestLoading,
                    data: lastContest,
                    error: lastContestError,
                    onRetry: () => void retryLastContest(),
                  }}
                  mostViewed={{
                    isLoading: isMostViewedLoading,
                    items: mostViewed ?? [],
                    error: mostViewedError,
                    onRetry: () => void retryMostViewed(),
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <ProblemStudyPlanAdvisorDialog
          open={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
          studyPlans={studyPlans ?? []}
          currentFilters={filter}
          onApplyFilters={handleAdvisorApply}
        />
      </Stack>
    </FilterDrawerLayout>
  );
};

export default ProblemsListPage;
