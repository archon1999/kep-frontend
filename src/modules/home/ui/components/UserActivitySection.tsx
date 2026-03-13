import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Chip, { type ChipProps } from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ReactEchart from 'shared/components/base/ReactEchart';
import { getColor } from 'shared/lib/echart-utils';
import { getPastDates } from 'shared/lib/utils';
import { useOnlineUsers, useUserActivityStatistics } from '../../application/queries';
import type { HomeOnlineUsers } from '../../domain/entities/home.entity';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

type TrendStyles = { color: ChipProps['color']; icon: string };

const getTrendStyles = (value: number): TrendStyles => {
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

const withPadding = (series: number[]): [number, number] => {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min;
  const padding = range === 0 ? 1 : range * 0.15;

  return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
};

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

const UserActivitySection = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data, isLoading } = useUserActivityStatistics();
  const { data: onlineUsersData, isLoading: isOnlineLoading } = useOnlineUsers(8);
  const showSkeleton = isLoading || !data;

  const newUsersStat = data?.newUsers;
  const activeUsersStat = data?.activeUsers;

  const newUsersSeries = newUsersStat?.series?.length ? newUsersStat.series : [0];
  const activeUsersSeries = activeUsersStat?.series?.length ? activeUsersStat.series : [0];

  const periodLength = Math.max(newUsersSeries.length, activeUsersSeries.length, 1);

  const numberFormatter = useMemo(
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

  const axisLabelColor = getColor(theme.vars.palette.text.secondary);
  const splitLineColor = getColor(theme.vars.palette.chGrey[200]);
  const pointerColor = getColor(theme.vars.palette.chGrey[300]);
  const newUsersColor = getColor(theme.vars.palette.primary.main);
  const activeUsersColor = getColor(theme.vars.palette.success.main);
  const tooltipSuffix = t('homePage.userActivity.tooltipSuffix');

  const createChartOptions = useMemo(
    () => (series: number[], color: string) => {
      const labels = getPastDates(series.length).map((date) => dayjs(date).format('MMM DD'));
      const [min, max] = withPadding(series);

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: pointerColor,
            },
          },
          valueFormatter: (value: string | number) => `${value} ${tooltipSuffix}`,
        },
        grid: { left: 12, right: 12, top: 24, bottom: 12, containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLabel: {
            color: axisLabelColor,
            fontFamily: theme.typography.fontFamily,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          min,
          max,
          axisLabel: {
            color: axisLabelColor,
            formatter: integerAxisLabelFormatter,
          },
          minInterval: 1,
          splitLine: {
            lineStyle: {
              color: splitLineColor,
            },
          },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        series: [
          {
            type: 'line',
            data: series,
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 3,
              color,
            },
            emphasis: {
              focus: 'series',
            },
          },
        ],
      };
    },
    [axisLabelColor, pointerColor, splitLineColor, theme.typography.fontFamily, tooltipSuffix],
  );

  const newUsersChartOptions = useMemo(
    () => createChartOptions(newUsersSeries, newUsersColor),
    [createChartOptions, newUsersColor, newUsersSeries],
  );

  const activeUsersChartOptions = useMemo(
    () => createChartOptions(activeUsersSeries, activeUsersColor),
    [createChartOptions, activeUsersColor, activeUsersSeries],
  );

  const newUsersTrend = getTrendStyles(newUsersStat?.percentage ?? 0);
  const activeUsersTrend = getTrendStyles(activeUsersStat?.percentage ?? 0);

  const onlineUsers = useMemo(() => {
    if (Array.isArray((onlineUsersData as HomeOnlineUsers)?.data)) {
      return (onlineUsersData as HomeOnlineUsers).data;
    }

    if (Array.isArray(onlineUsersData as unknown as unknown[])) {
      return onlineUsersData as unknown as HomeOnlineUsers['data'];
    }

    return [];
  }, [onlineUsersData]);

  const getDisplayName = (user: HomeOnlineUsers['data'][number]) => {
    const firstName = user.firstName?.trim() ?? '';
    const lastName = user.lastName?.trim() ?? '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || user.username;
  };

  return (
    <Stack direction="column">
      <Paper sx={{ p: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="column" spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t('homePage.userActivity.title')}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {t('homePage.userActivity.subtitle', { days: periodLength })}
            </Typography>
          </Stack>

          <Stack direction="column" alignItems="flex-end" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {t('homePage.userActivity.onlineNow')}
            </Typography>

            {isOnlineLoading ? (
              <Stack direction="row" spacing={0.75}>
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="circular" width={36} height={36} />
              </Stack>
            ) : onlineUsers.length ? (
              <AvatarGroup max={40} sx={{ '& .MuiAvatar-root': { width: 36, height: 36 } }}>
                {onlineUsers.map((user) => {
                  const displayName = getDisplayName(user);

                  return (
                    <UserPopover
                      key={user.username}
                      username={user.username}
                      fullName={displayName}
                      avatar={user.avatar}
                      sx={{ marginLeft: -1.5 }}
                    >
                      <Tooltip title={displayName} arrow>
                        <Avatar alt={displayName} src={user.avatar} />
                      </Tooltip>
                    </UserPopover>
                  );
                })}
              </AvatarGroup>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('homePage.userActivity.noOnlineUsers')}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Grid container>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Stack spacing={3} direction="column" sx={{ height: '100%' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack direction="column" spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('homePage.userActivity.series.newUsers')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {showSkeleton ? (
                      <Skeleton width={120} />
                    ) : (
                      numberFormatter.format(newUsersStat?.total ?? 0)
                    )}
                  </Typography>
                </Stack>

                <Stack justifyContent="flex-end" direction="column" spacing={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('homePage.userActivity.changeLabel')}
                  </Typography>

                  <Stack direction="row" justifyContent="flex-end">
                    {showSkeleton ? (
                      <Skeleton width={140} height={36} />
                    ) : (
                      <Chip
                        label={`${percentFormatter.format(newUsersStat?.percentage ?? 0)}%`}
                        color={newUsersTrend.color}
                        icon={<IconifyIcon icon={newUsersTrend.icon} />}
                        sx={{ flexDirection: 'row-reverse' }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>

              {showSkeleton ? (
                <Skeleton variant="rounded" height={260} />
              ) : (
                <ReactEchart
                  echarts={echarts}
                  option={newUsersChartOptions}
                  style={{ minHeight: 260 }}
                />
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Stack spacing={3} direction="column" sx={{ height: '100%' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack direction="column" spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('homePage.userActivity.series.activeUsers')}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {showSkeleton ? (
                      <Skeleton width={120} />
                    ) : (
                      numberFormatter.format(activeUsersStat?.total ?? 0)
                    )}
                  </Typography>
                </Stack>

                <Stack justifyContent="flex-end" direction="column" spacing={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('homePage.userActivity.changeLabel')}
                  </Typography>

                <Stack direction="row" justifyContent="flex-end">
                    {showSkeleton ? (
                      <Skeleton width={140} height={36} />
                    ) : (
                      <Chip
                        label={`${percentFormatter.format(activeUsersStat?.percentage ?? 0)}%`}
                        color={activeUsersTrend.color}
                        icon={<IconifyIcon icon={activeUsersTrend.icon} />}
                        sx={{ flexDirection: 'row-reverse' }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>

              {showSkeleton ? (
                <Skeleton variant="rounded" height={260} />
              ) : (
                <ReactEchart
                  echarts={echarts}
                  option={activeUsersChartOptions}
                  style={{ minHeight: 260 }}
                />
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default UserActivitySection;
