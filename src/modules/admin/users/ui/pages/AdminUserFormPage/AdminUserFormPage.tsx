import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, CircularProgress, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import { fromDateTimeLocal, toDateTimeLocal, toNumberOrNull } from 'modules/admin/shared/ui/formUtils';
import { useAdminUser } from 'modules/admin/users/application/queries';
import { usersAdminClient } from 'modules/admin/users/data-access/usersAdminClient';
import { AdminUserPayload } from 'modules/admin/users/domain/types';

const emptyUser: AdminUserPayload = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  isActive: true,
  isStaff: false,
  isSuperuser: false,
  skillsRating: 0,
  activityRating: 0,
  kepcoin: 0,
  streak: 0,
  maxStreak: 0,
  lastSeen: '',
  canCreateProblems: false,
  canChangeProblemSimilar: false,
  canChangeProblemTags: false,
  canUseCheckSamples: false,
  password: '',
};

const AdminUserFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: user, isLoading } = useAdminUser(id);
  const [form, setForm] = useState<AdminUserPayload>(emptyUser);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        lastSeen: toDateTimeLocal(user.lastSeen),
        password: '',
      });
    }
  }, [user]);

  const setField = <K extends keyof AdminUserPayload>(field: K, value: AdminUserPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStringField =
    (field: keyof AdminUserPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleNumberField =
    (field: keyof AdminUserPayload) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: toNumberOrNull(event.target.value) ?? 0 }));
    };

  const buildPayload = () => {
    const payload: AdminUserPayload = {
      ...form,
      firstName: form.firstName ?? '',
      lastName: form.lastName ?? '',
      email: form.email ?? '',
      lastSeen: form.lastSeen ? fromDateTimeLocal(form.lastSeen) : undefined,
      password: form.password || undefined,
    };

    if (!payload.password) {
      delete payload.password;
    }

    return payload;
  };

  const handleSave = async () => {
    const payload = buildPayload();

    if (!payload.username) {
      setError(t('admin.form.validation.usernameRequired'));
      return;
    }

    if (!isEdit && !payload.password) {
      setError(t('admin.form.validation.passwordRequired'));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await usersAdminClient.update(id, payload);
      } else {
        await usersAdminClient.create(payload);
      }
      navigate(resources.AdminUsers);
    } catch (caughtError: any) {
      setError(JSON.stringify(caughtError?.data ?? caughtError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm(t('admin.users.confirmDelete', { username: form.username || id }))) {
      return;
    }

    await usersAdminClient.remove(id);
    navigate(resources.AdminUsers);
  };

  if (isEdit && isLoading && !user) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <AdminFormPageLayout
      title={isEdit ? t('admin.users.editTitle', { id }) : t('admin.users.createTitle')}
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
            label={isEdit ? t('admin.form.fields.newPassword') : t('admin.form.fields.password')}
            type="password"
            value={form.password ?? ''}
            onChange={handleStringField('password')}
            fullWidth
          />
          <Stack spacing={0.5}>
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={(event) => setField('isActive', event.target.checked)} />}
              label={t('admin.form.fields.active')}
            />
            <FormControlLabel
              control={<Switch checked={form.isStaff} onChange={(event) => setField('isStaff', event.target.checked)} />}
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
        <TextField
          label={t('admin.form.fields.lastSeen')}
          type="datetime-local"
          value={form.lastSeen ?? ''}
          onChange={handleStringField('lastSeen')}
          slotProps={{ inputLabel: { shrink: true } }}
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
  );
};

export default AdminUserFormPage;
