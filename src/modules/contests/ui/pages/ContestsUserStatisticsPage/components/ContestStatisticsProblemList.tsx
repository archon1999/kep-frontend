import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Stack, Typography } from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import type { ContestUserStatisticsUnsolvedProblem } from 'modules/contests/domain/entities/contest-user-statistics.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface ProblemRow extends ContestUserStatisticsUnsolvedProblem {
  attemptsCount?: number;
  solved?: boolean;
}

const ContestStatisticsProblemList = ({
  problems,
  emptyText,
}: {
  problems: ProblemRow[];
  emptyText: string;
}) => {
  const { t } = useTranslation();
  if (!problems.length)
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    );
  return (
    <Box sx={{ maxHeight: 360, overflowY: 'auto', scrollbarGutter: 'stable' }}>
      {problems.map((problem) => (
        <Box
          key={`${problem.contestId}-${problem.problemSymbol}`}
          component={RouterLink}
          to={getResourceByParams(resources.ContestProblem, {
            id: problem.contestId,
            symbol: problem.problemSymbol,
          })}
          sx={{
            display: 'grid',
            gridTemplateColumns: '48px minmax(0, 1fr) auto',
            gap: 1.25,
            alignItems: 'center',
            py: 1.25,
            borderBottom: 1,
            borderColor: 'divider',
            textDecoration: 'none',
            color: 'inherit',
            '&:last-child': { borderBottom: 0 },
            '&:hover, &:focus-visible': { bgcolor: 'action.hover', color: 'primary.main' },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          }}
        >
          <Typography
            variant="metric"
            color="primary.main"
            fontSize={18}
            sx={{ overflowWrap: 'anywhere' }}
          >
            {problem.problemSymbol}
          </Typography>
          <Stack spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              title={problem.contestTitle}
              sx={{
                fontWeight: 500,
                fontSize: 13,
                lineHeight: 1.5,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {problem.contestTitle}
            </Typography>
            {problem.attemptsCount != null && (
              <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                <Typography variant="caption" color="text.secondary">
                  {t('contests.statistics.attemptsCount', { count: problem.attemptsCount })}
                </Typography>
                <Typography
                  variant="caption"
                  color={problem.solved ? 'success.main' : 'text.secondary'}
                  sx={{ fontSize: 10 }}
                >
                  {t(
                    problem.solved ? 'contests.statistics.solved' : 'contests.statistics.unsolved',
                  )}
                </Typography>
              </Stack>
            )}
          </Stack>
          <IconifyIcon
            icon="material-symbols:arrow-outward-rounded"
            fontSize={16}
            sx={{ color: 'text.secondary' }}
          />
        </Box>
      ))}
    </Box>
  );
};
export default ContestStatisticsProblemList;
