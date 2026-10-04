import { useTranslation } from 'react-i18next';
import { Box, Grid, Pagination, Paper, Stack, Typography } from '@mui/material';
import { useHackathonsList } from 'modules/hackathons/application';
import { HackathonAsyncState } from 'modules/hackathons/ui/shared';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import HackathonCard from './components/HackathonCard';

const HackathonsListPage = () => {
  const { t } = useTranslation();
  const { state, setField } = useRouteQueryState({
    defaults: { page: 1 },
    schema: { page: { ...numberParam({ min: 1 }), param: 'page' } },
    historyByKey: { page: 'push' },
  });
  const {
    data: pageResult,
    isLoading,
    error,
  } = useHackathonsList({ page: state.page, pageSize: 12 });
  const hackathons = pageResult?.data ?? [];

  return (
    <Paper sx={{ minHeight: '100%', p: { xs: 2.5, md: 5 }, borderRadius: 0 }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Stack direction="column" spacing={4}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Typography component="h1" variant="h4">
              {t('menu.hackathons')}
            </Typography>
            {pageResult && !error ? (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {t('hackathons.countLabel', { count: pageResult.total })}
              </Typography>
            ) : null}
          </Stack>

          <HackathonAsyncState
            isLoading={isLoading}
            error={error}
            isEmpty={hackathons.length === 0}
            emptyMessage={t('hackathons.emptySubtitle')}
            loadingHeight={220}
          />
          {!error && !isLoading ? (
            <Grid container spacing={3}>
              {hackathons.map((hackathon) => (
                <Grid key={hackathon.id} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ minWidth: 0 }}>
                  <HackathonCard hackathon={hackathon} />
                </Grid>
              ))}
            </Grid>
          ) : null}
          {(pageResult?.pagesCount ?? 0) > 1 ? (
            <Pagination
              page={state.page}
              count={pageResult!.pagesCount}
              onChange={(_, page) => setField('page', page)}
              sx={{ alignSelf: 'center' }}
            />
          ) : null}
        </Stack>
      </Box>
    </Paper>
  );
};

export default HackathonsListPage;
