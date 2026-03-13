import { Alert, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { LoginPayload } from 'modules/authentication/domain/entities/auth.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface DefaultCredentialAlertProps {
  credentials: LoginPayload;
}

const DefaultCredentialAlert = ({ credentials }: DefaultCredentialAlertProps) => {
  const { t } = useTranslation();

  return (
    <Alert
      severity="info"
      sx={{ mb: 4 }}
      icon={<IconifyIcon icon="material-symbols:info-outline-rounded" />}
    >
      <Typography variant="body2">
        {t('auth.defaultUsernameLabel')}:{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
          }}
        >
          {credentials.username}
        </Box>
      </Typography>
      <Typography variant="body2">
        {t('auth.defaultPasswordLabel')}:{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
          }}
        >
          {credentials.password}
        </Box>
      </Typography>
    </Alert>
  );
};

export default DefaultCredentialAlert;
