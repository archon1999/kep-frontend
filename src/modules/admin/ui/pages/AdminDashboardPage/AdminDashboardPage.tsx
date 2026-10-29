import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Box, Button, Chip, Stack, Typography, useTheme } from '@mui/material';
import { resources } from 'app/routes/resources';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useAdminDashboard, useAdminRegistry } from 'modules/admin/application';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StatisticsChart from 'shared/components/statistics/StatisticsChart';
import { formatDateTime } from 'shared/lib/dateTime';
import AuditList from '../../shared/components/AuditList';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import { resourceTitle } from '../../shared/helpers';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);
const section = { p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider', minWidth: 0 };

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, error, isLoading, mutate } = useAdminDashboard();
  const { data: catalog = [] } = useAdminRegistry();
  const quick = [
    'backend.problem',
    'backend.contest',
    'projects.project',
    'testing.test',
    'blog.blog',
    'home.systemupdate',
  ];
  const chart = data?.activity.length
    ? {
        grid: { left: 36, right: 14, bottom: 30, top: 20 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.activity.map((item) => item.date.slice(5)),
          axisTick: { show: false },
        },
        yAxis: { type: 'value', minInterval: 1, splitNumber: 3 },
        series: [
          {
            type: 'line',
            name: t('admin.console.newUsers'),
            data: data.activity.map((item) => item.value),
            smooth: 0.25,
            showSymbol: false,
            lineStyle: { width: 2.5, color: theme.palette.primary.main },
            areaStyle: { opacity: 0.08 },
          },
        ],
      }
    : null;
  return (
    <FramedPage>
      <PageHeader
        title={t('admin.console.dashboard')}
        subtitle={t('admin.console.overview')}
        actionComponent={
          <Button
            variant="outlined"
            component={Link}
            to={resources.AdminCatalog}
            startIcon={<IconifyIcon icon="mdi:view-grid-outline" />}
          >
            {t('admin.console.catalog')}
          </Button>
        }
      />
      <ConsoleError error={error} retry={() => void mutate()} />
      {isLoading ? (
        <ConsoleSkeleton kind="dashboard" />
      ) : (
        data && (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))',
                },
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              {data.metrics.map((metric) => (
                <Box
                  key={metric.key}
                  component={Link}
                  to={metric.path}
                  sx={{
                    p: { xs: 2, md: 3 },
                    textDecoration: 'none',
                    color: 'text.primary',
                    borderRight: 1,
                    borderColor: 'divider',
                    transition: 'background-color 160ms',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" gap={1}>
                    <Typography variant="body2" color="text.secondary">
                      {t(`admin.console.metrics.${metric.key}`)}
                    </Typography>
                    <IconifyIcon icon={metric.icon} sx={{ color: 'primary.main' }} />
                  </Stack>
                  <Typography
                    sx={{
                      mt: 1.5,
                      fontSize: { xs: 28, md: 36 },
                      fontFamily: 'var(--kep-display-font)',
                      fontFeatureSettings: '"ss01" 1',
                      lineHeight: 1.2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {metric.value.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box component="section" sx={section}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography component="h2" variant="h6">
                  <MixedText>{t('admin.console.needsAttention')}</MixedText>
                </Typography>
                <Chip size="small" variant="soft" label={t('admin.console.live')} />
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    xl: 'repeat(3, minmax(0, 1fr))',
                  },
                  gap: 1.5,
                }}
              >
                {data.queues.map((queue) => (
                  <Box
                    key={queue.key}
                    component={Link}
                    to={queue.path}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      color: 'text.primary',
                      textDecoration: 'none',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <IconifyIcon
                        icon={queue.icon}
                        sx={{ color: queue.count ? 'warning.main' : 'primary.main', fontSize: 25 }}
                      />
                      <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                        {t(`admin.console.queues.${queue.key}`)}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--kep-display-font)',
                          fontFeatureSettings: '"ss01" 1',
                          fontSize: 24,
                        }}
                      >
                        {queue.count}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      {queue.count
                        ? queue.records.map((row) => row.label).join(' · ')
                        : t('admin.console.allClear')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.35fr) minmax(0, 1fr)' },
              }}
            >
              <Box
                component="section"
                sx={{ ...section, borderRight: { lg: '1px solid var(--kep-line)' } }}
              >
                <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                  <Typography component="h2" variant="h6">
                    {t('admin.console.newUsers')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('admin.console.last14Days')}
                  </Typography>
                </Stack>
                <StatisticsChart option={chart} label={t('admin.console.newUsers')} height={230} />
              </Box>
              <Box component="section" sx={section}>
                <Typography component="h2" variant="h6" sx={{ mb: 1.5 }}>
                  {t('admin.console.quickCreate')}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {quick
                    .map((key) => catalog.find((item) => item.key === key))
                    .filter((item) => item?.permissions.add)
                    .map(
                      (item) =>
                        item && (
                          <Button
                            key={item.key}
                            variant="outlined"
                            component={Link}
                            to={item.path + '/new'}
                            startIcon={<IconifyIcon icon="mdi:plus" />}
                            color="neutral"
                          >
                            {resourceTitle(t, item)}
                          </Button>
                        ),
                    )}
                </Stack>
                <Stack direction="row" gap={2} sx={{ mt: 3 }} alignItems="center">
                  <PatternArtwork kind="settings" sx={{ width: 100, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="body2">
                      {t('admin.console.availableSections', { count: data.resourceCount })}
                    </Typography>
                    <Button
                      component={Link}
                      to={resources.AdminCatalog}
                      sx={{ px: 0 }}
                      endIcon={<IconifyIcon icon="mdi:arrow-right" />}
                    >
                      {t('admin.console.exploreSections')}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1.35fr)' },
              }}
            >
              <Box
                component="section"
                sx={{ ...section, borderRight: { lg: '1px solid var(--kep-line)' } }}
              >
                <Typography component="h2" variant="h6">
                  {t('admin.console.upcoming')}
                </Typography>
                {!data.upcoming.length ? (
                  <EmptyState compact title={t('admin.console.noUpcoming')} kind="competitions" />
                ) : (
                  <Stack sx={{ mt: 1 }}>
                    {data.upcoming.map((item) => (
                      <Stack
                        key={item.resource + item.id}
                        component={Link}
                        to={item.path + '/' + encodeURIComponent(item.id)}
                        direction="row"
                        gap={2}
                        sx={{
                          py: 2,
                          borderBottom: 1,
                          borderColor: 'divider',
                          color: 'text.primary',
                          textDecoration: 'none',
                        }}
                      >
                        <IconifyIcon icon="mdi:calendar-outline" sx={{ color: 'primary.main' }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(item.at)}
                          </Typography>
                        </Box>
                        <IconifyIcon icon="mdi:arrow-top-right" sx={{ ml: 'auto' }} />
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
              <Box component="section" sx={section}>
                <Typography component="h2" variant="h6" mb={1}>
                  {t('admin.console.recentChanges')}
                </Typography>
                <AuditList entries={data.audit} />
              </Box>
            </Box>
          </>
        )
      )}
    </FramedPage>
  );
}
