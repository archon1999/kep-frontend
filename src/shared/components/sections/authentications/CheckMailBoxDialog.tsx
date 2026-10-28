import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import DialogHeader from 'shared/components/common/DialogHeader';
import PatternArtwork from 'shared/components/common/PatternArtwork';

interface CheckMailBoxDialogProps {
  open: boolean;
  handleClose: () => void;
  email: string;
  time: number;
  handleSendAgain: () => void;
}

const CheckMailBoxDialog = ({
  open,
  handleClose,
  email,
  time,
  handleSendAgain,
}: CheckMailBoxDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="check-mailbox-title"
    >
      <DialogHeader
        id="check-mailbox-title"
        title={t('auth.mailbox.title')}
        onClose={handleClose}
      />
      <DialogContent>
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <PatternArtwork kind="auth" sx={{ width: 180, maxWidth: '100%' }} />
          {import.meta.env.PROD && <Alert severity="info">{t('auth.mailbox.demo')}</Alert>}
          <Typography variant="body2" color="text.secondary">
            {t('auth.mailbox.description')}
            <Box
              component="span"
              sx={{
                display: 'block',
                mt: 1,
                color: 'text.primary',
                fontWeight: 600,
                overflowWrap: 'anywhere',
              }}
            >
              {email}
            </Box>
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>
          {t('auth.mailbox.notReceived')}
        </Typography>
        <Button onClick={handleSendAgain} disabled={time > 0}>
          {time > 0 ? t('auth.mailbox.resendIn', { seconds: time }) : t('auth.mailbox.resend')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckMailBoxDialog;
