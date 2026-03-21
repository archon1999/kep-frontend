import { ChangeEvent, useEffect, useState } from 'react';
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
import { useSWRConfig } from 'swr';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { toast } from 'sonner';
import { useAccountGeneralInfo, useUpdateGeneralInfo } from 'modules/account-settings/application';
import type { AccountGeneralInfo } from 'modules/account-settings/domain';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm.tsx';

const COVER_PHOTO_COST = 5;
const COVER_PHOTO_MAX_BYTES = 4 * 1024 * 1024;

type FormErrors = Record<string, string[]>;

const normalizeErrors = (rawErrorData: unknown): FormErrors | undefined => {
  if (!rawErrorData || typeof rawErrorData !== 'object' || Array.isArray(rawErrorData)) {
    return undefined;
  }

  const normalized = Object.entries(rawErrorData).reduce<FormErrors>((accumulator, [key, value]) => {
    if (key === 'status' || key === 'code') {
      return accumulator;
    }

    if (Array.isArray(value)) {
      const messages = value.filter((item): item is string => typeof item === 'string');

      if (messages.length) {
        accumulator[key] = messages;
      }
      return accumulator;
    }

    if (typeof value === 'string') {
      accumulator[key] = [value];
    }

    return accumulator;
  }, {});

  return Object.keys(normalized).length ? normalized : undefined;
};

const extractErrorMessage = (rawErrorData: unknown): string | undefined => {
  if (!rawErrorData) return undefined;

  if (typeof rawErrorData === 'string') {
    return rawErrorData;
  }

  const normalizedErrors = normalizeErrors(rawErrorData);
  if (normalizedErrors) {
    return Object.values(normalizedErrors)[0]?.[0];
  }

  return undefined;
};

const GeneralSettingsForm = () => {
  const { t } = useTranslation();
  const { currentUser, refreshCurrentUser } = useAuth();
  const { mutate: mutateCache } = useSWRConfig();

  const username = currentUser?.username;
  const { data, isLoading, mutate } = useAccountGeneralInfo(username);
  const { trigger, isMutating } = useUpdateGeneralInfo();
  const [canChangeCoverPhoto, setCanChangeCoverPhoto] = useState(false);

  const [formState, setFormState] = useState<AccountGeneralInfo | null>(null);
  const [errors, setErrors] = useState<FormErrors>();
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [coverPreview, setCoverPreview] = useState<string>();

  useEffect(() => {
    if (data) {
      setFormState({ ...data });
      setAvatarPreview(typeof data.avatar === 'string' ? data.avatar : undefined);
      setCoverPreview(typeof data.coverPhoto === 'string' ? data.coverPhoto : undefined);
    }
  }, [data]);

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

    setErrors((prev) => {
      if (!prev) return prev;

      const next = { ...prev };
      delete next[field];
      delete next.nonFieldErrors;
      delete next.message;

      return Object.keys(next).length ? next : undefined;
    });

    if (field === 'coverPhoto' && file.size > COVER_PHOTO_MAX_BYTES) {
      const message = 'Cover photo size must be 4 MB or less.';

      setErrors((prev) => ({ ...(prev || {}), coverPhoto: [message] }));
      toast.error(message);
      event.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormState((prev) => ({ ...prev!, [field]: file }));

    if (field === 'avatar') {
      setAvatarPreview((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
        return previewUrl;
      });
      return;
    }

    setCoverPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return previewUrl;
    });
  };

  const handleReset = () => {
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);

    setErrors(undefined);
    setFormState(data || null);
    setAvatarPreview(typeof data?.avatar === 'string' ? data.avatar : undefined);
    setCoverPreview(typeof data?.coverPhoto === 'string' ? data.coverPhoto : undefined);
  };

  const handleSave = async () => {
    if (!username || !formState) return;

    try {
      await trigger({ username, payload: formState });
      await mutate();
      await refreshCurrentUser();
      await Promise.all([
        mutateCache(['user-details', username]),
        formState.username !== username ? mutateCache(['user-details', formState.username]) : Promise.resolve(),
      ]);
      setErrors(undefined);
      toast.success(t('settings.saved'));
    } catch (error: any) {
      const nextErrors = normalizeErrors(error?.data);
      const fallbackMessage = error?.status === 413 ? 'Cover photo size must be 4 MB or less.' : t('settings.error');
      const message = extractErrorMessage(error?.data) || fallbackMessage;

      setErrors(() => {
        if (error?.status === 413 && formState.coverPhoto instanceof File) {
          return { coverPhoto: [message] };
        }

        if (nextErrors) {
          return nextErrors;
        }

        if (formState.coverPhoto instanceof File) {
          return { coverPhoto: [message] };
        }

        return { nonFieldErrors: [message] };
      });
      toast.error(message);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  return (
    <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
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

          {errors?.nonFieldErrors?.length ? (
            <Typography color="error" variant="body2">
              {errors.nonFieldErrors[0]}
            </Typography>
          ) : null}

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
