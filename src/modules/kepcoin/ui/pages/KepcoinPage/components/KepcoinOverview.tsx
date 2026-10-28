import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { contentGridSx, contentHeadingSx, contentInsetSx } from 'app/theme/styles/content';
import type { KepcoinSummary } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import Kepper from 'shared/components/common/Kepper';
import MixedText from 'shared/components/common/MixedText';

const KepcoinOverview = ({
  summary,
  loading,
  error,
  onRetry,
  onPurchase,
}: {
  summary?: KepcoinSummary;
  loading: boolean;
  error?: unknown;
  onRetry: () => void;
  onPurchase: () => Promise<void>;
}) => {
  const { t } = useTranslation();
  if (error)
    return (
      <Alert severity="error" action={<Button onClick={onRetry}>{t('common.retry')}</Button>}>
        {t('common.loadFailed')}
      </Alert>
    );
  return (
    <Box sx={{ ...contentGridSx, gridTemplateColumns: { xs: '1fr', md: '1.2fr .8fr 1fr' } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={contentInsetSx}
      >
        <Stack gap={1.5} sx={{ minWidth: 0 }}>
          <Typography variant="label" color="text.secondary">
            {t('kepcoinSpend.balanceLabel')}
          </Typography>
          {loading ? (
            <Skeleton width={160} height={56} />
          ) : (
            <KepcoinValue
              value={summary?.balance ?? 0}
              iconSize={32}
              textVariant="metric"
              sx={{ '& .MuiTypography-root': { fontSize: { xs: 36, md: 48 } } }}
            />
          )}
          <Typography variant="body2" color="text.secondary">
            {t('kepcoinPage.hero.balanceCaption')}
          </Typography>
        </Stack>
        <Kepper pose="coin" size={{ xs: 72, sm: 104 }} />
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr' },
          gridTemplateRows: { md: '1fr 1fr' },
        }}
      >
        {(['streak', 'maxStreak'] as const).map((key, index) => (
          <Stack
            key={key}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{
              ...contentInsetSx,
              border: 0,
              borderStyle: 'solid',
              borderRightWidth: { xs: index === 0 ? 1 : 0, md: 0 },
              borderBottomWidth: { xs: 0, md: index === 0 ? 1 : 0 },
              borderColor: 'divider',
            }}
          >
            <Stack gap={0.75} sx={{ minWidth: 0 }}>
              <IconifyIcon
                icon={index ? 'solar:medal-star-linear' : 'solar:flame-linear'}
                fontSize={22}
                sx={{ color: index ? 'warning.main' : 'primary.main' }}
              />
              <Typography variant="label" color="text.secondary">
                {t(`kepcoinPage.hero.statLabels.${key}`)}
              </Typography>
            </Stack>
            {loading ? (
              <Skeleton width={50} height={40} />
            ) : (
              <Typography variant="metric" sx={{ fontSize: { xs: 28, md: 36 } }}>
                {summary?.[key] ?? 0}
              </Typography>
            )}
          </Stack>
        ))}
      </Box>
      <Stack gap={1.5} justifyContent="center" sx={contentInsetSx}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography component="h2" sx={contentHeadingSx}>
            <MixedText>{t('kepcoinPage.hero.freezeTitle')}</MixedText>
          </Typography>
          <IconifyIcon icon="solar:snowflake-linear" fontSize={28} sx={{ color: 'primary.main' }} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {t('kepcoinPage.hero.freezeSubtitle')}
        </Typography>
        <Stack direction="row" gap={1} alignItems="baseline">
          {loading ? (
            <Skeleton width={32} />
          ) : (
            <Typography variant="metric" fontSize={28}>
              {summary?.streakFreeze ?? 0}
            </Typography>
          )}
          <Typography variant="label" color="text.secondary">
            {t('kepcoinPage.hero.statLabels.freeze')}
          </Typography>
        </Stack>
        <KepcoinSpendConfirm
          value={10}
          purchaseUrl="/api/purchase-streak-freeze"
          onSuccess={onPurchase}
          disabled={loading}
        >
          <Button
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
            endIcon={<KepcoinValue value={10} iconSize={17} textVariant="body2" />}
          >
            {t('kepcoinPage.streakFreeze.purchaseAction')}
          </Button>
        </KepcoinSpendConfirm>
      </Stack>
    </Box>
  );
};

export default KepcoinOverview;
