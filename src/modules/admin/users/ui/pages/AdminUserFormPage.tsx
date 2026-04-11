import { ChangeEvent, useEffect, useState } from 'react';
import { Alert, CircularProgress, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import AdminFormPageLayout from 'modules/admin/shared/ui/AdminFormPageLayout';
import AdminFormSection from 'modules/admin/shared/ui/AdminFormSection';
import { fromDateTimeLocal, toDateTimeLocal, toNumberOrNull } from 'modules/admin/shared/ui/formUtils';
import { useAdminUser } from '../../application/queries';
import { usersAdminClient } from '../../data-access/usersAdminClient';
import { AdminUserPayload } from '../../domain/types';

const emptyUser: AdminUserPayload = {
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  is_active: true,
  is_staff: false,
  is_superuser: false,
  kepcoin: 0,
  streak: 0,
  max_streak: 0,
  last_seen: '',
  can_create_problems: false,
  can_change_problem_similar: false,
  can_change_problem_tags: false,
  can_use_check_samples: false,
  password: '',
};

const AdminUserFormPage = () => {
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
        last_seen: toDateTimeLocal(user.last_seen),
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
      first_name: form.first_name ?? '',
      last_name: form.last_name ?? '',
      email: form.email ?? '',
      last_seen: form.last_seen ? fromDateTimeLocal(form.last_seen) : undefined,
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
      setError('Username is required.');
      return;
    }

    if (!isEdit && !payload.password) {
      setError('Password is required for a new user.');
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
    if (!id || !window.confirm(`Delete user ${form.username || id}?`)) {
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
      title={isEdit ? `Edit user #${id}` : 'Create user'}
      listPath={resources.AdminUsers}
      isEdit={isEdit}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
    >
      <Stack spacing={3}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <AdminFormSection title="Identity">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Username" value={form.username} onChange={handleStringField('username')} fullWidth />
            <TextField
              label={isEdit ? 'New password' : 'Password'}
              type="password"
              value={form.password ?? ''}
              onChange={handleStringField('password')}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="First name" value={form.first_name ?? ''} onChange={handleStringField('first_name')} fullWidth />
            <TextField label="Last name" value={form.last_name ?? ''} onChange={handleStringField('last_name')} fullWidth />
            <TextField label="Email" value={form.email ?? ''} onChange={handleStringField('email')} fullWidth />
          </Stack>
          <TextField
            label="Last seen"
            type="datetime-local"
            value={form.last_seen ?? ''}
            onChange={handleStringField('last_seen')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </AdminFormSection>

        <AdminFormSection title="Status">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControlLabel
              control={<Switch checked={form.is_active} onChange={(event) => setField('is_active', event.target.checked)} />}
              label="Active"
            />
            <FormControlLabel
              control={<Switch checked={form.is_staff} onChange={(event) => setField('is_staff', event.target.checked)} />}
              label="Staff"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_superuser}
                  onChange={(event) => setField('is_superuser', event.target.checked)}
                />
              }
              label="Superuser"
            />
          </Stack>
        </AdminFormSection>

        <AdminFormSection title="Counters">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Kepcoin" type="number" value={form.kepcoin} onChange={handleNumberField('kepcoin')} fullWidth />
            <TextField label="Streak" type="number" value={form.streak} onChange={handleNumberField('streak')} fullWidth />
            <TextField
              label="Max streak"
              type="number"
              value={form.max_streak}
              onChange={handleNumberField('max_streak')}
              fullWidth
            />
          </Stack>
        </AdminFormSection>

        <AdminFormSection title="Problem Permissions">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.can_create_problems}
                  onChange={(event) => setField('can_create_problems', event.target.checked)}
                />
              }
              label="Can create problems"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.can_change_problem_similar}
                  onChange={(event) => setField('can_change_problem_similar', event.target.checked)}
                />
              }
              label="Can change similar"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.can_change_problem_tags}
                  onChange={(event) => setField('can_change_problem_tags', event.target.checked)}
                />
              }
              label="Can change tags"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.can_use_check_samples}
                  onChange={(event) => setField('can_use_check_samples', event.target.checked)}
                />
              }
              label="Can use check samples"
            />
          </Stack>
        </AdminFormSection>
      </Stack>
    </AdminFormPageLayout>
  );
};

export default AdminUserFormPage;
