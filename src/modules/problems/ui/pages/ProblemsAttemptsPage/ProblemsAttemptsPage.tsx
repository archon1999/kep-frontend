import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useProblemsAttemptsPage } from 'modules/problems/application/hooks/useProblemsAttemptsPage';
import ProblemsAttemptsTable from 'modules/problems/ui/shared/components/ProblemsAttemptsTable.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import FilterButton from 'shared/components/common/FilterButton';
import {
  DEFAULT_FILTER_DRAWER_WIDTH,
  FilterDrawerLayout,
  useFilterDrawer,
} from 'shared/components/common/FilterDrawer';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ProblemsAttemptsFilterDrawer from './components/ProblemsAttemptsFilterDrawer.tsx';

const filterDrawerWidth = DEFAULT_FILTER_DRAWER_WIDTH;
const ProblemsAttemptsPage = () => {
  const { t } = useTranslation();
  const filterDrawer = useFilterDrawer();
  const {
    filter,
    languages,
    verdictOptions,
    problemOptions,
    userOptions,
    selectedProblem,
    selectedUser,
    testCaseNumberInput,
    hasActiveFilters,
    handleFilterChange,
    setTestCaseNumberInput,
    handleReset,
    setSelectedProblemOption,
    setProblemInput,
    setUserInput,
    isOnlyMyAttempts,
    onOnlyMineChange,
    mutate,
    activeFilterCount,
    attempts,
    total,
    paginationModel,
    onPaginationModelChange,
    isLoading,
    isFiltered,
  } = useProblemsAttemptsPage();
  return (
    <FilterDrawerLayout
      anchorEl={filterDrawer.anchorEl}
      open={filterDrawer.open}
      drawerWidth={filterDrawerWidth}
      drawer={
        <ProblemsAttemptsFilterDrawer
          open={filterDrawer.open}
          handleClose={filterDrawer.close}
          drawerWidth={filterDrawerWidth}
          filter={filter}
          languages={languages ?? []}
          verdictOptions={verdictOptions ?? []}
          problemOptions={problemOptions}
          userOptions={userOptions}
          selectedProblem={selectedProblem}
          selectedUser={selectedUser}
          testCaseNumberInput={testCaseNumberInput}
          hasActiveFilters={hasActiveFilters}
          onChange={handleFilterChange}
          onTestCaseNumberInputChange={setTestCaseNumberInput}
          onClear={handleReset}
          setSelectedProblemOption={setSelectedProblemOption}
          setProblemInput={setProblemInput}
          setUserInput={setUserInput}
        />
      }
    >
      <Stack direction="column" spacing={0}>
        <PageHeader
          title={t('problems.attempts.title')}
          backTo={resources.Problems}
          actionComponent={
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ width: { xs: 1, sm: 'auto' } }}
            >
              <OnlyMeSwitch
                label={t('problems.attempts.onlyMy')}
                checked={isOnlyMyAttempts}
                sx={{ width: { xs: 1, sm: 'auto' } }}
                onChange={(_, checked) => onOnlyMineChange(checked)}
              />

              <Stack direction="row" spacing={1} sx={{ width: { xs: 1, sm: 'auto' } }}>
                <Tooltip title={t('problems.attempts.refresh')}>
                  <Button
                    variant="soft"
                    color="neutral"
                    onClick={() => mutate()}
                    aria-label={t('problems.attempts.refresh')}
                    sx={{ minWidth: 44, px: 1.25, flexShrink: 0 }}
                  >
                    <IconifyIcon icon="mdi:reload" width={18} height={18} />
                  </Button>
                </Tooltip>
                <FilterButton
                  id="attempts-filters-button"
                  onClick={filterDrawer.toggle}
                  aria-haspopup="true"
                  aria-expanded={filterDrawer.open ? 'true' : undefined}
                  aria-controls={filterDrawer.open ? 'attempts-filters-drawer' : undefined}
                  label={t('problems.filterTitle')}
                  badgeContent={activeFilterCount}
                  containerSx={{ flex: { xs: 1, sm: '0 0 auto' } }}
                  sx={{ width: { xs: 1, sm: 'auto' } }}
                />
              </Stack>
            </Stack>
          }
        />

        <Box sx={{ minWidth: 0 }}>
          <ProblemsAttemptsTable
            surface="section"
            paginationStyle="list"
            attempts={attempts}
            total={total}
            paginationModel={paginationModel}
            onPaginationChange={onPaginationModelChange}
            isLoading={isLoading}
            onRerun={() => mutate()}
            isFiltered={isFiltered}
          />
        </Box>
      </Stack>
    </FilterDrawerLayout>
  );
};

export default ProblemsAttemptsPage;
