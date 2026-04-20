import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getResourceByParams, resources } from 'app/routes/resources';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';

interface ContestPageProblemsPreviewCardProps {
  contest?: ContestDetail;
  contestId?: number;
  contestProblems?: ContestProblemEntity[];
  isLoading: boolean;
}

const ContestPageProblemsPreviewCard = ({
  contest,
  contestId,
  contestProblems,
  isLoading,
}: ContestPageProblemsPreviewCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            {t('contests.problemsPreview')}
          </Typography>
          {contestProblems && contestProblems.length ? (
            <Stack spacing={1}>
              {contestProblems.slice(0, 5).map((problem) => (
                <Stack
                  key={problem.symbol}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Stack direction="column" spacing={0.25} minWidth={0}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      component={RouterLink}
                      to={getResourceByParams(resources.ContestProblem, {
                        id: contest?.id ?? contestId ?? '',
                        symbol: problem.symbol,
                      })}
                      style={{ textDecoration: 'none' }}
                    >
                      {problem.symbol}. {problem.problem.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {problem.problem.timeLimit} ms - {problem.problem.memoryLimit} MB
                    </Typography>
                  </Stack>
                  <Chip
                    label={t('contests.solvedShort', { solved: problem.solved ?? 0 })}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Stack>
              ))}
            </Stack>
          ) : isLoading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Stack direction="column" spacing={0.5} minWidth={0} flex={1}>
                    <Skeleton variant="rounded" width={72} height={24} />
                    <Skeleton variant="text" width="80%" />
                  </Stack>
                  <Skeleton variant="rounded" width={90} height={28} />
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('contests.noProblems')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ContestPageProblemsPreviewCard;
