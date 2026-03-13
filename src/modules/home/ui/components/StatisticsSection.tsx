import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';
import Chip, { ChipProps } from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useLandingPageStatistics } from '../../application/queries.ts';
import type { HomeStatisticKey } from '../../domain/entities/home.entity.ts';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';

type StatisticEntry = {
  key: HomeStatisticKey;
  value: number;
  percent: number;
  hasData: boolean;
};

const STATISTIC_KEYS: HomeStatisticKey[] = ['users', 'problems', 'competitions', 'attempts'];

const getTrendStyles = (value: number): { color: ChipProps['color']; icon: string } => {
  if (value > 0) {
    return {
      color: 'success',
      icon: 'material-symbols:trending-up-rounded',
    };
  }

  if (value < 0) {
    return {
      color: 'error',
      icon: 'material-symbols:trending-down-rounded',
    };
  }

  return {
    color: 'neutral',
    icon: 'material-symbols:trending-flat-rounded',
  };
};

const StatisticsSection = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useLandingPageStatistics();

  const valueFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 0,
      }),
    [],
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        signDisplay: 'always',
      }),
    [],
  );

  const statisticsList: StatisticEntry[] = useMemo(
    () =>
      STATISTIC_KEYS.map((key) => ({
        key,
        value: data?.[key]?.value ?? 0,
        percent: data?.[key]?.percent ?? 0,
        hasData: Boolean(data?.[key]),
      })),
    [data],
  );

  return (
    <Grid container size={12}>
      <Grid size={12}>
        <Paper sx={responsivePagePaddingSx}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('homePage.statistics.title')}
          </Typography>
        </Paper>
      </Grid>
      {statisticsList.map(({ key, value, percent, hasData }) => {
        const { color, icon } = getTrendStyles(percent);
        const showSkeleton = isLoading || !hasData;

        return (
          <Grid key={key} size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ p: 4 }}>
              <Stack spacing={2} direction="column">
                <Stack direction="column" spacing={0.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
                    sx={{
                      gap: 1,
                      alignItems: {
                        xs: 'flex-start',
                        sm: 'baseline',
                        md: 'flex-start',
                        xl: 'baseline',
                      },
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {showSkeleton ? <Skeleton width={96} /> : valueFormatter.format(value)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {t(`homePage.statistics.cards.${key}`)}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
                  sx={{
                    mt: 'auto',
                    gap: 1,
                    alignItems: { xs: 'flex-start' },
                  }}
                >
                  {showSkeleton ? (
                    <Skeleton width={120} height={32} />
                  ) : (
                    <Chip
                      label={`${percentFormatter.format(percent)}%`}
                      color={color}
                      icon={<IconifyIcon icon={icon} />}
                      sx={{ flexDirection: 'row-reverse' }}
                    />
                  )}
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {t('homePage.statistics.changeLabel')}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatisticsSection;
