import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, IconButton, LinearProgress, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useAccountEducations, useUpdateEducations } from 'modules/account-settings/application';
import type { AccountEducation } from 'modules/account-settings/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

type EditableEducation = AccountEducation & {
  _rowId: string;
};

const createRowId = () => `education-${Math.random().toString(36).slice(2, 11)}`;
const yearInputProps = { min: 1970, max: 2026 };

const toEditableEducation = (item: AccountEducation): EditableEducation => ({
  ...item,
  _rowId: createRowId(),
});

const toPayload = (items: EditableEducation[]): AccountEducation[] =>
  items.map(({ _rowId: _, ...item }) => item);

const EducationsForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, mutate } = useAccountEducations(username);
  const { trigger, isMutating } = useUpdateEducations();
  const [items, setItems] = useState<EditableEducation[] | null>(null);

  useEffect(() => {
    if (data) setItems(data.map(toEditableEducation));
  }, [data]);

  const updateItem = (rowId: string, key: keyof AccountEducation, value: string) => {
    setItems((prev) => {
      if (!prev) return prev;
      const numericKeys: (keyof AccountEducation)[] = ['fromYear', 'toYear'];
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
    setItems((prev) => ([
      ...(prev || []),
      { _rowId: createRowId(), organization: '', degree: '', fromYear: null, toYear: null },
    ]));

  const removeItem = (rowId: string) =>
    setItems((prev) => (prev ? prev.filter((item) => item._rowId !== rowId) : prev));

  const handleReset = () => setItems(data ? data.map(toEditableEducation) : null);

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

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.education')} />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={3}>
          {items?.map((item) => (
            <Grid container spacing={2} alignItems="center" key={item._rowId}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label={t('settings.organization')}
                  value={item.organization}
                  onChange={(event) => updateItem(item._rowId, 'organization', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label={t('settings.degree')}
                  value={item.degree}
                  onChange={(event) => updateItem(item._rowId, 'degree', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.fromYear')}
                  value={item.fromYear ?? ''}
                  onChange={(event) => updateItem(item._rowId, 'fromYear', event.target.value)}
                  inputProps={yearInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2.5 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.toYear')}
                  value={item.toYear ?? ''}
                  onChange={(event) => updateItem(item._rowId, 'toYear', event.target.value)}
                  inputProps={yearInputProps}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <IconButton color="error" onClick={() => removeItem(item._rowId)}>
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
            <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isLoading}>
              {t('settings.reset')}
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!items?.length}>
              {t('settings.save')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EducationsForm;
