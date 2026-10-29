import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router';
import { Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { previewAdminAction, useAdminList } from 'modules/admin/application';
import type { AdminActionPreview } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ActionDialog from '../../shared/components/ActionDialog';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import { actionTitle, resourceTitle } from '../../shared/helpers';
import ResourceFilters from './components/ResourceFilters';
import ResourceTable from './components/ResourceTable';

export default function AdminResourceListPage() {
  const { app = '', model = '' } = useParams();
  return <ResourceList key={app + '.' + model} resourceKey={app + '.' + model} />;
}

function ResourceList({ resourceKey }: { resourceKey: string }) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(
    Array.from(params.entries())
      .filter(([key]) => key.startsWith('filter.'))
      .map(([key, value]) => [key.slice(7), value]),
  );
  const query = {
    queue: params.get('queue') || undefined,
    search: params.get('search') || '',
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: Number(params.get('pageSize')) || 20,
    ordering: params.get('ordering') || '',
    filters,
  };
  const { data, error, isLoading, isValidating, mutate } = useAdminList(resourceKey, query);
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<AdminActionPreview | null>(null);
  const [actionError, setActionError] = useState<unknown>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const update = (name: string, value: string) => {
    setSelected([]);
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(name, value);
      else next.delete(name);
      if (name !== 'page') next.delete('page');
      return next;
    });
  };
  const prepare = async (action: string, ids = selected) => {
    setActionBusy(true);
    setActionError(null);
    try {
      setPreview(await previewAdminAction(resourceKey, action, ids));
    } catch (failure) {
      setActionError(failure);
    } finally {
      setActionBusy(false);
    }
  };
  const permissions = data?.resource.permissions;
  return (
    <FramedPage>
      <PageHeader
        title={data ? resourceTitle(t, data.resource) : t('admin.console.loading')}
        backTo={resources.AdminCatalog}
        backLabel={t('admin.console.catalog')}
        actionComponent={
          <Stack direction="row" gap={1} flexWrap="wrap">
            {resourceKey === 'marketplace.marketplaceorder' &&
              currentUser?.isSuperuser &&
              permissions?.change && (
                <Button
                  component={Link}
                  to={resources.AdminImportOrder}
                  variant="outlined"
                  startIcon={<IconifyIcon icon="mdi:package-variant-plus" />}
                >
                  {t('admin.console.importOrder')}
                </Button>
              )}
            {permissions?.add && (
              <Button
                component={Link}
                to={data!.resource.path + '/new'}
                variant="contained"
                startIcon={<IconifyIcon icon="mdi:plus" />}
              >
                {t('admin.actions.create')}
              </Button>
            )}
          </Stack>
        }
      />
      <ResourceFilters
        resourceKey={resourceKey}
        fields={data?.filters ?? []}
        query={query}
        onChange={update}
        onReset={() => {
          const next = new URLSearchParams(params);
          Array.from(next.keys())
            .filter((key) => key.startsWith('filter.'))
            .forEach((key) => next.delete(key));
          next.delete('page');
          next.delete('queue');
          setParams(next);
          setSelected([]);
        }}
      />
      {isValidating && !isLoading && <LinearProgress sx={{ height: 2 }} />}
      <ConsoleError error={error || actionError} retry={() => void mutate()} />
      {selected.length > 0 && (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          flexWrap="wrap"
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            bgcolor: 'action.selected',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Chip
            size="small"
            label={t('admin.selectedRows', { count: selected.length })}
            onDelete={() => setSelected([])}
          />
          {data?.actions.map((action) => (
            <Button
              key={action.name}
              size="small"
              color={action.dangerous ? 'error' : 'primary'}
              loading={actionBusy}
              onClick={() => void prepare(action.name)}
            >
              {actionTitle(t, action.name, action.label)}
            </Button>
          ))}
        </Stack>
      )}
      {isLoading ? (
        <ConsoleSkeleton />
      ) : (
        data &&
        !error && (
          <>
            {!data.rows.length ? (
              <EmptyState
                title={t('admin.console.noResults')}
                description={t('admin.console.tryFilters')}
                action={
                  <Button onClick={() => setParams({})}>{t('admin.console.resetFilters')}</Button>
                }
              />
            ) : (
              <ResourceTable
                data={data}
                selected={selected}
                setSelected={setSelected}
                ordering={query.ordering}
                onOrderingChange={(value) => update('ordering', value)}
              />
            )}
            <ListPagination
              count={data.pagesCount}
              page={data.page}
              onChange={(value) => update('page', String(value))}
            />
            <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                {t('admin.console.recordCount', { count: data.total })}
              </Typography>
            </Box>
          </>
        )
      )}
      <ActionDialog
        resourceKey={resourceKey}
        preview={preview}
        onClose={() => setPreview(null)}
        onComplete={() => {
          setSelected([]);
          void mutate();
        }}
      />
    </FramedPage>
  );
}
