import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, LinearProgress, Slider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import type { AccountSkills } from '../../domain/entities/account-settings.entity';
import { useAccountSkills } from '../../application/queries';
import { useUpdateSkills } from '../../application/mutations';

const SkillsForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, mutate } = useAccountSkills(username);
  const { trigger, isMutating } = useUpdateSkills();

  const [formState, setFormState] = useState<AccountSkills | null>(null);

  useEffect(() => {
    if (data) setFormState({ ...data });
  }, [data]);

  const handleSlider = (field: keyof AccountSkills) => (_: Event, value: number | number[]) => {
    setFormState((prev) => ({ ...prev!, [field]: Array.isArray(value) ? value[0] : value }));
  };

  const handleReset = () => setFormState(data || null);

  const handleSave = async () => {
    if (!username || !formState) return;
    try {
      await trigger({ username, payload: formState });
      await mutate();
      toast.success(t('settings.saved'));
    } catch {
      toast.error(t('settings.error'));
    }
  };

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.skills')} />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={4}>
          <Grid container spacing={3}>
            {(['python', 'webDevelopment', 'webScraping', 'algorithms', 'dataScience'] as (keyof AccountSkills)[]).map(
              (key) => (
                <Grid size={{ xs: 12, md: 8 }} key={key} sx={{ mx: 'auto' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t(`settings.skillLabels.${key}`)}
                  </Typography>
                  <Slider
                    value={formState?.[key] ?? 0}
                    onChange={handleSlider(key)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                  />
                </Grid>
              ),
            )}
          </Grid>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isLoading}>
              {t('settings.reset')}
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!formState}>
              {t('settings.save')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SkillsForm;
