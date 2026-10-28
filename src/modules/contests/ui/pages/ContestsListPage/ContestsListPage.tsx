import { useState } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import {
  DEFAULT_PAGE_SIZE,
  useContestsListPage,
} from 'modules/contests/application/hooks/useContestsListPage';
import { ContestsListRoot } from './ContestsListPage.styles';
import ContestsListPageHeroCard from './ContestsListPageHeroCard.tsx';
import ContestsListPageResults from './ContestsListPageResults.tsx';
import ContestsListTopRatingCard from './ContestsListTopRatingCard.tsx';
import ContestsListFilterMenu from './components/ContestsListFilterMenu';

const contestTypes = [
  'ACM2H',
  'ACM10M',
  'ACM20M',
  'IOI',
  'Ball525',
  'Ball550',
  'LessCode',
  'LessLine',
  'OneAttempt',
  'IQ',
  'Ball',
  'CTF',
  'DC',
  'MultiL',
  'CodeGolf',
  'Exam',
] as const;

const ContestsListPage = () => {
  const {
    categories,
    currentUser,
    state,
    setField,
    pageResult,
    isLoading,
    error,
    mutate,
    contests,
    totalContestsCount,
    activeFilters,
    handleClearFilters,
    handleCategory,
    handleTypeChange,
  } = useContestsListPage();

  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const { topbarHeight } = useNavContext();

  return (
    <ContestsListRoot
      sx={(theme) => ({ height: theme.mixins.contentHeight(topbarHeight), overflowY: 'auto' })}
    >
      <ContestsListFilterMenu
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        title={state.title}
        category={state.category}
        type={state.type}
        participation={state.participation}
        categories={categories}
        contestTypes={contestTypes}
        totalContestsCount={totalContestsCount}
        onClear={handleClearFilters}
        hasActiveFilters={activeFilters.length > 0}
        onTitleChange={(value) => setField('title', value)}
        onCategoryChange={handleCategory}
        onTypeChange={handleTypeChange}
        onParticipationChange={(value) => setField('participation', value)}
      />
      <Box className="contests-list-page">
        <ContestsListPageHeroCard
          canViewMyStats={Boolean(currentUser)}
          filtersOpen={Boolean(filterAnchor)}
          activeFilters={activeFilters}
          onClearFilters={handleClearFilters}
          onToggleFilters={(event) => setFilterAnchor(filterAnchor ? null : event.currentTarget)}
        />

        <Stack direction="column" spacing={0} className="contests-list-content">
          <Grid container spacing={0} alignItems="stretch">
            <Grid
              size={{ xs: 12, lg: 8 }}
              sx={{ borderRight: { lg: '1px solid var(--kep-line)' } }}
            >
              <ContestsListPageResults
                contests={contests}
                isLoading={isLoading}
                hasError={Boolean(error)}
                hasActiveFilters={activeFilters.length > 0}
                onClearFilters={handleClearFilters}
                onRetry={() => void mutate()}
                page={state.page}
                pagesCount={pageResult?.pagesCount ?? 0}
                skeletonCount={DEFAULT_PAGE_SIZE}
                onPageChange={(value) => setField('page', value)}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <ContestsListTopRatingCard />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </ContestsListRoot>
  );
};

export default ContestsListPage;
