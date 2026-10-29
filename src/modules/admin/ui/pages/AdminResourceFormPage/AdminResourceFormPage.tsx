import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Button } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { useAdminDetail } from 'modules/admin/application';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import RecordEditor from './components/RecordEditor';

export default function AdminResourceFormPage() {
  const { currentUser } = useAuth();
  const { app = '', model = '', id } = useParams();
  const actor = currentUser?.id ?? currentUser?.username ?? 'anonymous';
  const identity = JSON.stringify([
    actor,
    currentUser?.isSuperuser,
    currentUser?.isStaff,
    app,
    model,
    id,
  ]);
  return <ResourceForm key={identity} app={app} model={model} id={id} />;
}

function ResourceForm({ app, model, id }: { app: string; model: string; id?: string }) {
  const { t } = useTranslation();
  const resourceKey = app + '.' + model;
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
        <Button component={Link} to={resources.AdminManage + '/' + app + '/' + model} sx={{ m: 2 }}>
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
