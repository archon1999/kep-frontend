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
import { Challenge } from 'modules/challenges/domain';
import KepIcon from 'shared/components/base/KepIcon.tsx';
import ChallengeDetailPageResultsCard from '../components/ChallengeDetailPageResultsCard.tsx';

type ChallengeDetailPageFinishDialogProps = {
  open: boolean;
  challenge: Challenge;
  onClose: () => void;
  onBackToList: () => void;
};

const ChallengeDetailPageFinishDialog = ({
  open,
  challenge,
  onClose,
  onBackToList,
}: ChallengeDetailPageFinishDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <KepIcon name="challenge" fontSize={20} color="success.main" />
          <Typography variant="h6">{t('challenges.finishDialogTitle')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <ChallengeDetailPageResultsCard challenge={challenge} />
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

export default ChallengeDetailPageFinishDialog;
