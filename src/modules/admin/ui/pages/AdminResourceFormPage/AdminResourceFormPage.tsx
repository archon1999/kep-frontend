import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Button } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useAdminDetail } from 'modules/admin/application';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import RecordEditor from './components/RecordEditor';

export default function AdminResourceFormPage() {
  const { t } = useTranslation();
  const { app = '', model = '', id } = useParams();
  const resourceKey = app + '.' + model;
  const { data, isLoading, error, mutate } = useAdminDetail(resourceKey, id);
  const [reloading, setReloading] = useState(false);
  const reload = () => {
    setReloading(true);
    void mutate()
      .catch(() => undefined)
      .finally(() => setReloading(false));
  };
  if (error)
    return (
      <FramedPage>
        <ConsoleError error={error} retry={() => void mutate()} />
        <Button component={Link} to={resources.AdminManage + '/' + app + '/' + model} sx={{ m: 2 }}>
          {t('admin.actions.cancel')}
        </Button>
      </FramedPage>
    );
  if (isLoading || reloading || !data)
    return (
      <FramedPage>
        <ConsoleSkeleton kind="form" header />
      </FramedPage>
    );
  return (
    <RecordEditor
      key={resourceKey + (id ?? 'new') + data.revision}
      resourceKey={resourceKey}
      initial={data}
      reload={reload}
    />
  );
}
