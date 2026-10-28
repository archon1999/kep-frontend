import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Grid, IconButton, LinearProgress, Stack, TextField } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import {
  useAccountWorkExperiences,
  useUpdateWorkExperiences,
} from 'modules/account-settings/application';
import type { AccountWorkExperience } from 'modules/account-settings/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { toast } from 'sonner';
import SettingsSection from './SettingsSection';

type EditableWorkExperience = AccountWorkExperience & {
  _rowId: string;
};

const createRowId = () => `work-${Math.random().toString(36).slice(2, 11)}`;
const yearInputProps = { min: 1970, max: 2026 };

const toEditableWorkExperience = (item: AccountWorkExperience): EditableWorkExperience => ({
  ...item,
  _rowId: createRowId(),
});

const toPayload = (items: EditableWorkExperience[]): AccountWorkExperience[] =>
  items.map(({ _rowId: _, ...item }) => item);

const WorkExperiencesForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, error: loadError, mutate } = useAccountWorkExperiences(username);
  const { trigger, isMutating } = useUpdateWorkExperiences();
  const [items, setItems] = useState<EditableWorkExperience[] | null>(null);

  useEffect(() => {
    if (data) setItems(data.map(toEditableWorkExperience));
  }, [data]);

  const updateItem = (rowId: string, key: keyof AccountWorkExperience, value: string) => {
    setItems((prev) => {
      if (!prev) return prev;
      const numericKeys: (keyof AccountWorkExperience)[] = ['fromYear', 'toYear'];
      return prev.map((item) =>
        item._rowId === rowId
          ? {
              ...item,
              [key]: numericKeys.includes(key) ? Number(value) || null : value,
            }
          : item,
      );
    });
  };

  const addItem = () =>
    setItems((prev) => [
      ...(prev || []),
      { _rowId: createRowId(), company: '', jobTitle: '', fromYear: null, toYear: null },
    ]);

  const removeItem = (rowId: string) =>
    setItems((prev) => (prev ? prev.filter((item) => item._rowId !== rowId) : prev));

  const handleReset = () => setItems(data ? data.map(toEditableWorkExperience) : null);

  const handleSave = async () => {
    if (!username || !items) return;
    try {
      await trigger({ username, payload: toPayload(items) });
      await mutate();
      toast.success(t('settings.saved'));
    } catch {
      toast.error(t('settings.error'));
    }
  };

  if (loadError)
    return (
      <SettingsSection title={t('settings.workExperience')}>
        <Alert
          severity="error"
          action={<Button onClick={() => mutate()}>{t('common.retry')}</Button>}
        >
          {t('common.loadFailed')}
        </Alert>
      </SettingsSection>
    );

  return (
    <SettingsSection title={t('settings.workExperience')}>
      {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
      <Stack direction="column" spacing={3}>
        {items?.map((item) => (
          <Grid
            container
            spacing={2}
            alignItems="center"
            key={item._rowId}
            sx={{ pb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label={t('settings.company')}
                value={item.company}
                onChange={(event) => updateItem(item._rowId, 'company', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label={t('settings.jobTitle')}
                value={item.jobTitle}
                onChange={(event) => updateItem(item._rowId, 'jobTitle', event.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2.5 }}>
              <TextField
                fullWidth
                type="number"
                label={t('settings.fromYear')}
                value={item.fromYear ?? ''}
                onChange={(event) => updateItem(item._rowId, 'fromYear', event.target.value)}
                inputProps={yearInputProps}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2.5 }}>
              <TextField
                fullWidth
                type="number"
                label={t('settings.toYear')}
                value={item.toYear ?? ''}
                onChange={(event) => updateItem(item._rowId, 'toYear', event.target.value)}
                inputProps={yearInputProps}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 1 }} sx={{ textAlign: { xs: 'right', md: 'center' } }}>
              <IconButton
                aria-label={t('settings.delete')}
                color="error"
                onClick={() => removeItem(item._rowId)}
              >
                <IconifyIcon icon="material-symbols:delete-outline" />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          variant="outlined"
          startIcon={<IconifyIcon icon="material-symbols:add-circle-outline" />}
          onClick={addItem}
        >
          {t('settings.addNew')}
        </Button>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={isLoading || isMutating}
          >
            {t('settings.reset')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={items === null || isLoading || isMutating}
          >
            {t('settings.save')}
          </Button>
        </Stack>
      </Stack>
    </SettingsSection>
  );
};

export default WorkExperiencesForm;
