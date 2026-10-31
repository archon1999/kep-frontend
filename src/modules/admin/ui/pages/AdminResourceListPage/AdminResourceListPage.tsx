import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Button, Chip, LinearProgress, Stack } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { useAdminResourceList } from 'modules/admin/application/useAdminResourceList';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import ActionDialog from '../../shared/components/ActionDialog';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import ResourceActions from '../../shared/components/ResourceActions';
import WorkspaceHeader from '../../shared/components/WorkspaceHeader';
import { resourceTitle } from '../../shared/helpers';
import ResourceFilters, { PageSizeControl } from './components/ResourceFilters';
import ResourceTable from './components/ResourceTable';

export default function AdminResourceListPage() {
  const { app = '', model = '' } = useParams();
  return <ResourceList key={app + '.' + model} resourceKey={app + '.' + model} />;
}

function ResourceList({ resourceKey }: { resourceKey: string }) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    query,
    update,
    reset,
    selected,
    setSelected,
    preview,
    setPreview,
    actionError,
    actionBusy,
    prepare,
  } = useAdminResourceList(resourceKey);
  const permissions = data?.resource.permissions;
  return (
    <FramedPage>
      <WorkspaceHeader
        title={data ? resourceTitle(t, data.resource) : t('admin.console.loading')}
        icon={data?.resource.icon}
        children={
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
        onReset={reset}
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
          <ResourceActions
            actions={data?.actions ?? []}
            busy={actionBusy || isValidating}
            onAction={(action) => void prepare(action)}
          />
          <Button size="small" color="neutral" onClick={() => setSelected([])}>
            {t('admin.actions.clearSelection')}
          </Button>
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
                title={t(
                  query.search || query.queue || Object.keys(query.filters).length
                    ? 'admin.console.noResults'
                    : 'admin.workspace.emptyRecords',
                )}
                description={
                  query.search || query.queue || Object.keys(query.filters).length
                    ? t('admin.console.tryFilters')
                    : undefined
                }
                action={
                  query.search || query.queue || Object.keys(query.filters).length ? (
                    <Button onClick={reset}>{t('admin.console.resetFilters')}</Button>
                  ) : permissions?.add ? (
                    <Button
                      component={Link}
                      to={data.resource.path + '/new'}
                      variant="contained"
                      startIcon={<IconifyIcon icon="mdi:plus" />}
                    >
                      {t('admin.workspace.addFirst')}
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <ResourceTable
                data={data}
                selected={selected}
                setSelected={setSelected}
                ordering={query.ordering}
                onOrderingChange={(value) => update('ordering', value)}
                onAction={(action, ids) => void prepare(action, ids)}
                busy={actionBusy || isValidating}
              />
            )}
            <ListPagination
              count={data.pagesCount}
              page={data.page}
              onChange={(value) => update('page', String(value))}
            />
            {(data.total > 20 || query.pageSize > 20) && (
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  px: 2,
                  py: 1.5,
                  borderTop: '1px solid var(--kep-line)',
                }}
              >
                <PageSizeControl
                  value={data.pageSize}
                  onChange={(value) => update('pageSize', value)}
                />
              </Stack>
            )}
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
