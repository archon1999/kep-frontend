import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon.tsx';
import DialogHeader from 'shared/components/common/DialogHeader';

type BlurDialogProps = {
  open: boolean;
  onClose: () => void | Promise<void>;
};

const ChallengeBlurDialog = ({ open, onClose }: BlurDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={() => void onClose()}
      fullWidth
      maxWidth="sm"
      aria-labelledby="challenge-blur-title"
    >
      <DialogHeader
        id="challenge-blur-title"
        title={t('challenges.blurError')}
        onClose={() => void onClose()}
        icon={<KepIcon name="challenge" fontSize={20} color="error.main" />}
      />
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

export default ChallengeBlurDialog;
