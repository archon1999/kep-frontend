import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Button } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { useAdminRegistry } from 'modules/admin/application';
import type { AdminResource } from 'modules/admin/domain';
import EmptyState from 'shared/components/common/EmptyState';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { ConsoleError, ConsoleSkeleton } from './ConsoleState';

/** The permission-scoped registry owns the slug-to-model mapping. */
export default function AdminResourceRoute({
  children,
  resourceKey,
  form = false,
}: {
  children: (resource: AdminResource) => ReactNode;
  resourceKey?: string;
  form?: boolean;
}) {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { resourceSlug, app, model } = useParams();
  const { data, error, mutate } = useAdminRegistry();
  const owner = JSON.stringify([
    currentUser?.id ?? currentUser?.username,
    currentUser?.isSuperuser,
    currentUser?.isStaff,
  ]);
  const previous = useRef<{ owner: string; data: AdminResource[] } | null>(null);
  if (data) previous.current = { owner, data };
  // Locale metadata can refresh while a form contains an unsaved draft.
  // Keep that editor mounted, while never carrying a registry across accounts.
  const catalog = data ?? (previous.current?.owner === owner ? previous.current.data : undefined);
  const key = resourceKey || (app && model ? app + '.' + model : undefined);
  const resource = catalog?.find((item) =>
    key ? item.key === key : item.path === `${resources.Admin}/${resourceSlug}`,
  );
  if (error && !catalog)
    return (
      <FramedPage>
        <ConsoleError error={error} retry={() => void mutate()} />
      </FramedPage>
    );
  if (!catalog)
    return (
      <FramedPage>
        <ConsoleSkeleton kind={form ? 'form' : 'list'} header />
      </FramedPage>
    );
  if (!resource)
    return (
      <FramedPage>
        <EmptyState
          title={t('admin.console.unavailable')}
          action={
            <Button component={Link} to={resources.AdminCatalog}>
              {t('admin.actions.backToList')}
            </Button>
          }
        />
      </FramedPage>
    );
  return (
    <>
      {error && <ConsoleError error={error} retry={() => void mutate()} />}
      {children(resource)}
    </>
  );
}
