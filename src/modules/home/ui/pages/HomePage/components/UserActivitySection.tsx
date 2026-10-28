import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useOnlineUsers, useUserActivityStatistics } from 'modules/home/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import type { ReactEchartProps } from 'shared/components/base/ReactEchart';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import StatisticsChart from 'shared/components/statistics/StatisticsChart';
import useChartPalette from 'shared/hooks/useChartPalette';
import { formatDateTime } from 'shared/lib/dateTime';
import { getColor } from 'shared/lib/echart-utils';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { getPastDates } from 'shared/lib/utils';
import { DashboardPattern } from './DashboardPattern';

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegacyGridContainLabel,
  CanvasRenderer,
]);

const UserActivitySection = () => {
  const { t, i18n } = useTranslation();
  const palette = useChartPalette();
  const { data, isLoading, error, mutate } = useUserActivityStatistics();
  const {
    data: onlineUsersData,
    isLoading: isOnlineLoading,
    error: onlineError,
  } = useOnlineUsers(8);
  const onlineUsers = onlineUsersData?.data.slice(0, 8) ?? [];
  const periodLength = Math.max(
    data?.newUsers.series.length ?? 0,
    data?.activeUsers.series.length ?? 0,
    1,
  );
  const formatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 0 }),
    [i18n.resolvedLanguage],
  );
  const percentFormatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 1, signDisplay: 'always' }),
    [i18n.resolvedLanguage],
  );
  const primary = getColor(palette.primary.main);
  const secondary = getColor(palette.secondary.main);
  const option = useMemo<ReactEchartProps['option'] | null>(() => {
    if (!data || (!data.newUsers.series.length && !data.activeUsers.series.length)) return null;
    const align = (values: number[]) => [
      ...Array(Math.max(0, periodLength - values.length)).fill(null),
      ...values,
    ];
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        valueFormatter: (value: number) =>
          formatter.format(value) + ' ' + t('homePage.userActivity.tooltipSuffix'),
      },
      grid: { left: 8, right: 18, top: 20, bottom: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: getPastDates(periodLength).map((date) => formatDateTime(date, 'monthDay')),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { hideOverlap: true, margin: 14, interval: 'auto', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        minInterval: 1,
        splitNumber: 4,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { margin: 12, formatter: (value: number) => formatter.format(value) },
      },
      series: [
        {
          name: t('homePage.userActivity.series.newUsers'),
          type: 'bar',
          data: align(data.newUsers.series),
          barMaxWidth: 14,
          itemStyle: { color: alpha(secondary, 0.55), borderRadius: [2, 2, 0, 0] },
          emphasis: { itemStyle: { color: secondary } },
        },
        {
          name: t('homePage.userActivity.series.activeUsers'),
          type: 'line',
          data: align(data.activeUsers.series),
          smooth: 0.22,
          showSymbol: false,
          symbolSize: 7,
          lineStyle: { width: 2.5, color: primary, cap: 'round' },
          itemStyle: { color: primary },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: alpha(primary, 0.17) },
              { offset: 1, color: alpha(primary, 0) },
            ]),
          },
        },
      ],
    };
  }, [data, periodLength, primary, secondary, formatter, t, i18n.resolvedLanguage]);

  return (
    <Paper
      component={PointerSpotlight}
      variant="section"
      className="kep-dashboard-activity"
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
          {t('homePage.userActivity.subtitle', { days: isLoading ? 14 : periodLength })}
        </Typography>
      </Stack>
      {error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => void mutate()}>{t('common.retry')}</Button>}
        >
          {t('common.loadFailed')}
        </Alert>
      ) : (
        <div className="kep-dashboard-activity-layout">
          <dl className="kep-dashboard-activity-metrics">
            {(['activeUsers', 'newUsers'] as const).map((key) => {
              const stat = data?.[key];
              const change = stat?.percentage ?? 0;
              return (
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
                        bgcolor: key === 'activeUsers' ? primary : secondary,
                        borderRadius: key === 'activeUsers' ? '50%' : 0,
                      }}
                    />
                    {t('homePage.userActivity.series.' + key)}
                  </Typography>
                  <Stack
                    component="dd"
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1.5}
                    sx={{ m: 0, mt: 1 }}
                  >
                    <Typography variant="metric" sx={{ fontSize: 34 }}>
                      {isLoading ? (
                        <Skeleton width={80} />
                      ) : stat ? (
                        formatter.format(stat.total)
                      ) : (
                        '—'
                      )}
                    </Typography>
                    {isLoading ? (
                      <Skeleton variant="rounded" width={64} height={24} />
                    ) : (
                      stat && (
                        <Tooltip title={t('homePage.userActivity.changeLabel')}>
                          <Chip
                            size="small"
                            variant="soft"
                            color={change > 0 ? 'success' : change < 0 ? 'error' : 'neutral'}
                            label={percentFormatter.format(change) + '%'}
                            icon={
                              <IconifyIcon
                                icon={change < 0 ? 'mdi:trending-down' : 'mdi:trending-up'}
                              />
                            }
                          />
                        </Tooltip>
                      )
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {t('homePage.userActivity.changeLabel')}
                  </Typography>
                </div>
              );
            })}
          </dl>
          <div className="kep-dashboard-activity-chart">
            <StatisticsChart
              label={t('homePage.userActivity.title')}
              option={option}
              height={230}
              loading={isLoading}
            />
          </div>
        </div>
      )}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        sx={{ pt: 2.5, mt: 2.5, borderTop: 1, borderColor: 'divider' }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <span className="kep-live-dot" aria-hidden="true" />
          <Typography variant="body2" color="text.secondary">
            {t('homePage.userActivity.onlineNow')}
          </Typography>
        </Stack>
        {isOnlineLoading ? (
          <Stack direction="row" sx={{ '& > * + *': { ml: -1 } }} aria-hidden="true">
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
        ) : onlineError ? (
          <Typography variant="caption" color="text.secondary">
            {t('common.loadFailed')}
          </Typography>
        ) : onlineUsers.length ? (
          <Stack
            direction="row"
            role="group"
            aria-label={t('homePage.userActivity.onlineNow')}
            sx={{ '& > * + *': { ml: -1 } }}
          >
            {onlineUsers.map((user, index) => (
              <UserPopover
                key={user.username}
                username={user.username}
                fullName={
                  [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
                }
                avatar={user.avatar}
                sx={{
                  position: 'relative',
                  zIndex: onlineUsers.length - index,
                  borderRadius: '50%',
                  '&:hover, &:focus-visible': { zIndex: onlineUsers.length + 1 },
                }}
              >
                <Avatar
                  alt={user.username}
                  src={user.avatar}
                  sx={{
                    width: 32,
                    height: 32,
                    border: '2px solid',
                    borderColor: 'background.default',
                  }}
                >
                  {user.username[0]?.toUpperCase()}
                </Avatar>
              </UserPopover>
            ))}
          </Stack>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {t('homePage.userActivity.noOnlineUsers')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
export default UserActivitySection;
