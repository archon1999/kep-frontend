import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Tab, Tabs } from '@mui/material';
import { TestResultRow } from 'modules/testing/domain/ports/testing.repository';
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
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
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
