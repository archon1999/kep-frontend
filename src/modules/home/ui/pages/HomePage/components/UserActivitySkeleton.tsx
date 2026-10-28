import { useTranslation } from 'react-i18next';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import MixedText from 'shared/components/common/MixedText';
import { DashboardPattern } from './DashboardPattern';

const UserActivitySkeleton = () => {
  const { t } = useTranslation();
  return (
    <Paper
      variant="section"
      className="kep-dashboard-activity"
      aria-busy="true"
      sx={{ p: 'var(--kep-content-inset)' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Typography component="h2" variant="h5" sx={{ flex: 1 }}>
          <MixedText>{t('homePage.userActivity.title')}</MixedText>
        </Typography>
        <DashboardPattern kind="activity" inline />
        <Typography variant="caption" color="text.secondary">
          {t('homePage.userActivity.subtitle', { days: 14 })}
        </Typography>
      </Stack>
      <div className="kep-dashboard-activity-layout">
        <dl className="kep-dashboard-activity-metrics">
          {(['activeUsers', 'newUsers'] as const).map((key) => (
            <div key={key}>
              <Typography
                component="dt"
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: key === 'activeUsers' ? 'primary.main' : 'secondary.main',
                    borderRadius: key === 'activeUsers' ? '50%' : 0,
                  }}
                />
                {t(`homePage.userActivity.series.${key}`)}
              </Typography>
              <Stack
                component="dd"
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{ m: 0, mt: 1 }}
              >
                <Typography variant="metric" sx={{ fontSize: 34 }}>
                  <Skeleton width={80} />
                </Typography>
                <Skeleton variant="rounded" width={64} height={24} />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {t('homePage.userActivity.changeLabel')}
              </Typography>
            </div>
          ))}
        </dl>
        <div className="kep-dashboard-activity-chart">
          <Skeleton variant="rectangular" height={230} />
        </div>
      </div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        sx={{ pt: 2.5, mt: 2.5, borderTop: 1, borderColor: 'divider' }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('homePage.userActivity.onlineNow')}
        </Typography>
        <Stack direction="row" sx={{ '& > * + *': { ml: -1 } }}>
          {[0, 1, 2].map((index) => (
            <Skeleton
              key={index}
              variant="circular"
              width={32}
              height={32}
              sx={{ border: '2px solid', borderColor: 'background.default' }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};
export default UserActivitySkeleton;
