import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { numberFormat } from 'shared/lib/utils';
import { useUsersChartStatistics } from 'modules/users/application/queries.ts';

const CHART_WIDTH = 200;
const CHART_HEIGHT = 56;
const CHART_PADDING = 0;

const buildPolylinePoints = (series: number[]) => {
  if (!series.length) {
    return '';
  }

  const maxValue = Math.max(...series);
  const minValue = Math.min(...series);
  const verticalRange = maxValue - minValue || 1;
  const horizontalStep = series.length > 1 ? (CHART_WIDTH - CHART_PADDING * 2) / (series.length - 1) : 0;

  return series
    .map((value, index) => {
      const x = CHART_PADDING + index * horizontalStep;
      const y =
        CHART_HEIGHT -
        CHART_PADDING -
        ((value - minValue) / verticalRange) * (CHART_HEIGHT - CHART_PADDING * 2);

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
};

const UsersSparkline = ({ series }: { series: number[] }) => {
  const theme = useTheme();
  const points = useMemo(() => buildPolylinePoints(series), [series]);

  if (!series.length) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.08),
      }}
    >
      <Box component="svg" width={CHART_WIDTH} height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        <polyline
          points={points}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
    </Box>
  );
};

const UsersHeaderStatistics = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useUsersChartStatistics();
  const hasSeries = Boolean(data?.series.length);

  if (isLoading && !data) {
    return <Skeleton variant="rounded" width={280} height={92} />;
  }

  if (!data || !hasSeries) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('users.statistics.empty')}
      </Typography>
    );
  }

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ md: 'center' }}
      justifyContent="flex-end"
      sx={{ minWidth: { md: 280 } }}
    >
      <Stack direction="column" spacing={0.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          {t('users.statistics.totalUsers')}
        </Typography>
        <Typography variant="h4" component="p">
          {numberFormat(data.total)}
        </Typography>
      </Stack>
      <UsersSparkline series={data.series} />
    </Stack>
  );
};

export default UsersHeaderStatistics;
