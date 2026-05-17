import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  LinearProgress,
  Stack,
} from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid';
import { resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useGridPagination from 'shared/hooks/useGridPagination';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { stringParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useProblemsRating } from 'modules/problems/application/queries';
import { difficultyOptions } from 'modules/problems/config/difficulty';
import ProblemsRatingDataGrid from 'modules/problems/ui/shared/components/ProblemsRatingDataGrid';
import ProblemsRatingPagePeriodRatings from './ProblemsRatingPagePeriodRatings.tsx';

const sortFieldMap: Record<string, string> = {
  rating: 'rating',
  solved: 'solved',
  beginner: 'beginner',
  basic: 'basic',
  normal: 'normal',
  medium: 'medium',
  advanced: 'advanced',
  hard: 'hard',
  extremal: 'extremal',
};

const orderingFieldMap = Object.fromEntries(
  Object.entries(sortFieldMap).map(([field, ordering]) => [ordering, field]),
) as Record<string, string>;

const ProblemsRatingPage = () => {
  const { t } = useTranslation();

  const {
    paginationModel,
    onPaginationModelChange,
    pageParams: { page, pageSize },
  } = useGridPagination({
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });
  const { state, setField } = useRouteQueryState({
    defaults: {
      ordering: '-rating',
    },
    schema: {
      ordering: {
        ...stringParam(),
        param: 'ordering',
      },
    },
  });

  const sortModel = useMemo<GridSortModel>(() => {
    const normalizedOrdering = state.ordering || '-rating';
    const isDescending = normalizedOrdering.startsWith('-');
    const orderingField = isDescending ? normalizedOrdering.slice(1) : normalizedOrdering;
    const field = orderingFieldMap[orderingField] ?? 'rating';

    return [{ field, sort: isDescending ? 'desc' : 'asc' }];
  }, [state.ordering]);

  const ordering = state.ordering || '-rating';

  const {
    data: ratingPage,
    isLoading,
    isValidating,
  } = useProblemsRating({
    ordering,
    page,
    pageSize,
  });

  const rows = ratingPage?.data ?? [];
  const rowCount = ratingPage?.total ?? 0;

  const handleSortModelChange = (model: GridSortModel) => {
    const currentSort = model[0];

    if (!currentSort) {
      setField('ordering', '-rating');
      return;
    }

    const orderingField = sortFieldMap[currentSort.field] ?? currentSort.field;
    const orderingPrefix = currentSort.sort === 'desc' ? '-' : '';

    setField('ordering', `${orderingPrefix}${orderingField}`);
  };

  const labels = useMemo(
    () => ({
      rank: t('problems.rating.columns.rank'),
      user: t('problems.rating.columns.user'),
      rating: t('problems.rating.columns.rating'),
      solved: t('problems.rating.columns.solved'),
      difficulties: Object.fromEntries(
        difficultyOptions.map((option) => [option.key, t(option.label)]),
      ) as Record<(typeof difficultyOptions)[number]['key'], string>,
      emptyValue: t('problems.rating.emptyValue'),
    }),
    [t],
  );

  return (
    <Stack direction="column">
      <PageHeader
        title={t('problems.rating.title')}
        breadcrumb={[
          { label: t('problems.title'), url: resources.Problems },
          { label: t('problems.rating.ordering.rating'), active: true },
        ]}
        actionComponent={
          <Button
            component={RouterLink}
            to={resources.ProblemsRatingHistory}
            variant="text"
            startIcon={<KepIcon name="ranking" fontSize={18} />}
          >
            {t('problems.ratingHistory.title')}
          </Button>
        }
      />

      {isLoading || isValidating ? <LinearProgress /> : null}
      <Stack direction="column" spacing={2} sx={responsivePagePaddingSx}>
        <ProblemsRatingDataGrid
          rows={rows}
          rowCount={rowCount}
          loading={isLoading || isValidating}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          labels={labels}
        />

        <ProblemsRatingPagePeriodRatings />
      </Stack>
    </Stack>
  );
};

export default ProblemsRatingPage;
