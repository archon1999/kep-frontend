import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Tab, Tabs } from '@mui/material';
import { TestResultRow } from 'modules/testing/domain/contracts/testing.repository';
import TestResultsTable from './TestResultsTable';

interface TestResultsProps {
  bestResults: TestResultRow[];
  recentResults: TestResultRow[];
  questionsCount: number;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

const TestResults = ({
  bestResults,
  recentResults,
  questionsCount,
  loading,
  error,
  onRetry,
}: TestResultsProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'best' | 'recent'>('best');
  const id = useId();

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, value: 'best' | 'recent') => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label={t('tests.resultsColumns.score')}
        sx={{
          borderBottom: '1px solid var(--kep-line)',
          px: 'var(--kep-content-inset)',
          '& .MuiTab-root': { fontFamily: 'var(--kep-display-font)', fontWeight: 500 },
        }}
      >
        <Tab
          label={t('tests.bestAttempts')}
          value="best"
          id={`${id}-best`}
          aria-controls={`${id}-panel`}
        />
        <Tab
          label={t('tests.recentResults')}
          value="recent"
          id={`${id}-recent`}
          aria-controls={`${id}-panel`}
        />
      </Tabs>

      <Box role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${tab}`}>
        {error ? (
          <Alert severity="error" action={<Button onClick={onRetry}>{t('tests.retry')}</Button>}>
            {t('tests.resultsLoadError')}
          </Alert>
        ) : (
          <TestResultsTable
            title={tab === 'best' ? t('tests.bestAttempts') : t('tests.recentResults')}
            results={tab === 'best' ? bestResults : recentResults}
            questionsCount={questionsCount}
            loading={loading}
            ranked={tab === 'best'}
          />
        )}
      </Box>
    </Box>
  );
};

export default TestResults;
