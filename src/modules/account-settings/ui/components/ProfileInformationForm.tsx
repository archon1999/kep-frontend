import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, LinearProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { toast } from 'sonner';
import { useUsersCountries } from 'modules/users/application/queries';
import type { AccountProfileInfo } from '../../domain/entities/account-settings.entity';
import { useAccountProfileInfo } from '../../application/queries';
import { useUpdateProfileInfo } from '../../application/mutations';

const ProfileInformationForm = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data: countries } = useUsersCountries();
  const { data, isLoading, mutate } = useAccountProfileInfo(username);
  const { trigger, isMutating } = useUpdateProfileInfo();

  const [formState, setFormState] = useState<AccountProfileInfo | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>();

  useEffect(() => {
    if (data) {
      setFormState({ ...data });
    }
  }, [data]);

  const countryNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([i18n.language], { type: 'region' });
    } catch {
      return undefined;
    }
  }, [i18n.language]);

  const handleChange = (field: keyof AccountProfileInfo) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev!, [field]: event.target.value }));
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev!, dateOfBirth: value ? dayjs(value).format('YYYY-MM-DD') : '' }));
  };

  const handleReset = () => setFormState(data || null);

  const handleSave = async () => {
    if (!username || !formState) return;

    try {
      await trigger({ username, payload: formState });
      await mutate();
      setErrors(undefined);
      toast.success(t('settings.saved'));
    } catch (error: any) {
      setErrors(error?.data);
      toast.error(t('settings.error'));
    }
  };

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.information')} />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={3}>
          <TextField
            multiline
            minRows={3}
            label={t('settings.bio')}
            value={formState?.bio || ''}
            onChange={handleChange('bio')}
            error={Boolean(errors?.bio?.length)}
            helperText={errors?.bio?.[0]}
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label={t('settings.birthDate')}
                value={formState?.dateOfBirth ? dayjs(formState.dateOfBirth).format('YYYY-MM-DD') : ''}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors?.dateOfBirth?.length)}
                helperText={errors?.dateOfBirth?.[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.website')}
                value={formState?.website || ''}
                onChange={handleChange('website')}
                error={Boolean(errors?.website?.length)}
                helperText={errors?.website?.[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label={t('settings.country')}
                value={formState?.country || ''}
                onChange={handleChange('country')}
                error={Boolean(errors?.country?.length)}
                helperText={errors?.country?.[0]}
              >
                {countries?.map((code) => (
                  <MenuItem key={code} value={code}>
                    {countryNames?.of(code.toUpperCase()) || code.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.region')}
                value={formState?.region || ''}
                onChange={handleChange('region')}
                error={Boolean(errors?.region?.length)}
                helperText={errors?.region?.[0]}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isLoading}>
              {t('settings.reset')}
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!formState}>
              {t('settings.save')}
            </Button>
          </Stack>
          {errors && errors.email ? (
            <Typography variant="caption" color="text.secondary">
              {errors.email[0]}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileInformationForm;
