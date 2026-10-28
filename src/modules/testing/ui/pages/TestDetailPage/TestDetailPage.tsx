import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useTestDetailPage } from 'modules/testing/application/hooks/useTestDetailPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import TestDetailHeader from './components/TestDetailHeader';
import TestDetailSkeleton from './components/TestDetailSkeleton';
import TestResults from './components/TestResults';
import TestStartPanel from './components/TestStartPanel';

const TestDetailPage = () => {
  const {
    test,
    error,
    isLoading,
    mutate,
    results,
    resultsError,
    isResultsLoading,
    refreshResults,
    handleStart,
    isStarting,
    questionsCount,
    canStart,
    setCanStart,
  } = useTestDetailPage();

  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader
        variant="detail"
        title={test?.title ?? t('tests.title')}
        backTo={
          test?.chapter.id
            ? `${resources.Tests}?${new URLSearchParams({ chapter: String(test.chapter.id) })}`
            : resources.Tests
        }
      />
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="column" spacing={0}>
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
                  md: 'minmax(0, 1fr) 320px',
                },
                gridTemplateAreas: {
                  xs: '"header" "start" "results"',
                  md: '"header start" "results start"',
                },
                columnGap: 0,
                rowGap: 0,
                alignItems: 'start',
              }}
            >
              <Box sx={{ gridArea: 'header', minWidth: 0 }}>
                <TestDetailHeader test={test} questionsCount={questionsCount} />
              </Box>

              <Box
                component="aside"
                sx={{
                  gridArea: 'start',
                  minWidth: 0,
                  alignSelf: 'stretch',
                  borderInlineStart: { md: '1px solid var(--kep-line)' },
                  borderBottom: { xs: '1px solid var(--kep-line)', md: 0 },
                }}
              >
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
      </Box>
    </FramedPage>
  );
};

export default TestDetailPage;
