import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import { cssVarRgba } from 'shared/lib/utils';

interface ContestPageProblemsPreviewCardProps {
  contest?: ContestDetail;
  contestId?: number;
  contestProblems?: ContestProblemEntity[];
  isLoading: boolean;
}

const getProblemHref = (
  problem: ContestProblemEntity,
  contest?: ContestDetail,
  contestId?: number,
) =>
  getResourceByParams(resources.ContestProblem, {
    id: contest?.id ?? contestId ?? '',
    symbol: problem.symbol,
  });

const getProblemsHref = (contest?: ContestDetail, contestId?: number) =>
  getResourceByParams(resources.ContestProblems, {
    id: contest?.id ?? contestId ?? '',
  });

const Shell = ({
  children,
  contest,
  contestId,
}: {
  children: ReactNode;
  contest?: ContestDetail;
  contestId?: number;
}) => {
  const { t } = useTranslation();

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.1)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.05)} 60%, ${theme.vars.palette.background.paper})`,
        borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.16),
      })}
    >
      <CardContent>
        <Stack spacing={1.75}>
          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            <KepIcon name="problem" fontSize={20} />
            <Typography variant="subtitle2" fontWeight={800} noWrap>
              {t('contests.problemsPreview')}
            </Typography>
          </Stack>

          {children}

          <Button
            component={RouterLink}
            to={getProblemsHref(contest, contestId)}
            size="small"
            variant="text"
            endIcon={<IconifyIcon icon="mdi:arrow-right" />}
            sx={{ alignSelf: 'flex-start', px: 0 }}
          >
            {t('contests.view')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ProblemTitle = ({
  contest,
  contestId,
  problem,
}: {
  contest?: ContestDetail;
  contestId?: number;
  problem: ContestProblemEntity;
}) => (
  <Typography
    variant="subtitle2"
    fontWeight={800}
    component={RouterLink}
    to={getProblemHref(problem, contest, contestId)}
    color="text.primary"
    sx={{
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      '&:hover': { color: 'primary.main' },
    }}
  >
    {problem.problem.title}
  </Typography>
);

const SolvedRatioBar = ({
  solved,
  tooltip,
  total,
  unsolved,
}: {
  solved: number;
  tooltip: ReactNode;
  total: number;
  unsolved: number;
}) => {
  const solvedPercent = total ? Math.min((solved / total) * 100, 100) : 0;
  const unsolvedPercent = total ? Math.min((unsolved / total) * 100, 100 - solvedPercent) : 0;

  return (
    <Tooltip title={tooltip} arrow>
      <Box
        sx={(theme) => ({
          height: 10,
          overflow: 'hidden',
          borderRadius: 999,
          bgcolor: theme.vars.palette.background.neutral,
          boxShadow: `inset 0 1px 3px ${cssVarRgba(theme.vars.palette.grey['500Channel'], 0.28)}`,
          cursor: 'help',
        })}
      >
        <Stack direction="row" sx={{ height: 1 }}>
          <Box sx={{ width: `${solvedPercent}%`, bgcolor: 'success.main' }} />
          <Box sx={{ width: `${unsolvedPercent}%`, bgcolor: 'error.main' }} />
        </Stack>
      </Box>
    </Tooltip>
  );
};

const ProblemsProgressList = ({
  contest,
  contestId,
  problems,
}: {
  contest?: ContestDetail;
  contestId?: number;
  problems: ContestProblemEntity[];
}) => {
  const { t } = useTranslation();
  const totalContestants = Math.max(
    contest?.contestantsCount ?? contest?.registrantsCount ?? 0,
    ...problems.map(
      (problem) =>
        (problem.solved ?? 0) +
        (problem.unsolved ?? Math.max((problem.attemptUsersCount ?? 0) - (problem.solved ?? 0), 0)),
    ),
  );

  return (
    <Stack spacing={1.5}>
      {problems.map((problem) => {
        const solved = problem.solved ?? 0;
        const unsolved = problem.unsolved ?? Math.max((problem.attemptUsersCount ?? 0) - solved, 0);
        const tooltip = (
          <>
            {t('contests.solvedShort', { solved })} / {t('contests.unsolvedShort', { unsolved })}
          </>
        );

        return (
          <Stack key={problem.symbol} spacing={0.75}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                <Chip label={problem.symbol} size="small" color="primary" variant="outlined" />
                <ProblemTitle contest={contest} contestId={contestId} problem={problem} />
              </Stack>

              <Stack direction="row" spacing={0.75} alignItems="center" flexShrink={0}>
                <Typography variant="caption" color="success.main" fontWeight={900}>
                  {solved}
                </Typography>
                <Typography variant="caption" color="error.main" fontWeight={900}>
                  {unsolved}
                </Typography>
              </Stack>
            </Stack>

            <SolvedRatioBar
              solved={solved}
              tooltip={tooltip}
              total={totalContestants}
              unsolved={unsolved}
            />
          </Stack>
        );
      })}
    </Stack>
  );
};

const LoadingState = () => (
  <Stack spacing={1.25}>
    {Array.from({ length: 3 }).map((_, index) => (
      <Stack key={index} spacing={0.75}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton variant="rounded" width={42} height={24} />
          <Skeleton variant="text" width="70%" />
        </Stack>
        <Skeleton variant="rounded" width="100%" height={10} />
      </Stack>
    ))}
  </Stack>
);

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <Typography variant="body2" color="text.secondary">
      {t('contests.noProblems')}
    </Typography>
  );
};

const ContestPageProblemsPreviewCard = ({
  contest,
  contestId,
  contestProblems,
  isLoading,
}: ContestPageProblemsPreviewCardProps) => {
  const problems = contestProblems?.slice(0, 12) ?? [];

  return (
    <Shell contest={contest} contestId={contestId}>
      {problems.length ? (
        <ProblemsProgressList contest={contest} contestId={contestId} problems={problems} />
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <EmptyState />
      )}
    </Shell>
  );
};

export default ContestPageProblemsPreviewCard;
