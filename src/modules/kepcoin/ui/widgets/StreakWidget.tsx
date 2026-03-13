import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
import Streak from 'shared/components/rating/Streak';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
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
  onPurchaseStreakFreeze,
}: StreakWidgetProps) => {
  const { t } = useTranslation();

  const renderStat = (label: string, content: ReactNode, tooltip?: string, action?: ReactNode) => {
    const node = (
      <Stack direction="row" spacing={0.75} minWidth={160}>
        <Typography variant="caption" color="text.secondary" textTransform="uppercase">
          {label}
        </Typography>
        {action ? (
          <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            {content}
            {action}
          </Stack>
        ) : (
          content
        )}
      </Stack>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          {node}
        </Tooltip>
      );
    }

    return node;
  };

  const streakFreezeAction = (
    <KepcoinSpendConfirm
      value={10}
      purchaseUrl="/api/purchase-streak-freeze"
      onSuccess={onPurchaseStreakFreeze}
      disabled={isLoading}
    >
      <Button
        size="small"
        variant="contained"
        disabled={isLoading}
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
      >
        {t('kepcoinPage.streakFreeze.purchaseAction')}
        <KepcoinValue value={10} iconSize={16} textVariant="caption" fontWeight={700} />
      </Button>
    </KepcoinSpendConfirm>
  );

  return (
    <Card>
      <CardContent sx={responsivePagePaddingSx}>
        <Stack direction="column" spacing={3}>
          {isLoading ? (
            <Skeleton variant="text" width={240} height={48} />
          ) : (
            <Typography variant="h3" fontWeight={700}>
              <Stack direction="row" spacing={1}>
                You have <KepcoinValue iconSize={32} textVariant="h3" value={balance}></KepcoinValue>
              </Stack>
            </Typography>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="nowrap">
            {renderStat(
              t('kepcoinPage.streakStats.current'),
              isLoading ? (
                <Skeleton variant="rounded" width={140} height={32} />
              ) : (
                <Streak streak={streak} maxStreak={maxStreak} iconSize={22} spacing={0.75} />
              ),
            )}
            {renderStat(
              t('kepcoinPage.streakStats.max'),
              isLoading ? (
                <Skeleton variant="rounded" width={140} height={32} />
              ) : (
                <Streak streak={maxStreak} maxStreak={maxStreak} iconSize={22} spacing={0.75} />
              ),
            )}
            {renderStat(
              t('kepcoinPage.streakFreeze.label'),
              isLoading ? (
                <Skeleton variant="text" width={200} />
              ) : (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <IconifyIcon icon="solar:snowflake-line-duotone" fontSize={20} color="info.main" />
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {streakFreeze}
                  </Typography>
                </Stack>
              ),
              t('kepcoinPage.streakFreeze.description'),
              streakFreezeAction,
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StreakWidget;
