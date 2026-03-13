import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, IconButton, LinearProgress, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import type { AccountWorkExperience } from '../../domain/entities/account-settings.entity';
import { useAccountWorkExperiences } from '../../application/queries';
import { useUpdateWorkExperiences } from '../../application/mutations';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const WorkExperiencesForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, mutate } = useAccountWorkExperiences(username);
  const { trigger, isMutating } = useUpdateWorkExperiences();
  const [items, setItems] = useState<AccountWorkExperience[] | null>(null);

  useEffect(() => {
    if (data) setItems([...data]);
  }, [data]);

  const updateItem = (index: number, key: keyof AccountWorkExperience, value: string) => {
    setItems((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const numericKeys: (keyof AccountWorkExperience)[] = ['fromYear', 'toYear'];
      next[index] = {
        ...next[index],
        [key]: numericKeys.includes(key) ? Number(value) || null : value,
      };
      return next;
    });
  };

  const addItem = () =>
    setItems((prev) => ([...(prev || []), { company: '', jobTitle: '', fromYear: null, toYear: null }]));

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
      <CardHeader title={t('settings.workExperience')} />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={3}>
          {items?.map((item, index) => (
            <Grid container spacing={2} alignItems="center" key={`${item.company}-${index}`}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label={t('settings.company')}
                  value={item.company}
                  onChange={(event) => updateItem(index, 'company', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  label={t('settings.jobTitle')}
                  value={item.jobTitle}
                  onChange={(event) => updateItem(index, 'jobTitle', event.target.value)}
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

export default WorkExperiencesForm;
