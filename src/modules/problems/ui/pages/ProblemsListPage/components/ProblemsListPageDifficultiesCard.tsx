import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, LinearProgress, Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import { DifficultyBreakdown } from 'modules/problems/domain/entities/problem.entity.ts';

interface ProblemsListPageDifficultiesCardProps {
  difficulties?: DifficultyBreakdown;
  isLoading: boolean;
}

const ProblemsListPageDifficultiesCard = ({
  difficulties,
  isLoading,
}: ProblemsListPageDifficultiesCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const entries = useMemo(
    () =>
      difficultyOptions.map((option) => ({
        key: option.key,
        totalKey: `all${option.key.charAt(0).toUpperCase()}${option.key.slice(1)}`,
        label: t(option.label),
        color: difficultyColorByKey[option.key],
      })),
    [t],
  );

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:chart-pie" width={20} height={20} />
            <Typography variant="subtitle1" fontWeight={700}>
              {t('problems.difficultyBreakdown')}
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        {isLoading || !difficulties ? (
          <Stack direction="column" spacing={1}>
            {Array.from({ length: 7 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={20} />
            ))}
          </Stack>
        ) : (
          <Stack direction="column" spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {t('problems.difficultyOverview', {
                solved: difficulties.totalSolved,
                total: difficulties.totalProblems,
              })}
            </Typography>
            {entries.map((entry) => {
              const solved = (difficulties as any)[entry.key] as number;
              const total = (difficulties as any)[entry.totalKey] as number;
              const percent = total ? Math.min(100, (solved / total) * 100) : 0;

              return (
                <Stack key={entry.key} direction="column" spacing={0.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {entry.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {solved} / {total}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      bgcolor: alpha(theme.palette[entry.color].main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette[entry.color].main,
                      },
                    }}
                  />
                </Stack>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemsListPageDifficultiesCard;
