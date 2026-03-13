import { useTranslation } from 'react-i18next';
import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { ChallengeQuestionTimeType } from '../../domain';

interface ChallengeCountdownProps {
  secondsLeft: number;
  totalSeconds: number;
  chapterTitle?: string;
  chapterIcon?: string;
  mode: ChallengeQuestionTimeType;
}

const ChallengeCountdown = ({
  secondsLeft,
  totalSeconds,
  mode,
}: ChallengeCountdownProps) => {
  const { t } = useTranslation();
  const progress = totalSeconds
    ? Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100))
    : 0;

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(secondsLeft % 60)
    .toString()
    .padStart(2, '0');

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} direction="column" alignItems="stretch">
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="column" spacing={0.25}>
              <Typography variant="subtitle2" color="text.secondary">
                {mode === ChallengeQuestionTimeType.TimeToOne
                  ? t('challenges.timer.perQuestion')
                  : t('challenges.timer.wholeChallenge')}
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {minutes}:{seconds}
              </Typography>
            </Stack>
          </Stack>

          <LinearProgress variant="determinate" value={progress} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeCountdown;
