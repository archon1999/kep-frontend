import { useTranslation } from 'react-i18next';
import { Box, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';

interface ProjectAttemptScoreProps {
  earned?: number;
  possible?: number;
  compact?: boolean;
}

const ProjectAttemptScore = ({ earned, possible, compact }: ProjectAttemptScoreProps) => {
  const { t } = useTranslation();
  if (earned === undefined) return <Typography variant="body2">—</Typography>;
  if (!possible || possible <= 0) {
    return (
      <Typography variant="body2" fontWeight={700}>
        {earned}
      </Typography>
    );
  }

  const percent = Math.min(100, Math.max(0, (earned / possible) * 100));
  const color = percent === 100 ? 'success' : 'primary';
  const label = t('projects.attemptScore', {
    earned,
    total: possible,
    percent: Math.round(percent),
  });
  return (
    <Tooltip title={label}>
      <Stack direction="column" spacing={0.5} sx={{ width: compact ? 56 : 64 }}>
        <Typography
          variant={compact ? 'caption' : 'body2'}
          fontWeight={700}
          textAlign="center"
          whiteSpace="nowrap"
          color={percent > 0 ? `${color}.main` : 'text.secondary'}
        >
          {earned}
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            {' / '}
            {possible}
          </Box>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percent}
          color={color}
          aria-label={t('projects.score')}
          aria-valuetext={label}
          sx={{ height: 3, bgcolor: 'action.hover' }}
        />
      </Stack>
    </Tooltip>
  );
};

export default ProjectAttemptScore;
