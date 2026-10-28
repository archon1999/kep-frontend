import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, CircularProgress, FormControlLabel, Stack, Switch } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { resources } from 'app/routes/resources';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import TextField from 'modules/admin/shared/ui/AdminTextField';
import { toNumberOrNull } from 'modules/admin/shared/utils/formUtils';
import { useAdminUserFormPage } from 'modules/admin/users/application/hooks/useAdminUserFormPage';
import { AdminUserPayload } from 'modules/admin/users/domain/types';
import { useConfirmationDialog } from 'shared/hooks/useConfirmationDialog';
import { parseDateTimePickerValue } from 'shared/lib/dateTime';

const AdminUserFormPage = () => {
  const { confirm, confirmationDialog } = useConfirmationDialog();
  const {
    user,
    isLoading,
    handleSave,
    handleDelete,
    isEdit,
    error,
    isSaving,
    form,
    setForm,
    pageTitle,
    setField,
    handleDateTimeField,
  } = useAdminUserFormPage(confirm);

  const { t } = useTranslation();

  const handleStringField =
    (field: keyof AdminUserPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleNumberField =
    (field: keyof AdminUserPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: toNumberOrNull(event.target.value) ?? 0 }));
    };

  const parseDateTimeValue = (value?: string) => parseDateTimePickerValue(value);

  if (isEdit && isLoading && !user) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      {confirmationDialog}
      {
        <AdminFormPageLayout
          title={pageTitle}
          listPath={resources.AdminUsers}
          isEdit={isEdit}
          isSaving={isSaving}
          onSave={handleSave}
          onDelete={handleDelete}
          sidebarTitle={t('admin.form.sections.userSettings')}
          sidebar={
            <Stack spacing={2.5}>
              <TextField
                label={t('admin.form.fields.username')}
                value={form.username}
                onChange={handleStringField('username')}
                fullWidth
              />
              <TextField
                label={
                  isEdit ? t('admin.form.fields.newPassword') : t('admin.form.fields.password')
                }
                type="password"
                value={form.password ?? ''}
                onChange={handleStringField('password')}
                fullWidth
              />
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(event) => setField('isActive', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.active')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isStaff}
                      onChange={(event) => setField('isStaff', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.staff')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isSuperuser}
                      onChange={(event) => setField('isSuperuser', event.target.checked)}
                    />
                  }
                  label={t('admin.form.fields.superuser')}
                />
              </Stack>
            </Stack>
          }
        >
          {error ? <Alert severity="error">{error}</Alert> : null}

          <AdminFormSection title={t('admin.form.sections.identity')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label={t('admin.form.fields.firstName')}
                value={form.firstName ?? ''}
                onChange={handleStringField('firstName')}
                fullWidth
              />
              <TextField
                label={t('admin.form.fields.lastName')}
                value={form.lastName ?? ''}
                onChange={handleStringField('lastName')}
                fullWidth
              />
              <TextField
                label={t('admin.form.fields.email')}
                value={form.email ?? ''}
                onChange={handleStringField('email')}
                fullWidth
              />
            </Stack>
            <DateTimePicker
              label={t('admin.form.fields.lastSeen')}
              value={parseDateTimeValue(form.lastSeen ?? '')}
              onChange={handleDateTimeField('lastSeen')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  InputLabelProps: { shrink: Boolean(form.lastSeen) },
                },
                popper: { placement: 'bottom-start' },
              }}
            />
          </AdminFormSection>

          <AdminFormSection title={t('admin.form.sections.counters')}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label={t('admin.form.fields.kepcoin')}
                type="number"
                value={form.kepcoin}
                onChange={handleNumberField('kepcoin')}
                fullWidth
              />
              <TextField
                label={t('admin.form.fields.streak')}
                type="number"
                value={form.streak}
                onChange={handleNumberField('streak')}
                fullWidth
              />
              <TextField
                label={t('admin.form.fields.maxStreak')}
                type="number"
                value={form.maxStreak}
                onChange={handleNumberField('maxStreak')}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label={t('admin.form.fields.skillsRating')}
                type="number"
                value={form.skillsRating}
                onChange={handleNumberField('skillsRating')}
                fullWidth
              />
              <TextField
                label={t('admin.form.fields.activityRating')}
                type="number"
                value={form.activityRating}
                onChange={handleNumberField('activityRating')}
                fullWidth
              />
            </Stack>
          </AdminFormSection>

          <AdminFormSection title={t('admin.form.sections.problemPermissions')}>
            <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.canCreateProblems}
                    onChange={(event) => setField('canCreateProblems', event.target.checked)}
                  />
                }
                label={t('admin.form.fields.canCreateProblems')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.canChangeProblemSimilar}
                    onChange={(event) => setField('canChangeProblemSimilar', event.target.checked)}
                  />
                }
                label={t('admin.form.fields.canChangeSimilar')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.canChangeProblemTags}
                    onChange={(event) => setField('canChangeProblemTags', event.target.checked)}
                  />
                }
                label={t('admin.form.fields.canChangeTags')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.canUseCheckSamples}
                    onChange={(event) => setField('canUseCheckSamples', event.target.checked)}
                  />
                }
                label={t('admin.form.fields.canUseCheckSamples')}
              />
            </Stack>
          </AdminFormSection>
        </AdminFormPageLayout>
      }
    </>
  );
};

export default AdminUserFormPage;
