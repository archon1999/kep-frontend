import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import { validationMessage } from 'modules/admin/domain/utils/validation';
import { formatAdminEditTitle } from 'modules/admin/shared/utils/editTitle';
import {
  createAdminUser,
  removeAdminUser,
  updateAdminUser,
} from 'modules/admin/users/application/mutations';
import { useAdminUser } from 'modules/admin/users/application/queries';
import { AdminUserPayload } from 'modules/admin/users/domain/types';
import {
  DateTimePickerValue,
  formatDateTimeLocalInputValue,
  formatDateTimePickerValue,
  toBackendUtcDateTime,
} from 'shared/lib/dateTime';

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

export const useAdminUserFormPage = (confirm: (message: string) => Promise<boolean>) => {
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
        lastSeen: formatDateTimeLocalInputValue(user.lastSeen),
        password: '',
      });
    }
  }, [user]);

  const setField = <K extends keyof AdminUserPayload>(field: K, value: AdminUserPayload[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateTimeField = (field: keyof AdminUserPayload) => (value: DateTimePickerValue) => {
    setForm((prev) => ({
      ...prev,
      [field]: formatDateTimePickerValue(value),
    }));
  };

  const buildPayload = () => {
    const payload: AdminUserPayload = {
      ...form,
      firstName: form.firstName ?? '',
      lastName: form.lastName ?? '',
      email: form.email ?? '',
      lastSeen: form.lastSeen ? toBackendUtcDateTime(form.lastSeen) : undefined,
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
        await updateAdminUser(id, payload);
      } else {
        await createAdminUser(payload);
      }
      navigate(resources.AdminUsers);
    } catch (caughtError: any) {
      setError(validationMessage(caughtError) || t('admin.console.loadError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !id ||
      !(await confirm(t('admin.users.confirmDelete', { username: form.username || id })))
    ) {
      return;
    }

    await removeAdminUser(id);
    navigate(resources.AdminUsers);
  };

  const fullName = [user?.firstName || form.firstName, user?.lastName || form.lastName]
    .filter(Boolean)
    .join(' ');

  const pageTitle = isEdit
    ? formatAdminEditTitle(id, user?.username || form.username || fullName)
    : t('admin.users.createTitle');
  return {
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
  };
};
