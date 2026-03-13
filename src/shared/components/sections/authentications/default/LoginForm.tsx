import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Divider, Link, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import type { LoginPayload } from 'modules/authentication/domain/entities/auth.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PasswordTextField from 'shared/components/common/PasswordTextField';
import * as yup from 'yup';
import DefaultCredentialAlert from '../common/DefaultCredentialAlert';

interface LoginFormProps {
  handleLogin: (data: LoginFormValues) => Promise<unknown>;
  signUpLink?: string;
  forgotPasswordLink?: string;
  rememberDevice?: boolean;
  defaultCredential?: LoginPayload | null;
  getSocialLoginUrl?: (provider: SocialProvider) => string;
}

export type LoginFormValues = Pick<LoginPayload, 'username' | 'password'>;

type SocialProvider = 'google-oauth2' | 'github';

const LoginForm = ({
  handleLogin,
  signUpLink,
  defaultCredential,
  getSocialLoginUrl,
}: LoginFormProps) => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      yup
        .object({
          username: yup.string().required(t('auth.requiredField')),
          password: yup.string().required(t('auth.requiredField')),
        })
        .required(),
    [t],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: defaultCredential ?? { username: '', password: '' },
  });

  const socialProviders: { provider: SocialProvider; icon: string; label: string }[] = [
    {
      provider: 'google-oauth2',
      icon: 'logos:google-icon',
      label: t('auth.loginWith', { title: 'Google' }),
    },
    {
      provider: 'github',
      icon: 'mdi:github',
      label: t('auth.loginWith', { title: 'Github' }),
    },
  ];

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin(data).catch((error: any) => {
      const message = (error as Error)?.message || t('auth.loginError');
      setError('root.credential', { type: 'manual', message });
    });
  };

  return (
    <Stack
      direction="column"
      sx={{
        height: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: { md: 10 },
        pb: 10,
        width: '100%',
        maxWidth: {
          md: 720,
          lg: 920,
        },
        maxHeight: {
          xs: '40vh',
          sm: '45vh',
          md: '55vh',
          lg: '60vh',
        },
      }}
    >
      <div />

      <Grid
        container
        sx={{
          maxWidth: '35rem',
          rowGap: 4,
          p: { xs: 3, sm: 5 },
          mb: 5,
        }}
      >
        <Grid size={12}>
          <Stack
            direction="column"
            spacing={1}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
          >
            <Typography variant="h4">{t('auth.welcomeTitle')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('auth.loginSubtitle')}
            </Typography>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ justifyContent: 'space-between', alignItems: 'stretch', mb: 2 }}
          >
            {socialProviders.map(({ provider, icon, label }) => (
              <Button
                key={provider}
                fullWidth
                variant="outlined"
                color="inherit"
                component="a"
                startIcon={<IconifyIcon icon={icon} fontSize={18} />}
                href={getSocialLoginUrl?.(provider)}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Grid>

        <Grid size={12}>
          <Divider flexItem sx={{ my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('auth.or').toUpperCase()}
            </Typography>
          </Divider>
        </Grid>

        <Grid size={12}>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {errors.root?.credential?.message && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.root?.credential?.message}
              </Alert>
            )}
            {defaultCredential && <DefaultCredentialAlert credentials={defaultCredential} />}
            <Grid container>
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
                <TextField
                  fullWidth
                  size="large"
                  id="username"
                  label={t('auth.username')}
                  autoComplete="username"
                  error={!!errors.username}
                  helperText={<>{errors.username?.message}</>}
                  {...register('username')}
                />
              </Grid>
              <Grid
                sx={{
                  mb: 2.5,
                }}
                size={12}
              >
                <PasswordTextField
                  fullWidth
                  size="large"
                  id="password"
                  label={t('auth.password')}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={<>{errors.password?.message}</>}
                  {...register('password')}
                />
              </Grid>
              <Grid size={12}></Grid>
              <Grid size={12}>
                <Button
                  fullWidth
                  type="submit"
                  size="large"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {t('auth.login')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {signUpLink && (
          <Grid size={12}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {t('auth.noAccount')}
              <Link href={signUpLink} sx={{ ml: 1 }}>
                {t('auth.signUp')}
              </Link>
            </Typography>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default LoginForm;
