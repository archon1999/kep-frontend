import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { Challenge } from 'modules/challenges/domain';
import DialogHeader from 'shared/components/common/DialogHeader';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import ChallengeResultsCard from '../components/ChallengeResultsCard.tsx';

type FinishDialogProps = {
  open: boolean;
  challenge: Challenge;
  onClose: () => void;
  onBackToList: () => void;
};

const ChallengeFinishDialog = ({ open, challenge, onClose, onBackToList }: FinishDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="challenge-finish-title"
    >
      <DialogHeader
        id="challenge-finish-title"
        title={t('challenges.finishDialogTitle')}
        onClose={onClose}
      />
      <DialogContent dividers>
        <Stack alignItems="center" sx={{ mb: 2 }}>
          <PatternArtwork kind="competitions" sx={{ width: { xs: 96, sm: 180 } }} />
        </Stack>
        <ChallengeResultsCard challenge={challenge} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        <Button variant="contained" onClick={onBackToList}>
          {t('challenges.backToList')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeFinishDialog;
