import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { useAdminRegistry } from 'modules/admin/application';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import SearchTextField from 'shared/components/common/SearchTextField';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import WorkspaceHeader from '../../shared/components/WorkspaceHeader';
import { resourceTitle } from '../../shared/helpers';
import { isPrimaryResource } from '../../shared/helpers/resourcePresentation';

const groups = ['practice', 'competitions', 'community', 'economy', 'platform', 'system'];
export default function AdminCatalogPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useAdminRegistry();
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();
  const group = params.get('group') || 'all';
  const term = search.trim().toLocaleLowerCase();
  const rows = (data ?? []).filter(
    (item) =>
      (group === 'all' || group === item.group) &&
      `${resourceTitle(t, item)} ${item.name} ${item.key}`.toLocaleLowerCase().includes(term),
  );
  return (
    <FramedPage>
      <WorkspaceHeader
        title={t('admin.console.catalog')}
        backTo={resources.Admin}
        backLabel={t('admin.console.dashboard')}
      />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <SearchTextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch('')}
          placeholder={t('admin.workspace.searchSections')}
          slotProps={{
            htmlInput: { 'aria-label': t('admin.workspace.searchSections') },
          }}
        />
      </Box>
      <Tabs
        value={group}
        onChange={(_, value) => setParams(value === 'all' ? {} : { group: value })}
        variant="scrollable"
        aria-label={t('admin.console.sections')}
        sx={{
          px: { xs: 2, md: 3 },
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { fontSize: 13, minWidth: 0, px: 1.5 },
        }}
      >
        {['all', ...groups].map((value) => (
          <Tab
            key={value}
            value={value}
            label={t(
              value === 'all' ? 'admin.console.allSections' : `admin.console.groups.${value}`,
            )}
          />
        ))}
      </Tabs>
      <ConsoleError error={error} retry={() => void mutate()} />
      {isLoading ? (
        <ConsoleSkeleton kind="catalog" />
      ) : !rows.length ? (
        <EmptyState title={t('admin.console.noResults')} />
      ) : (
        groups
          .filter((value) => group === 'all' || group === value)
          .map((value) => {
            const items = rows.filter((item) => item.group === value);
            if (!items.length) return null;
            const primary = items.filter(isPrimaryResource);
            const supporting = items.filter((item) => !isPrimaryResource(item));
            return (
              <Box
                component="section"
                key={value}
                sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}
              >
                <Stack direction="row" gap={1} alignItems="center" mb={2}>
                  <Typography component="h2" variant="subtitle1" fontWeight={650}>
                    {t(`admin.console.groups.${value}`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {items.length}
                  </Typography>
                </Stack>
                {primary.length > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        xl: 'repeat(3, minmax(0, 1fr))',
                      },
                      gap: 1.5,
                      mb: supporting.length ? 3 : 0,
                    }}
                  >
                    {primary.map((item) => (
                      <Stack
                        key={item.key}
                        direction="row"
                        alignItems="center"
                        gap={1.5}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 2,
                          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                        }}
                      >
                        <IconifyIcon
                          icon={item.icon}
                          sx={{ color: 'primary.main', fontSize: 24 }}
                        />
                        <Button
                          component={Link}
                          to={item.path}
                          color="neutral"
                          sx={{ flex: 1, p: 0, justifyContent: 'flex-start', textAlign: 'left' }}
                        >
                          {resourceTitle(t, item)}
                        </Button>
                        {item.permissions.add ? (
                          <Tooltip title={t('admin.actions.create')}>
                            <IconButton
                              component={Link}
                              to={item.path + '/new'}
                              size="small"
                              aria-label={t('admin.console.createRecord', {
                                name: resourceTitle(t, item),
                              })}
                            >
                              <IconifyIcon icon="mdi:plus" />
                            </IconButton>
                          </Tooltip>
                        ) : !item.permissions.change ? (
                          <Chip size="small" variant="soft" label={t('admin.console.readOnly')} />
                        ) : null}
                      </Stack>
                    ))}
                  </Box>
                )}
                {supporting.length > 0 && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      {t('admin.workspace.supporting')}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: 'repeat(2, minmax(0, 1fr))',
                          xl: 'repeat(3, minmax(0, 1fr))',
                        },
                        columnGap: 3,
                      }}
                    >
                      {supporting.map((item) => (
                        <Button
                          key={item.key}
                          component={Link}
                          to={item.path}
                          color="neutral"
                          endIcon={<IconifyIcon icon="mdi:chevron-right" sx={{ ml: 'auto' }} />}
                          sx={{
                            justifyContent: 'space-between',
                            borderBottom: 1,
                            borderColor: 'divider',
                            borderRadius: 0,
                            py: 1.25,
                            px: 0,
                            fontSize: 13,
                            textAlign: 'left',
                            fontWeight: 500,
                          }}
                        >
                          {resourceTitle(t, item)}
                        </Button>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            );
          })
      )}
    </FramedPage>
  );
}
