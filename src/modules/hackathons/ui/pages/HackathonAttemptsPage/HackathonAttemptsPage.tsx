import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Card, Pagination, Typography } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon } from 'modules/hackathons/application';
import { HackathonAsyncState, HackathonDetailLayout } from 'modules/hackathons/ui/shared';
import { useProjectAttempts } from 'modules/projects/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import HackathonAttemptsTable from './components/HackathonAttemptsTable';

const HackathonAttemptsPage = () => {
  const { id } = useParams();
  const hackathonId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const { state, setField } = useRouteQueryState({
    defaults: { page: 1 },
    schema: { page: { ...numberParam({ min: 1 }), param: 'page' } },
    historyByKey: { page: 'push' },
  });

  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);
  const { data, isLoading, error, mutate } = useProjectAttempts(undefined, {
    page: state.page,
    hackathonId,
  });
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonAttempts' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Card sx={{ borderRadius: 3 }}>
        {hackathon ? (
          <>
            <Typography component="h2" variant="subtitle1" fontWeight={700} sx={{ px: 3, pt: 3 }}>
              {t('hackathons.attempts')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ px: 3, py: 2.5 }}>
              {t('projects.attemptsTotal', { count: data?.total ?? 0 })}
            </Typography>
            {isLoading || error || !data?.data.length ? (
              <HackathonAsyncState
                isLoading={isLoading}
                error={error}
                isEmpty={!data?.data.length}
                emptyTitle={t('projects.noAttempts')}
                emptyMessage={t('projects.noAttemptsHint')}
              />
            ) : (
              <HackathonAttemptsTable
                attempts={data.data}
                onRerun={() => {
                  void mutate();
                }}
              />
            )}
            {(data?.pagesCount ?? 0) > 1 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  px: 3,
                  py: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Pagination
                  shape="rounded"
                  count={data?.pagesCount ?? 0}
                  page={state.page}
                  onChange={(_, value) => setField('page', value)}
                  disabled={isLoading}
                  color="primary"
                  size="small"
                  siblingCount={0}
                />
              </Box>
            ) : null}
          </>
        ) : (
          <HackathonAsyncState
            isLoading={isHackathonLoading}
            error={hackathonError}
            loadingHeight={180}
          />
        )}
      </Card>
    </HackathonDetailLayout>
  );
};

export default HackathonAttemptsPage;
