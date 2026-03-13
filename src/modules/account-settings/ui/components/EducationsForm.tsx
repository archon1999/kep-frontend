import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, IconButton, LinearProgress, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import type { AccountEducation } from '../../domain/entities/account-settings.entity';
import { useAccountEducations } from '../../application/queries';
import { useUpdateEducations } from '../../application/mutations';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const EducationsForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, mutate } = useAccountEducations(username);
  const { trigger, isMutating } = useUpdateEducations();
  const [items, setItems] = useState<AccountEducation[] | null>(null);

  useEffect(() => {
    if (data) setItems([...data]);
  }, [data]);

  const updateItem = (index: number, key: keyof AccountEducation, value: string) => {
    setItems((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const numericKeys: (keyof AccountEducation)[] = ['fromYear', 'toYear'];
      next[index] = {
        ...next[index],
        [key]: numericKeys.includes(key) ? Number(value) || null : value,
      };
      return next;
    });
  };

  const addItem = () =>
    setItems((prev) => ([...(prev || []), { organization: '', degree: '', fromYear: null, toYear: null }]));

  const removeItem = (index: number) => setItems((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));

  const handleReset = () => setItems(data ? [...data] : null);

  const handleSave = async () => {
    if (!username || !items) return;
    try {
      await trigger({ username, payload: items });
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
          {items?.map((item, index) => (
            <Grid container spacing={2} alignItems="center" key={`${item.organization}-${index}`}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label={t('settings.organization')}
                  value={item.organization}
                  onChange={(event) => updateItem(index, 'organization', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label={t('settings.degree')}
                  value={item.degree}
                  onChange={(event) => updateItem(index, 'degree', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.fromYear')}
                  value={item.fromYear ?? ''}
                  onChange={(event) => updateItem(index, 'fromYear', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('settings.toYear')}
                  value={item.toYear ?? ''}
                  onChange={(event) => updateItem(index, 'toYear', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <IconButton color="error" onClick={() => removeItem(index)}>
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
