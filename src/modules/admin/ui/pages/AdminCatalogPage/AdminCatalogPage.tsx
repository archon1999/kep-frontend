import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Box, Button, Chip, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useAdminRegistry } from 'modules/admin/application';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import { resourceTitle } from '../../shared/helpers';

export default function AdminCatalogPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useAdminRegistry();
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const groups = ['practice', 'competitions', 'community', 'economy', 'platform', 'system'];
  const term = search.trim().toLocaleLowerCase();
  const rows = (data ?? []).filter(
    (item) =>
      (group === 'all' || group === item.group) &&
      `${resourceTitle(t, item)} ${item.name} ${item.key}`.toLocaleLowerCase().includes(term),
  );
  return (
    <FramedPage>
      <PageHeader
        title={t('admin.console.catalog')}
        backTo={resources.Admin}
        backLabel={t('admin.console.dashboard')}
      />
      <Stack spacing={2} sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          autoFocus
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('admin.console.findSection')}
          inputProps={{ 'aria-label': t('admin.console.findSection') }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="mdi:magnify" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" gap={1} flexWrap="wrap">
          {['all', ...groups].map((value) => (
            <Chip
              key={value}
              label={t(
                value === 'all' ? 'admin.console.allSections' : `admin.console.groups.${value}`,
              )}
              color={group === value ? 'primary' : 'neutral'}
              variant="soft"
              onClick={() => setGroup(value)}
              sx={{ minHeight: 32 }}
            />
          ))}
        </Stack>
      </Stack>
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
            return (
              <Box
                key={value}
                component="section"
                sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                  {t(`admin.console.groups.${value}`)}
                </Typography>
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
                  {items.map((item) => (
                    <Button
                      key={item.key}
                      component={Link}
                      to={item.path}
                      variant="outlined"
                      color="neutral"
                      sx={{
                        borderRadius: 0,
                        borderColor: 'divider',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        px: 2,
                        py: 2,
                        gap: 1.5,
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <IconifyIcon icon={item.icon} sx={{ color: 'primary.main', fontSize: 23 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600}>{resourceTitle(t, item)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(
                            item.permissions.change
                              ? 'admin.console.manageRecords'
                              : 'admin.console.readOnly',
                          )}
                        </Typography>
                      </Box>
                      <IconifyIcon icon="mdi:arrow-top-right" />
                    </Button>
                  ))}
                </Box>
              </Box>
            );
          })
      )}
    </FramedPage>
  );
}
