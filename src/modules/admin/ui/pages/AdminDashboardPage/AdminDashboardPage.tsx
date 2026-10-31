import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useAdminDashboard, useAdminRegistry } from 'modules/admin/application';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { formatDateTime } from 'shared/lib/dateTime';
import AuditList from '../../shared/components/AuditList';
import { ConsoleError } from '../../shared/components/ConsoleState';
import WorkspaceHeader from '../../shared/components/WorkspaceHeader';
import { resourceTitle } from '../../shared/helpers';
import DashboardSkeleton from './components/DashboardSkeleton';
import DashboardUserActivity from './components/DashboardUserActivity';

const section = { p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider', minWidth: 0 };

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation();
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
  return (
    <FramedPage>
      <WorkspaceHeader
        title={t('admin.console.dashboard')}
        icon="mdi:view-dashboard-outline"
        subtitle={new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }).format(new Date())}
      >
        <Tooltip title={t('admin.console.retry')}>
          <IconButton onClick={() => void mutate()} aria-label={t('admin.console.retry')}>
            <IconifyIcon icon="mdi:refresh" />
          </IconButton>
        </Tooltip>
        <Button
          variant="outlined"
          component={Link}
          to={resources.AdminCatalog}
          startIcon={<IconifyIcon icon="mdi:view-grid-outline" />}
        >
          {t('admin.console.catalog')}
        </Button>
      </WorkspaceHeader>
      <ConsoleError error={error} retry={() => void mutate()} />
      {isLoading ? (
        <DashboardSkeleton />
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
                <Stack
                  key={metric.key}
                  component={Link}
                  to={metric.path}
                  direction="row"
                  gap={1.5}
                  alignItems="center"
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: 2,
                    color: 'text.primary',
                    textDecoration: 'none',
                    borderRight: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box
                    sx={{ width: 24, height: 24, flexShrink: 0, color: 'primary.main' }}
                    aria-hidden="true"
                  >
                    <IconifyIcon icon={metric.icon} sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t(`admin.console.metrics.${metric.key}`)}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--kep-display-font)',
                        fontFeatureSettings: '"ss01" 1',
                        fontSize: 26,
                        lineHeight: 1.4,
                      }}
                    >
                      {metric.value.toLocaleString(i18n.resolvedLanguage)}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              flexWrap="wrap"
              sx={{ ...section, py: 2 }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                {t('admin.console.quickCreate')}
              </Typography>
              {quick
                .map((key) => catalog.find((item) => item.key === key))
                .filter((item) => item?.permissions.add)
                .map(
                  (item) =>
                    item && (
                      <Button
                        key={item.key}
                        size="small"
                        variant="outlined"
                        color="neutral"
                        component={Link}
                        to={item.path + '/new'}
                        startIcon={<IconifyIcon icon="mdi:plus" />}
                      >
                        {resourceTitle(t, item)}
                      </Button>
                    ),
                )}
            </Stack>
            <Box component="section" sx={section}>
              <Stack direction="row" gap={1.5} alignItems="center" mb={2}>
                <Typography component="h2" variant="h6" sx={{ flex: 1 }}>
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
                {[...data.queues]
                  .sort((a, b) => Number(b.count > 0) - Number(a.count > 0))
                  .map((queue) => (
                    <Box
                      key={queue.key}
                      sx={{
                        border: 1,
                        borderColor: queue.count ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Stack
                        component={Link}
                        to={queue.path}
                        direction="row"
                        gap={1.5}
                        alignItems="center"
                        sx={{
                          p: 2,
                          textDecoration: 'none',
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <IconifyIcon
                          icon={queue.icon}
                          sx={{
                            color: queue.count ? 'primary.main' : 'text.disabled',
                            fontSize: 23,
                          }}
                        />
                        <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                          {t(`admin.console.queues.${queue.key}`)}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'var(--kep-display-font)',
                            fontFeatureSettings: '"ss01" 1',
                            fontSize: 24,
                            color: queue.count ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {queue.count}
                        </Typography>
                        <IconifyIcon
                          icon="mdi:chevron-right"
                          sx={{ color: 'text.secondary', fontSize: 18 }}
                        />
                      </Stack>
                      {queue.records.length ? (
                        <Stack sx={{ px: 2, pb: 1 }}>
                          {queue.records.map((row) => (
                            <Typography
                              component={Link}
                              key={row.id}
                              to={`${resources.AdminManage}/${queue.resource.replace('.', '/')}/${encodeURIComponent(row.id)}`}
                              variant="caption"
                              noWrap
                              sx={{
                                py: 0.75,
                                color: 'text.secondary',
                                textDecoration: 'none',
                                borderTop: 1,
                                borderColor: 'divider',
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {row.label}
                            </Typography>
                          ))}
                        </Stack>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', px: 2, pb: 1.5 }}
                        >
                          {t('admin.console.allClear')}
                        </Typography>
                      )}
                    </Box>
                  ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: data.userActivity ? 'minmax(0, 1.7fr) minmax(0, 1fr)' : '1fr',
                },
              }}
            >
              {data.userActivity && (
                <Box
                  component="section"
                  sx={{ ...section, borderRight: { lg: '1px solid var(--kep-line)' } }}
                >
                  <DashboardUserActivity
                    data={data.userActivity}
                    dates={data.activity.map((day) => day.date)}
                  />
                </Box>
              )}
              <Box component="section" sx={section}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography component="h2" variant="h6">
                    {t('admin.console.upcoming')}
                  </Typography>
                  <PatternArtwork kind="competitions" sx={{ width: 66 }} />
                </Stack>
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
                        gap={1.5}
                        sx={{
                          py: 1.5,
                          borderBottom: 1,
                          borderColor: 'divider',
                          color: 'text.primary',
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        <IconifyIcon icon="mdi:calendar-outline" sx={{ color: 'primary.main' }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(item.at)}
                          </Typography>
                        </Box>
                        <IconifyIcon icon="mdi:arrow-top-right" />
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
            <Box component="section" sx={section}>
              <Typography component="h2" variant="h6" mb={1}>
                {t('admin.console.recentChanges')}
              </Typography>
              <AuditList entries={data.audit} />
            </Box>
          </>
        )
      )}
    </FramedPage>
  );
}
