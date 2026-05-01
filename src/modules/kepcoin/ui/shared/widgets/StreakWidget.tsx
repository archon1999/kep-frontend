import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import Streak from 'shared/components/rating/Streak';
import { responsivePagePaddingSx } from 'shared/lib/styles';

interface StreakWidgetProps {
  balance?: number;
  streak?: number;
  maxStreak?: number;
  streakFreeze?: number;
  isLoading: boolean;
  onPurchaseStreakFreeze?: () => void;
}

const StreakWidget = ({
  balance = 0,
  streak = 0,
  maxStreak = 0,
  streakFreeze = 0,
  isLoading,
}: StreakWidgetProps) => {
  const { t } = useTranslation();

  const renderMetric = (
    label: string,
    content: ReactNode,
    tone: 'warning' | 'info' = 'warning',
  ) => (
    <Box
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 4,
        bgcolor: (theme) =>
          alpha(tone === 'warning' ? theme.palette.warning.main : theme.palette.info.main, 0.08),
        border: (theme) =>
          `1px solid ${alpha(
            tone === 'warning' ? theme.palette.warning.main : theme.palette.info.main,
            0.14,
          )}`,
      }}
    >
      <Typography variant="caption" color="text.secondary" textTransform="uppercase">
        {label}
      </Typography>
      <Box mt={1}>{content}</Box>
    </Box>
  );

  return (
    <Card
      sx={{
        borderRadius: 5,
        border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.14)}`,
        boxShadow: '0 24px 50px rgba(18, 28, 45, 0.08)',
      }}
    >
      <CardContent sx={responsivePagePaddingSx}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={2}
          >
            <Stack spacing={0.75}>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase">
                {t('kepcoinSpend.balanceLabel')}
              </Typography>
              {isLoading ? (
                <Skeleton variant="rounded" width={132} height={42} />
              ) : (
                <KepcoinValue
                  value={balance}
                  iconSize={28}
                  textVariant="h4"
                  fontWeight={800}
                  color="text.primary"
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
              <IconifyIcon icon="solar:shield-check-line-duotone" fontSize={20} color="info.main" />
              <Typography variant="body2" color="inherit">
                {t('kepcoinPage.hero.freezeTitle')}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {renderMetric(
              t('kepcoinPage.streakStats.current'),
              isLoading ? (
                <Skeleton variant="rounded" width={110} height={36} />
              ) : (
                <Streak
                  streak={streak}
                  maxStreak={maxStreak}
                  iconSize={24}
                  textVariant="h5"
                  fontWeight={800}
                />
              ),
            )}
            {renderMetric(
              t('kepcoinPage.streakStats.max'),
              isLoading ? (
                <Skeleton variant="rounded" width={110} height={36} />
              ) : (
                <Streak
                  streak={maxStreak}
                  maxStreak={maxStreak}
                  iconSize={24}
                  textVariant="h5"
                  fontWeight={800}
                />
              ),
            )}
            {renderMetric(
              t('kepcoinPage.hero.statLabels.freeze'),
              isLoading ? (
                <Skeleton variant="rounded" width={74} height={36} />
              ) : (
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconifyIcon
                    icon="solar:snowflake-line-duotone"
                    fontSize={22}
                    color="info.main"
                  />
                  <Typography variant="h5" fontWeight={800}>
                    {streakFreeze}
                  </Typography>
                </Stack>
              ),
              'info',
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StreakWidget;
