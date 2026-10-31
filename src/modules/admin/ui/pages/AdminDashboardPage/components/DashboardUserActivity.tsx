import { useTranslation } from 'react-i18next';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import UserActivityChart from 'shared/components/statistics/UserActivityChart';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import type { UserActivityStatistics } from 'shared/types/userActivity';

export default function DashboardUserActivity({
  data,
  dates,
}: {
  data: UserActivityStatistics;
  dates: string[];
}) {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter({ maximumFractionDigits: 0 }, i18n.resolvedLanguage);
  const percent = createNumberFormatter(
    { maximumFractionDigits: 1, signDisplay: 'always' },
    i18n.resolvedLanguage,
  );
  return (
    <>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={2} mb={2.5}>
        <Typography component="h2" variant="h6">
          <MixedText>{t('homePage.userActivity.title')}</MixedText>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('homePage.userActivity.subtitle', { days: dates.length })}
        </Typography>
      </Stack>
      <Box
        component="dl"
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2, m: 0 }}
      >
        {(['newUsers', 'activeUsers'] as const).map((key) => {
          const stat = data[key];
          return (
            <Box key={key}>
              <Stack component="dt" direction="row" alignItems="center" gap={1}>
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    flexShrink: 0,
                    bgcolor: key === 'activeUsers' ? 'primary.main' : 'secondary.main',
                    borderRadius: key === 'activeUsers' ? '50%' : 0,
                  }}
                />
                <Typography component="span" variant="caption" color="text.secondary">
                  {t('homePage.userActivity.series.' + key)}
                </Typography>
              </Stack>
              <Stack
                component="dd"
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                gap={1}
                sx={{ m: 0, mt: 0.75 }}
              >
                <Typography component="span" variant="metric" sx={{ fontSize: 30 }}>
                  {number.format(stat.total)}
                </Typography>
                <Tooltip title={t('homePage.userActivity.changeLabel')}>
                  <Chip
                    size="small"
                    variant="soft"
                    color={
                      stat.percentage > 0 ? 'success' : stat.percentage < 0 ? 'error' : 'neutral'
                    }
                    label={percent.format(stat.percentage) + '%'}
                    icon={
                      <IconifyIcon icon={stat.diff < 0 ? 'mdi:trending-down' : 'mdi:trending-up'} />
                    }
                  />
                </Tooltip>
              </Stack>
            </Box>
          );
        })}
      </Box>
      <UserActivityChart data={data} dates={dates} height={210} />
    </>
  );
}
