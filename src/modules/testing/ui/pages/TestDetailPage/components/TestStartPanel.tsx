import { useTranslation } from 'react-i18next';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { Test } from 'modules/testing/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

type Props = {
  test: Test;
  questionsCount: number;
  canStart: boolean;
  isStarting: boolean;
  onStart: () => void;
  onPurchase: () => void;
};
const TestStartPanel = ({
  test,
  questionsCount,
  canStart,
  isStarting,
  onStart,
  onPurchase,
}: Props) => {
  const { t } = useTranslation();
  const score = test.userBestResult;
  const hasScore = Boolean(test.lastPassed) && typeof score === 'number' && Number.isFinite(score);
  const perfect = hasScore && questionsCount > 0 && score === questionsCount;
  const progress =
    hasScore && questionsCount > 0 ? Math.max(0, Math.min(100, (score / questionsCount) * 100)) : 0;
  const button = (
    <Button
      variant="contained"
      fullWidth
      disabled={isStarting}
      loading={isStarting}
      onClick={canStart ? onStart : undefined}
      endIcon={<IconifyIcon icon={canStart ? 'mdi:arrow-right' : 'mdi:lock-open-outline'} />}
    >
      {t(canStart ? 'tests.start' : 'tests.unlockTest')}
    </Button>
  );
  return (
    <Box component="section" className="kep-test-start">
      <SectionHeader
        title={t('tests.yourProgress')}
        action={<PatternArtwork kind="daily-tasks" sx={{ width: 76, opacity: 0.4 }} />}
      />
      <Stack gap={2.5} sx={{ p: 'var(--kep-content-inset)' }}>
        {hasScore ? (
          <Box>
            <Stack direction="row" gap={1.25} alignItems="baseline">
              <Typography
                variant="metric"
                color={perfect ? 'success.main' : 'text.primary'}
                sx={{ fontSize: 44 }}
              >
                {score}
              </Typography>
              <Typography variant="metric" color="text.secondary" sx={{ fontSize: 21 }}>
                / {questionsCount}
              </Typography>
              {perfect && (
                <IconifyIcon
                  icon="mdi:check-circle-outline"
                  sx={{ fontSize: 22, ml: 'auto', color: 'success.main', alignSelf: 'center' }}
                />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {t('tests.bestResult')}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={perfect ? 'success' : 'primary'}
              aria-label={t('tests.bestResult')}
              sx={{ height: 3, mt: 2, bgcolor: 'action.selected' }}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('tests.noScore')}
          </Typography>
        )}
        <Stack gap={0.75}>
          <Typography variant="label" color="text.secondary">
            {t('tests.lastPass')}
          </Typography>
          <Typography variant="body2">{test.lastPassed || t('tests.notPassed')}</Typography>
        </Stack>
        <Box sx={{ pt: 2.5, borderTop: '1px solid var(--kep-line)' }}>
          {!canStart && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                {t('kepcoinSpend.costLabel')}
              </Typography>
              <KepcoinValue value={1} iconSize={20} />
            </Stack>
          )}
          {canStart ? (
            button
          ) : (
            <KepcoinSpendConfirm
              value={1}
              purchaseUrl={`/api/tests/${test.id}/purchase/`}
              onSuccess={onPurchase}
              disabled={isStarting}
            >
              {button}
            </KepcoinSpendConfirm>
          )}
        </Box>
      </Stack>
    </Box>
  );
};
export default TestStartPanel;
