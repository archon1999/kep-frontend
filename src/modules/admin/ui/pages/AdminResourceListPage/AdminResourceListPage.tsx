import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { useAdminRegistry } from 'modules/admin/application';
import { useAdminResourceList } from 'modules/admin/application/useAdminResourceList';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import ActionDialog from '../../shared/components/ActionDialog';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import ContestReplyDialog from '../../shared/components/ContestReplyDialog';
import PasswordDialog from '../../shared/components/PasswordDialog';
import ProblemRatingDialog from '../../shared/components/ProblemRatingDialog';
import ResourceActions from '../../shared/components/ResourceActions';
import ResourceRelatedTabs from '../../shared/components/ResourceRelatedTabs';
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
  const { data: catalog = [] } = useAdminRegistry();
  const [passwordId, setPasswordId] = useState<string | null>(null);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
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
  const shownResource = data?.resource ?? catalog.find((item) => item.key === resourceKey);
  return (
    <FramedPage>
      <WorkspaceHeader
        title={
          shownResource
            ? resourceTitle(t, shownResource)
            : t(error ? 'admin.console.unavailable' : 'admin.console.loading')
        }
        icon={shownResource?.icon}
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
      <ResourceRelatedTabs resourceKey={resourceKey} />
      {Boolean(data?.summary?.length) && (
        <Stack
          direction="row"
          gap={3}
          sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          {data!.summary!.map((metric) => (
            <Box key={metric.key}>
              <Typography variant="caption" color="text.secondary">
                {t('admin.workspace.totals.' + metric.key)}
              </Typography>
              {metric.key === 'users' ? (
                <Typography fontWeight={650}>{metric.value}</Typography>
              ) : (
                <KepcoinValue value={metric.value} iconSize={20} />
              )}
            </Box>
          ))}
        </Stack>
      )}
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
                onPassword={(row) => setPasswordId(row.id)}
                onReply={(row) => setReplyId(row.id)}
                onRating={(row) => setRatingId(row.id)}
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
      {passwordId && (
        <PasswordDialog
          id={passwordId}
          username={data?.rows.find((row) => row.id === passwordId)?.label}
          open
          onClose={(changed) => {
            setPasswordId(null);
            if (changed) void mutate();
          }}
        />
      )}
      {ratingId && (
        <ProblemRatingDialog
          id={ratingId}
          onClose={(changed) => {
            setRatingId(null);
            if (changed) void mutate();
          }}
        />
      )}
      {replyId && (
        <ContestReplyDialog
          id={replyId}
          onClose={(changed) => {
            setReplyId(null);
            if (changed) void mutate();
          }}
        />
      )}
    </FramedPage>
  );
}
