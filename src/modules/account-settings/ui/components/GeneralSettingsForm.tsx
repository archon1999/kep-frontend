import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { toast } from 'sonner';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import { useUpdateGeneralInfo } from '../../application/mutations';
import { useAccountGeneralInfo } from '../../application/queries';
import type { AccountGeneralInfo } from '../../domain/entities/account-settings.entity';

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const COVER_PHOTO_COST = 5;

const GeneralSettingsForm = () => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();

  const username = currentUser?.username;
  const { data, isLoading, mutate } = useAccountGeneralInfo(username);
  const { trigger, isMutating } = useUpdateGeneralInfo();
  const [canChangeCoverPhoto, setCanChangeCoverPhoto] = useState(false);

  const [formState, setFormState] = useState<AccountGeneralInfo | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>();

  useEffect(() => {
    if (data) {
      setFormState({ ...data });
    }
  }, [data]);

  const avatarPreview = useMemo(
    () => formState?.avatar || data?.avatar,
    [formState?.avatar, data?.avatar],
  );
  const coverPreview = useMemo(
    () => formState?.coverPhoto || data?.coverPhoto,
    [formState?.coverPhoto, data?.coverPhoto],
  );

  const handleChange =
    (field: keyof AccountGeneralInfo) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev!, [field]: event.target.value }));
    };

  const handleUpload = async (
    field: 'avatar' | 'coverPhoto',
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataUrl(file);
    setFormState((prev) => ({ ...prev!, [field]: dataUrl }));
  };

  const handleReset = () => setFormState(data || null);

  const handleSave = async () => {
    if (!username || !formState) return;

    try {
      await trigger({ username, payload: formState });
      await mutate();
      await refreshCurrentUser();
      setErrors(undefined);
      toast.success(t('settings.saved'));
    } catch (error: any) {
      setErrors(error?.data);
      toast.error(t('settings.error'));
    }
  };

  return (
    <Card background={1} sx={{borderRadius: 3, outline: 'none'}}>
      <CardHeader
        title={t('settings.generalSettings')}
        subheader={t('settings.generalSettingsSubtitle')}
      />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={3}>
          <Stack direction="column" spacing={3} alignItems="center">
            <Box textAlign="center">
              <Avatar src={avatarPreview} sx={{ width: 96, height: 96, mb: 1 }} />
              <Button variant="outlined" component="label" size="small">
                {t('settings.upload')}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(event) => handleUpload('avatar', event)}
                />
              </Button>
              {errors?.avatar?.length ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.avatar[0]}
                </Typography>
              ) : null}
            </Box>

            <Box flex={1}>
              <Typography variant="subtitle2" gutterBottom>
                {t('settings.coverImage')}
              </Typography>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                  minHeight: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.default',
                }}
              >
                {coverPreview ? (
                  <Box
                    component="img"
                    src={coverPreview}
                    alt={t('settings.coverImage')}
                    sx={{ width: '100%', maxHeight: 240, objectFit: 'cover' }}
                  />
                ) : (
                  <Typography color="text.secondary">{t('settings.coverPlaceholder')}</Typography>
                )}
              </Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ mt: 1 }}
              >
                {canChangeCoverPhoto ? (
                  <Button variant="outlined" component="label" size="small">
                    {t('settings.upload')}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => handleUpload('coverPhoto', event)}
                    />
                  </Button>
                ) : (
                  <KepcoinSpendConfirm
                    value={COVER_PHOTO_COST}
                    purchaseUrl="/api/users/purchase-cover-photo-change/"
                    onSuccess={() => setCanChangeCoverPhoto(true)}
                    disabled={!currentUser}
                  >
                    <Button variant="contained" size="small">
                      {t('settings.coverChangeAction', { value: COVER_PHOTO_COST })}
                    </Button>
                  </KepcoinSpendConfirm>
                )}
                {!canChangeCoverPhoto ? (
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.coverChangeNote', { value: COVER_PHOTO_COST })}
                  </Typography>
                ) : null}
              </Stack>
              {errors?.coverPhoto?.length ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.coverPhoto[0]}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.username')}
                value={formState?.username || ''}
                onChange={handleChange('username')}
                error={Boolean(errors?.username?.length)}
                helperText={errors?.username?.[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.email')}
                value={formState?.email || ''}
                onChange={handleChange('email')}
                error={Boolean(errors?.email?.length)}
                helperText={errors?.email?.[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.firstName')}
                value={formState?.firstName || ''}
                onChange={handleChange('firstName')}
                error={Boolean(errors?.firstName?.length)}
                helperText={errors?.firstName?.[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.lastName')}
                value={formState?.lastName || ''}
                onChange={handleChange('lastName')}
                error={Boolean(errors?.lastName?.length)}
                helperText={errors?.lastName?.[0]}
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
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsForm;
