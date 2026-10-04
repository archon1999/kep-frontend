import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Container, Link, Paper, Stack } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { startTest } from 'modules/testing/application/mutations';
import { useTestDetail, useTestResults } from 'modules/testing/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import TestDetailHeader from './components/TestDetailHeader';
import TestDetailSkeleton from './components/TestDetailSkeleton';
import TestResults from './components/TestResults';
import TestStartPanel from './components/TestStartPanel';

const TestDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: test, error, isLoading, mutate } = useTestDetail(id);
  const {
    data: results,
    error: resultsError,
    isLoading: isResultsLoading,
    mutate: refreshResults,
  } = useTestResults(id);
  const [canStart, setCanStart] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useDocumentTitle(
    test ? 'pageTitles.test' : undefined,
    test ? { testTitle: test.title ?? '' } : undefined,
  );

  useEffect(() => {
    setCanStart(Boolean(test?.canStart));
  }, [test?.id, test?.canStart]);

  const handleStart = async () => {
    if (!test || isStarting) return;

    setIsStarting(true);
    try {
      const response = await startTest(test.id);
      if (response.success && response.testPassId) {
        navigate(getResourceById(resources.TestPass, response.testPassId));
        return;
      }
      toast.error(t('tests.startError'));
    } catch {
      toast.error(t('tests.startError'));
    } finally {
      setIsStarting(false);
    }
  };

  const questionsCount = test?.questionsCount ?? test?.questions?.length ?? 0;

  return (
    <Paper
      variant="elevation"
      elevation={0}
      square
      sx={{ ...responsivePagePaddingSx, outline: 0, minHeight: 1, bgcolor: 'background.paper' }}
    >
      <Container maxWidth="lg" disableGutters>
        <Stack direction="column" spacing={3}>
          <Link
            component={RouterLink}
            to={
              test?.chapter.id
                ? `${resources.Tests}?${new URLSearchParams({ chapter: String(test.chapter.id) })}`
                : resources.Tests
            }
            underline="hover"
            color="text.secondary"
            variant="body2"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, alignSelf: 'flex-start' }}
          >
            <IconifyIcon icon="material-symbols:arrow-back-rounded" fontSize={18} />
            {t(test?.chapter.id ? 'tests.backToChapter' : 'tests.backToList')}
          </Link>

          {isLoading ? (
            <TestDetailSkeleton />
          ) : error || !test ? (
            <Alert
              severity="error"
              action={<Button onClick={() => mutate()}>{t('tests.retry')}</Button>}
            >
              {t('tests.detailLoadError')}
            </Alert>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  md: 'minmax(0, 1fr) 280px',
                  lg: 'minmax(0, 1fr) 300px',
                },
                gridTemplateAreas: {
                  xs: '"header" "start" "results"',
                  md: '"header start" "results start"',
                },
                columnGap: { md: 3, lg: 4 },
                rowGap: 3,
                alignItems: 'start',
              }}
            >
              <Box sx={{ gridArea: 'header', minWidth: 0 }}>
                <TestDetailHeader test={test} questionsCount={questionsCount} />
              </Box>

              <Box component="aside" sx={{ gridArea: 'start', minWidth: 0 }}>
                <TestStartPanel
                  test={test}
                  questionsCount={questionsCount}
                  canStart={canStart}
                  isStarting={isStarting}
                  onStart={handleStart}
                  onPurchase={() => setCanStart(true)}
                />
              </Box>

              <Box sx={{ gridArea: 'results', minWidth: 0 }}>
                <TestResults
                  key={test.id}
                  bestResults={results?.bestResults ?? []}
                  recentResults={results?.lastResults ?? []}
                  questionsCount={questionsCount}
                  loading={isResultsLoading}
                  error={Boolean(resultsError)}
                  onRetry={() => refreshResults()}
                />
              </Box>
            </Box>
          )}
        </Stack>
      </Container>
    </Paper>
  );
};

export default TestDetailPage;
