import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Button } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useAdminDetail } from 'modules/admin/application';
import type { AdminResource } from 'modules/admin/domain';
import FramedPage from 'shared/components/sections/common/FramedPage';
import AdminResourceRoute from '../../shared/components/AdminResourceRoute';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import RecordEditor from './components/RecordEditor';

export default function AdminResourceFormPage() {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const actor = currentUser?.id ?? currentUser?.username ?? 'anonymous';
  return (
    <AdminResourceRoute form>
      {(resource) => (
        <ResourceForm
          key={JSON.stringify([
            actor,
            currentUser?.isSuperuser,
            currentUser?.isStaff,
            resource.key,
            id,
          ])}
          resource={resource}
          id={id}
        />
      )}
    </AdminResourceRoute>
  );
}

function ResourceForm({ resource, id }: { resource: AdminResource; id?: string }) {
  const { t } = useTranslation();
  const resourceKey = resource.key;
  const { data, error, mutate } = useAdminDetail(resourceKey, id);
  const [reloading, setReloading] = useState(false);
  const reload = () => {
    setReloading(true);
    void mutate()
      .catch(() => undefined)
      .finally(() => setReloading(false));
  };
  if (error && !data)
    return (
      <FramedPage>
        <ConsoleError error={error} retry={() => void mutate()} />
        <Button component={Link} to={resource.path} sx={{ m: 2 }}>
          {t('admin.actions.cancel')}
        </Button>
      </FramedPage>
    );
  if (reloading || !data)
    return (
      <FramedPage>
        <ConsoleSkeleton kind="form" header />
      </FramedPage>
    );
  return (
    <RecordEditor
      resourceKey={resourceKey}
      initial={data}
      metadataError={error}
      retryMetadata={() => void mutate()}
      reload={reload}
    />
  );
}
