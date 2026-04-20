import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon.tsx';

type ChallengeDetailPageBlurDialogProps = {
  open: boolean;
  onClose: () => void | Promise<void>;
};

const ChallengeDetailPageBlurDialog = ({
  open,
  onClose,
}: ChallengeDetailPageBlurDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={() => void onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <KepIcon name="challenge" fontSize={20} color="error.main" />
          <Typography variant="h6">{t('challenges.blurError')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary">
          {t('challenges.blurError')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => void onClose()}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeDetailPageBlurDialog;
