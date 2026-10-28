import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEchart from 'shared/components/base/ReactEchart';
import useChartPalette from 'shared/hooks/useChartPalette';
import { getColor } from 'shared/lib/echart-utils';
import { createNumberFormatter } from 'shared/lib/numberFormat';

echarts.use([PieChart, TooltipComponent, CanvasRenderer]);

export interface StatisticsBreakdownItem {
  label: string;
  value: number;
  color?: string;
}

const StatisticsBreakdown = ({
  items,
  label,
  totalLabel,
  loading,
}: {
  items: StatisticsBreakdownItem[];
  label: string;
  totalLabel?: string;
  loading?: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const palette = useChartPalette();
  const number = createNumberFormatter({ maximumFractionDigits: 0 }, i18n.language);
  const percentage = createNumberFormatter({ maximumFractionDigits: 1 }, i18n.language);
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  const colors = [
    palette.primary.main,
    palette.secondary.main,
    palette.success.main,
    palette.warning.main,
    palette.info.main,
    palette.error.main,
    palette.primary.dark,
    palette.secondary.dark,
    palette.success.light,
    palette.info.light,
  ];
  const entries = items.map((item, index) => ({
    ...item,
    value: Math.max(0, item.value),
    color: getColor(item.color ?? colors[index % colors.length]),
  }));

  if (!loading && !total)
    return (
      <Box sx={{ minHeight: 190, display: 'grid', placeItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('common.statistics.noData')}
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ containerType: 'inline-size', minWidth: 0 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(108px, .8fr) minmax(0, 1.2fr)',
          alignItems: 'center',
          gap: 2,
          minHeight: 190,
          '@container (max-width: 300px)': { gridTemplateColumns: '104px minmax(0, 1fr)', gap: 1 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            minWidth: 0,
            width: '100%',
            maxWidth: 176,
            justifySelf: 'center',
          }}
        >
          {loading ? (
            <Skeleton variant="circular" sx={{ width: '100%', aspectRatio: '1', height: 'auto' }} />
          ) : (
            <ReactEchart
              echarts={echarts}
              role="img"
              aria-label={label}
              option={{
                tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                series: [
                  {
                    type: 'pie',
                    radius: ['70%', '91%'],
                    center: ['50%', '50%'],
                    label: { show: false },
                    labelLine: { show: false },
                    padAngle: 1.5,

                    avoidLabelOverlap: true,
                    itemStyle: { borderRadius: 0 },
                    emphasis: { scaleSize: 2 },
                    data: entries.map((item) => ({
                      name: item.label,
                      value: item.value,
                      itemStyle: { color: item.color },
                    })),
                  },
                ],
              }}
              style={{ height: 176, width: '100%' }}
            />
          )}
          {!loading && (
            <Stack
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography variant="metric" fontSize={26}>
                {number.format(total)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ maxWidth: '65%', textAlign: 'center', fontSize: 10, lineHeight: 1.3 }}
              >
                {totalLabel ?? t('common.statistics.total')}
              </Typography>
            </Stack>
          )}
        </Box>
        <Box
          component="ul"
          aria-label={label}
          sx={{
            m: 0,
            p: 0,
            listStyle: 'none',
            maxHeight: entries.length > 4 || loading ? 190 : undefined,
            overflowY: entries.length > 4 || loading ? 'auto' : undefined,
            scrollbarGutter: entries.length > 4 || loading ? 'stable' : undefined,
            minWidth: 0,
          }}
        >
          {loading
            ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} height={32} />)
            : entries.map((item, index) => (
                <Box
                  component="li"
                  key={`${item.label}-${index}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '6px minmax(0, 1fr) auto',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0 },
                  }}
                >
                  <Box aria-hidden sx={{ width: 5, height: 18, bgcolor: item.color }} />
                  <Typography
                    variant="caption"
                    title={item.label}
                    sx={{ minWidth: 0, lineHeight: 1.4, overflowWrap: 'anywhere', fontSize: 12 }}
                  >
                    {item.label}
                  </Typography>
                  <Box sx={{ textAlign: 'right', pl: 0.25 }}>
                    <Typography variant="metric" fontSize={16}>
                      {number.format(item.value)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', fontSize: 10 }}
                    >
                      {percentage.format(total ? (item.value / total) * 100 : 0)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StatisticsBreakdown;
