import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getResourceByParams, resources } from 'app/routes/resources';
import {
  ContestProblemEntity,
  ContestProblemInfo,
} from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestTypeInfo } from 'modules/contests/domain/entities/contest.entity';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import {
  contestHasBalls,
  contestHasPenalties,
  contestUsesRating,
  formatContestPoints,
} from 'modules/contests/ui/shared/utils/contestType.ts';

interface ContestantResultsFooterProps {
  contestant?: ContestantEntity | null;
  contestProblems: ContestProblemEntity[];
  contestId?: number;
  contestType?: string;
  contestTypeInfo?: ContestTypeInfo | null;
  isRated?: boolean;
}

const ContestantResultsFooter = ({
  contestant,
  contestProblems,
  contestId,
  contestType,
  contestTypeInfo,
  isRated,
}: ContestantResultsFooterProps) => {
  if (!contestant) {
    return null;
  }

  const formatResult = (info?: ContestProblemInfo | null) => {
    if (!info) return { label: '-', color: 'default' as const };
    if (contestHasBalls(contestType as any, contestTypeInfo)) {
      if ((info.points ?? 0) > 0) {
        return { label: formatContestPoints(info.points), color: 'primary' as const };
      }
      return { label: '0', color: 'default' as const };
    }
    if (info.firstAcceptedTime) {
      return { label: '+', color: 'success' as const };
    }
    if (info.attemptsCount > 0) {
      return { label: `-${info.attemptsCount}`, color: 'error' as const };
    }
    return { label: '-', color: 'default' as const };
  };

  const hasRank = contestant.rank !== undefined && contestant.rank !== null && contestant.rank > 0;
  const hasPoints = contestant.points !== undefined && contestant.points !== null;
  const showPenalties =
    contestant.rowType !== 'upsolve' && contestHasPenalties(contestType as any, contestTypeInfo);
  const showDelta =
    contestUsesRating(contestType as any, isRated) &&
    contestant.rowType !== 'upsolve' &&
    !contestant.isVirtual;
  const delta = contestant.delta ?? 0;
  const deltaColor = delta > 0 ? 'success' : delta < 0 ? 'error' : 'default';
  const deltaLabel = delta ? `${delta > 0 ? '+' : ''}${delta}` : '0';

  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,
        flexShrink: 0,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          {hasRank ? (
            <Typography variant="metric" fontSize={20}>
              #{contestant.rank}
            </Typography>
          ) : null}
          <ContestantView
            contestant={contestant}
            imgSize={28}
            isVirtual={contestant.isVirtual}
            isUnrated={contestant.isUnrated}
            isOfficial={contestant.isOfficial}
          />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="metric" fontSize={20} color="primary.main">
              {hasPoints ? formatContestPoints(contestant.points) : '-'}
            </Typography>
            {showPenalties ? (
              <Typography variant="caption" color="error.main">
                ({contestant.penalties ?? 0})
              </Typography>
            ) : null}
          </Stack>
          {showDelta ? (
            <Typography
              variant="metric"
              color={deltaColor === 'default' ? 'text.secondary' : `${deltaColor}.main`}
            >
              {deltaLabel}
            </Typography>
          ) : null}
          {contestUsesRating(contestType as any, isRated) && contestant.isVirtual ? (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {contestProblems.map((problem) => {
            const info =
              contestant.problemsInfo?.find((item) => item.problemSymbol === problem.symbol) ??
              null;
            const result = formatResult(info);
            const problemHref = contestId
              ? getResourceByParams(resources.ContestProblem, {
                  id: contestId,
                  symbol: problem.symbol,
                })
              : undefined;
            return (
              <Stack
                component={problemHref ? RouterLink : 'div'}
                to={problemHref}
                direction="row"
                spacing={1}
                alignItems="center"
                key={problem.symbol}
                sx={(theme) => ({
                  textDecoration: 'none',
                  color: 'inherit',
                  borderRadius: 0,
                  px: 1.25,
                  py: 0.75,
                  border: '1px solid',
                  borderColor:
                    result.color === 'default'
                      ? alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 1)
                      : alpha(theme.palette[result.color].main, 0.6),
                  backgroundColor:
                    result.color === 'default'
                      ? alpha(
                          theme.palette.common.white,
                          theme.palette.mode === 'dark' ? 0.04 : 0.02,
                        )
                      : alpha(
                          theme.palette[result.color].main,
                          theme.palette.mode === 'dark' ? 0.16 : 0.1,
                        ),
                  minWidth: 54,
                  transition: theme.transitions.create(['border-color', 'background-color']),
                  '&:hover': problemHref
                    ? {
                        borderColor: alpha(theme.palette.primary.main, 0.7),
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    : undefined,
                })}
              >
                <Typography variant="label" color="text.secondary">
                  {problem.symbol}
                </Typography>
                <Typography
                  variant="metric"
                  color={result.color === 'default' ? 'text.primary' : `${result.color}.main`}
                  sx={{ lineHeight: 1.2 }}
                >
                  {result.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ContestantResultsFooter;
