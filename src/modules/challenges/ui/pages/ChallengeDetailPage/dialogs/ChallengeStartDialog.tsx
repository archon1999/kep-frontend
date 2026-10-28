import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { Challenge } from 'modules/challenges/domain';
import ChallengeUserChip from 'modules/challenges/ui/shared/components/ChallengeUserChip.tsx';
import DialogHeader from 'shared/components/common/DialogHeader';
import PatternArtwork from 'shared/components/common/PatternArtwork';

type StartDialogProps = {
  open: boolean;
  challenge: Challenge;
  timerModeLabel: string;
  starting: boolean;
  onStart: () => void | Promise<void>;
};

const ChallengeStartDialog = ({
  open,
  challenge,
  timerModeLabel,
  starting,
  onStart,
}: StartDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      aria-labelledby="challenge-start-title"
      onClose={() => undefined}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
    >
      <DialogHeader
        id="challenge-start-title"
        title={t('challenges.startDialogTitle')}
        subtitle={t('challenges.startDialogSubtitle')}
      />
      <DialogContent sx={{ py: 4 }}>
        <Stack spacing={2.5}>
          <Stack direction="column" spacing={1} alignItems="center" textAlign="center">
            <PatternArtwork kind="battles" sx={{ width: 180 }} />
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Chip
              label={challenge.rated ? t('challenges.rated') : t('challenges.unrated')}
              variant="outlined"
            />
            <Chip label={t('challenges.secondsShort', { seconds: challenge.timeSeconds })} />
            <Chip label={t('challenges.questionsCount', { count: challenge.questionsCount })} />
            <Chip label={timerModeLabel} />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
              alignItems: 'center',
              columnGap: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <ChallengeUserChip player={challenge.playerFirst} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary.main"
              sx={{ justifySelf: 'center' }}
            >
              VS
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <ChallengeUserChip player={challenge.playerSecond} align="right" />
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => void onStart()} disabled={starting}>
          {t('challenges.start')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeStartDialog;
