import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import type { DifficultyBreakdown } from 'modules/problems/domain/entities/problem.entity';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

interface DifficultiesCardProps {
  difficulties?: DifficultyBreakdown;
  isLoading: boolean;
  error?: unknown;
  onRetry?: () => void;
  selectedDifficulty?: string | number;
  onSelectDifficulty?: (value: string) => void;
}

const ProblemDifficultiesCard = ({
  difficulties,
  isLoading,
  error,
  onRetry,
  selectedDifficulty,
  onSelectDifficulty,
}: DifficultiesCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const totalPercent = difficulties?.totalProblems
    ? Math.round((difficulties.totalSolved / difficulties.totalProblems) * 100)
    : 0;
  return (
    <Paper component={PointerSpotlight} variant="section" className="kep-problems-progress">
      <SectionHeader
        title={t('problems.difficultyBreakdown')}
        action={<PatternArtwork kind="activity" sx={{ width: 64, flexShrink: 0 }} />}
      />
      <Box sx={{ px: 'var(--kep-content-inset)', py: 2.5 }}>
        {error || (!isLoading && !difficulties) ? (
          <Alert
            severity="error"
            action={onRetry && <Button onClick={onRetry}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              sx={{ mb: 2.5, minHeight: 40 }}
            >
              <Box>
                <Typography
                  variant="metric"
                  aria-label={
                    difficulties
                      ? t('problems.difficultyOverview', {
                          solved: difficulties.totalSolved,
                          total: difficulties.totalProblems,
                        })
                      : undefined
                  }
                  sx={{ fontSize: 26, display: 'flex', alignItems: 'baseline', gap: 1 }}
                >
                  {isLoading ? (
                    <Skeleton variant="text" width={150} />
                  ) : (
                    <>
                      {difficulties?.totalSolved}
                      <Box component="span" sx={{ fontSize: 16, color: 'text.secondary' }}>
                        / {difficulties?.totalProblems}
                      </Box>
                    </>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('problems.sidebar.solved')}
                </Typography>
              </Box>
              <Typography variant="metric" color="primary.main" sx={{ fontSize: 22 }}>
                {isLoading ? <Skeleton width={48} /> : `${totalPercent}%`}
              </Typography>
            </Stack>
            <Stack gap={1.25}>
              {difficultyOptions.map((option) => {
                const totalKey =
                  `all${option.key.charAt(0).toUpperCase()}${option.key.slice(1)}` as keyof DifficultyBreakdown;
                const solved = difficulties?.[option.key] ?? 0;
                const total = difficulties?.[totalKey] ?? 0;
                const color = theme.palette[difficultyColorByKey[option.key]].main;
                const selected = String(selectedDifficulty) === String(option.value);
                return (
                  <ButtonBase
                    key={option.key}
                    disabled={isLoading || !onSelectDifficulty}
                    aria-pressed={selected}
                    onClick={() => onSelectDifficulty?.(selected ? '' : String(option.value))}
                    sx={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 0,
                      py: 0.5,
                      color: 'text.primary',
                      '&:hover, &:focus-visible': { color: 'primary.main' },
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 4,
                      },
                      '&.Mui-disabled': { color: 'text.primary' },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={1}
                      sx={{ mb: 0.75, minHeight: 20 }}
                    >
                      <Stack direction="row" gap={1} alignItems="center">
                        <Box aria-hidden sx={{ width: 5, height: 5, bgcolor: color }} />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: 12, fontWeight: selected ? 700 : 500 }}
                        >
                          {t(option.label)}
                        </Typography>
                      </Stack>
                      <Typography component="span" variant="metric" sx={{ fontSize: 14 }}>
                        {isLoading ? (
                          <Skeleton width={70} />
                        ) : (
                          <>
                            {solved}
                            <Box component="span" sx={{ color: 'text.secondary' }}>
                              {' '}
                              / {total}
                            </Box>
                          </>
                        )}
                      </Typography>
                    </Stack>
                    {isLoading ? (
                      <Skeleton variant="rectangular" height={3} />
                    ) : (
                      <LinearProgress
                        aria-label={t(option.label)}
                        variant="determinate"
                        value={total ? Math.min(100, (solved / total) * 100) : 0}
                        sx={{
                          height: 3,
                          bgcolor: alpha(color, 0.12),
                          '& .MuiLinearProgress-bar': { bgcolor: color },
                        }}
                      />
                    )}
                  </ButtonBase>
                );
              })}
            </Stack>
          </>
        )}
      </Box>
    </Paper>
  );
};
export default ProblemDifficultiesCard;
