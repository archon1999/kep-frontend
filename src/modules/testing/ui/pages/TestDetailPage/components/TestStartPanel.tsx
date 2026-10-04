import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Test } from 'modules/testing/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';

interface TestStartPanelProps {
  test: Test;
  questionsCount: number;
  canStart: boolean;
  isStarting: boolean;
  onStart: () => void;
  onPurchase: () => void;
}

const TestStartPanel = ({
  test,
  questionsCount,
  canStart,
  isStarting,
  onStart,
  onPurchase,
}: TestStartPanelProps) => {
  const { t } = useTranslation();
  const hasCompleted = Boolean(test.lastPassed);
  const bestResult = test.userBestResult;
  const hasScore = hasCompleted && typeof bestResult === 'number' && Number.isFinite(bestResult);
  const isPerfect = hasScore && questionsCount > 0 && bestResult === questionsCount;
  const progress =
    hasScore && questionsCount > 0
      ? Math.min(100, Math.max(0, (bestResult / questionsCount) * 100))
      : 0;
  const startButton = (
    <Button
      variant="contained"
      fullWidth
      sx={{ minHeight: { xs: 44, md: 36 } }}
      disabled={isStarting}
      onClick={canStart ? onStart : undefined}
      endIcon={
        isStarting ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <IconifyIcon
            icon={
              canStart
                ? 'material-symbols:arrow-forward-rounded'
                : 'material-symbols:lock-open-rounded'
            }
            fontSize={18}
          />
        )
      }
    >
      {canStart ? t('tests.start') : t('tests.unlockTest')}
    </Button>
  );

  return (
    <Paper
      variant="elevation"
      elevation={0}
      sx={{ bgcolor: 'background.elevation1', borderRadius: 4, p: 2.5 }}
    >
      <Typography
        component="h2"
        variant="body2"
        color="text.secondary"
        fontWeight={500}
        sx={{ mb: 2 }}
      >
        {t('tests.yourProgress')}
      </Typography>

      {hasScore ? (
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="h5" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {bestResult}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.75 }}>
                / {questionsCount}
              </Typography>
            </Typography>
            {isPerfect ? (
              <IconifyIcon
                icon="material-symbols:check-circle-rounded"
                fontSize={22}
                sx={{ color: 'success.main' }}
                aria-hidden
              />
            ) : null}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {t('tests.bestResult')}
          </Typography>
          {questionsCount > 0 ? (
            <LinearProgress
              variant="determinate"
              color={isPerfect ? 'success' : 'warning'}
              value={progress}
              aria-label={t('tests.bestResult')}
              sx={{ mt: 1.5, height: 4 }}
            />
          ) : null}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('tests.noScore')}
        </Typography>
      )}

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="baseline"
        justifyContent="space-between"
        sx={{ mt: 2 }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
          {t('tests.lastPass')}
        </Typography>
        <Typography
          variant="caption"
          color="text.primary"
          sx={{ textAlign: 'right', overflowWrap: 'anywhere', minWidth: 0 }}
        >
          {test.lastPassed || t('tests.notPassed')}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2.5 }} />

      {!canStart ? (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('kepcoinSpend.costLabel')}
          </Typography>
          <KepcoinValue value={1} iconSize={18} />
        </Stack>
      ) : null}
      {canStart ? (
        startButton
      ) : (
        <KepcoinSpendConfirm
          value={1}
          purchaseUrl={`/api/tests/${test.id}/purchase/`}
          onSuccess={onPurchase}
          disabled={isStarting}
        >
          {startButton}
        </KepcoinSpendConfirm>
      )}
    </Paper>
  );
};

export default TestStartPanel;
