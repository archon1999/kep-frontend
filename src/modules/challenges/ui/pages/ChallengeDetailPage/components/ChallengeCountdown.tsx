import { useTranslation } from 'react-i18next';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { ChallengeQuestionTimeType } from 'modules/challenges/domain';
import KepIcon from 'shared/components/base/KepIcon';

interface CountdownProps {
  secondsLeft: number;
  totalSeconds: number;
  mode: ChallengeQuestionTimeType;
  compact?: boolean;
}
const ChallengeCountdown = ({
  secondsLeft,
  totalSeconds,
  mode,
  compact = false,
}: CountdownProps) => {
  const { t } = useTranslation();
  const remaining = Math.max(0, secondsLeft);
  const progress = totalSeconds ? Math.max(0, Math.min(100, (remaining / totalSeconds) * 100)) : 0;
  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(remaining % 60)
    .toString()
    .padStart(2, '0');
  const urgent = remaining <= Math.min(10, totalSeconds * 0.25);
  const label = t(
    mode === ChallengeQuestionTimeType.TimeToOne
      ? 'challenges.timer.perQuestion'
      : 'challenges.timer.wholeChallenge',
  );
  return (
    <Box
      title={label}
      sx={{ minWidth: 0, width: compact ? { xs: 112, sm: 144 } : undefined, flexShrink: 0 }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        gap={2}
        alignItems="center"
        sx={{ mb: compact ? 0.5 : 1.5 }}
      >
        <Stack direction="row" gap={1} alignItems="center">
          <KepIcon
            name="challenge-time"
            color={urgent ? 'error.main' : 'primary.main'}
            fontSize={20}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: compact ? 'none' : 'block' }}
          >
            {label}
          </Typography>
        </Stack>
        <Typography
          role="timer"
          aria-label={label}
          variant="metric"
          color={urgent ? 'error.main' : 'text.primary'}
          sx={{ fontSize: compact ? 26 : 32 }}
        >
          {minutes}:{seconds}
        </Typography>
      </Stack>
      <LinearProgress
        aria-label={label}
        variant="determinate"
        value={progress}
        color={urgent ? 'error' : 'primary'}
      />
    </Box>
  );
};
export default ChallengeCountdown;
