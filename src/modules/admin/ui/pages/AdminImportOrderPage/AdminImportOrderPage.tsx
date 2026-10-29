import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Alert, Box, Button, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { importAdminOrder, useAdminWorkflow } from 'modules/admin/application';
import type { AdminWorkflowForm } from 'modules/admin/domain';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { ConsoleError, ConsoleSkeleton } from '../../shared/components/ConsoleState';
import SchemaField from '../../shared/components/SchemaField';
import { getFieldErrors } from '../../shared/helpers';

const listPath = resources.AdminManage + '/marketplace/marketplaceorder';
export default function AdminImportOrderPage() {
  const { data, error, isLoading } = useAdminWorkflow();
  return (
    <FramedPage>
      <ConsoleError error={error} />
      {isLoading ? <ConsoleSkeleton kind="form" header /> : data && <ImportForm form={data} />}
    </FramedPage>
  );
}
function ImportForm({ form }: { form: AdminWorkflowForm }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [values, setValues] = useState(form.values);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const order = await importAdminOrder({ values });
      navigate(`${listPath}/${order.id}`);
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };
  const errors = getFieldErrors(error);
  return (
    <Box component="form" onSubmit={submit} noValidate>
      <PageHeader
        title={t('admin.console.importOrder')}
        backTo={listPath}
        backLabel={t('admin.console.orders')}
      />
      <Alert severity="info" sx={{ m: 3 }}>
        {t('admin.console.importOrderHelp')}
      </Alert>
      <ConsoleError error={error} />
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {form.fields.map((field) => (
          <SchemaField
            key={field.name}
            resourceKey="marketplace.marketplaceorder"
            field={field}
            value={values[field.name]}
            values={values}
            selected={form.selectedOptions[field.name]}
            error={errors[field.name]}
            disabled={busy}
            onChange={(value) => setValues((current) => ({ ...current, [field.name]: value }))}
          />
        ))}
      </Box>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}
      >
        <Button type="submit" loading={busy} variant="contained">
          {t('admin.console.importOrder')}
        </Button>
      </Stack>
    </Box>
  );
}
