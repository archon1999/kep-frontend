import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Card, CardContent, Pagination, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { getResourceById, resources } from 'app/routes/resources.ts';
import { useDuelsList } from 'modules/duels/application/queries.ts';
import { Duel } from 'modules/duels/domain/index.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import DuelListCard, { DuelListCardSkeleton } from './DuelListCard.tsx';

type Props = {
  scope?: 'recent' | 'my';
  title?: string;
  description?: string;
  actionSlot?: ReactNode;
  duels?: Duel[];
  total?: number;
  page?: number;
  pageSize?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
};

const DuelListSection = ({
  scope = 'recent',
  title,
  description,
  actionSlot,
  duels,
  total,
  page,
  pageSize = 8,
  loading,
  onPageChange,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageParam = scope === 'my' ? 'myPage' : 'recentPage';

  const { state, setField } = useRouteQueryState<{ page: number }>({
    defaults: {
      page: 1,
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: pageParam,
      },
    },
    historyByKey: {
      page: 'push',
    },
  });

  const resolvedPage = page ?? state.page;
  const shouldFetch = duels === undefined || total === undefined || loading === undefined;
  const {
    data: fetchedPage,
    error,
    isLoading,
  } = useDuelsList(
    shouldFetch
      ? {
          my: scope === 'my',
          page: resolvedPage,
          pageSize,
        }
      : undefined,
  );

  const resolvedDuels = duels ?? fetchedPage?.data ?? [];
  const resolvedTotal = total ?? fetchedPage?.total ?? 0;
  const resolvedLoading = loading ?? (isLoading && !fetchedPage);
  const resolvedTitle =
    title ?? (scope === 'my' ? t('duels.myDuelsSection') : t('duels.recentDuelsSection'));
  const resolvedDescription = description;
  const pageCount = Math.max(1, Math.ceil((resolvedTotal || 0) / pageSize));

  const handlePageChange = (value: number) => {
    if (onPageChange) {
      onPageChange(value);
      return;
    }
    setField('page', value);
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        flexWrap="wrap"
        useFlexGap
      >
        <Stack spacing={0.4}>
          <Typography variant="h6" fontWeight={800}>
            {resolvedTitle}
            {resolvedTotal ? (
              <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
                ({resolvedTotal})
              </Typography>
            ) : null}
          </Typography>
          {resolvedDescription ? (
            <Typography variant="body2" color="text.secondary">
              {resolvedDescription}
            </Typography>
          ) : null}
        </Stack>

        {actionSlot}
      </Stack>

      <Stack spacing={2}>
        {resolvedLoading
          ? Array.from({ length: 3 }).map((_, index) => <DuelListCardSkeleton key={index} />)
          : null}

        {!resolvedLoading && error ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="error.main">
                {t('duels.error')}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {!resolvedLoading && !error && !resolvedDuels.length ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('duels.noDuels')}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {!resolvedLoading &&
          !error &&
          resolvedDuels.map((duel) => (
            <DuelListCard
              key={duel.id}
              duel={duel}
              onView={() => navigate(getResourceById(resources.Duel, duel.id))}
            />
          ))}
      </Stack>

      {pageCount > 1 ? (
        <Grid container justifyContent="flex-end">
          <Pagination
            count={pageCount}
            page={resolvedPage}
            onChange={(_, value) => handlePageChange(value)}
            color="primary"
            shape="rounded"
          />
        </Grid>
      ) : null}
    </Stack>
  );
};

export default DuelListSection;
