import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Chip, Link, Stack, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { getResourceByParams, resources } from 'app/routes/resources';
import type { ContestStandingsPageModel } from 'modules/contests/application/hooks/useContestStandingsPage';
import { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import ContestantProblemResultCell from 'modules/contests/ui/shared/components/ContestantProblemResultCell';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import {
  contestHasPenalties,
  contestUsesRating,
  formatContestPoints,
} from 'modules/contests/ui/shared/utils/contestType';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';

const getPerformanceLabel = (row: ContestantEntity) =>
  row.rank === 1 ? '∞' : (row.performance ?? '—');

const getContestantProblemInfo = (row: ContestantEntity, problemSymbol: string) =>
  row.problemsInfo?.find((item) => item.problemSymbol === problemSymbol) ?? null;

type Options = Pick<ContestStandingsPageModel, 'contest' | 'contestId' | 'contestProblems'> & {
  isCompactLayout: boolean;
};
export const useContestStandingsColumns = ({
  contest,
  contestId,
  contestProblems,
  isCompactLayout,
}: Options) => {
  const { t } = useTranslation();
  const problemMap = useMemo(
    () => new Map(contestProblems.map((problem) => [problem.symbol, problem])),
    [contestProblems],
  );

  const columns: GridColDef<ContestantEntity>[] = useMemo(() => {
    const base: GridColDef<ContestantEntity>[] = [
      {
        field: 'rank',
        headerName: t('contests.standings.place'),
        minWidth: isCompactLayout ? 40 : 70,
        width: isCompactLayout ? 42 : undefined,
        flex: isCompactLayout ? undefined : 0.3,
        sortable: false,
        renderHeader: (params) => (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1 }}>
            <Typography variant="subtitle2" fontWeight={500} color="text.primary">
              {params.colDef.headerName}
            </Typography>
          </Stack>
        ),
        renderCell: ({ row }) =>
          row.rowType === 'upsolve' ? null : (
            <Typography variant="body2" fontWeight={700}>
              {row.rank ?? '—'}
            </Typography>
          ),
      },
      {
        field: 'username',
        headerName: t('contests.standings.contestant'),
        minWidth: isCompactLayout ? 128 : 200,
        flex: isCompactLayout ? 1 : 1.2,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
            <ContestantView
              contestant={row}
              imgSize={isCompactLayout ? 22 : 28}
              isVirtual={row.isVirtual}
              isUnrated={row.isUnrated}
              isOfficial={row.isOfficial}
              showCountry
              showFullName={!isCompactLayout}
              disablePopover
            />
          </Stack>
        ),
      },
      {
        field: 'points',
        headerName: t('contests.standings.points'),
        minWidth: isCompactLayout ? 58 : 60,
        width: isCompactLayout ? 64 : undefined,
        flex: isCompactLayout ? undefined : 0.8,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" fontWeight={800} color="primary.main">
              {row.points === undefined || row.points === null
                ? '-'
                : formatContestPoints(row.points)}
            </Typography>
            {row.rowType !== 'upsolve' && contestHasPenalties(contest?.type, contest?.typeInfo) ? (
              <Typography variant="caption" color="error.main">
                ({row.penalties ?? 0})
              </Typography>
            ) : null}
          </Stack>
        ),
      },
    ];

    if (contestUsesRating(contest?.type, contest?.isRated)) {
      base.push({
        field: 'delta',
        headerName: t('contests.standings.delta'),
        minWidth: isCompactLayout ? 86 : 110,
        flex: isCompactLayout ? undefined : 0.6,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderHeader: () => (
          <Tooltip title={t('contests.standings.delta')} arrow>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.primary',
              }}
            >
              <IconifyIcon icon="mdi:delta" fontSize={20} />
            </Box>
          </Tooltip>
        ),
        renderCell: ({ row }) => {
          if (row.rowType === 'upsolve' || row.isVirtual) {
            return (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            );
          }

          const deltaValue = row.delta ?? 0;
          const deltaLabel = `${deltaValue > 0 ? '+' : ''}${deltaValue}`;

          return (
            <Chip
              label={deltaLabel}
              color={
                row.delta && row.delta > 0
                  ? 'success'
                  : row.delta && row.delta < 0
                    ? 'error'
                    : 'default'
              }
              size="small"
              variant="outlined"
            />
          );
        },
      });

      base.push({
        field: 'performance',
        headerName: t('contests.standings.performance'),
        minWidth: isCompactLayout ? 86 : 100,
        flex: isCompactLayout ? undefined : 0.7,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }) =>
          row.rowType === 'upsolve' || row.isVirtual ? (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          ) : (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="body2" fontWeight={700}>
                {getPerformanceLabel(row)}
              </Typography>
              {row.performanceTitle ? (
                <ContestsRatingChip title={row.performanceTitle} imgSize={22} />
              ) : null}
            </Stack>
          ),
      });
    }

    const problemColumns: GridColDef<ContestantEntity>[] = contestProblems.map(
      (problem: ContestProblemEntity) => ({
        field: `problem-${problem.symbol}`,
        headerName: problem.symbol,
        minWidth: isCompactLayout ? 54 : 100,
        width: isCompactLayout ? 56 : undefined,
        headerAlign: 'center',
        flex: isCompactLayout ? undefined : 0.8,
        sortable: false,
        renderHeader: (params) => {
          const symbol = params.colDef.field.replace('problem-', '');
          const problem = problemMap.get(symbol);
          const problemLink = contestId
            ? getResourceByParams(resources.ContestProblem, { id: contestId, symbol })
            : '#';

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: isCompactLayout ? 0.25 : 1.5,
                py: isCompactLayout ? 0.25 : 1,
                borderRight: 1,
                borderColor: 'divider',
                '&:last-of-type': { borderRight: 'none' },
              }}
            >
              <Tooltip title={problem?.problem.title ?? ''} arrow>
                <Link
                  component={RouterLink}
                  to={problemLink}
                  underline="hover"
                  color="text.primary"
                  sx={{
                    fontWeight: 700,
                    fontSize: isCompactLayout ? '0.75rem' : undefined,
                    lineHeight: isCompactLayout ? 1.1 : undefined,
                  }}
                >
                  {problem?.symbol ?? symbol}
                </Link>
              </Tooltip>
              {!isCompactLayout ? (
                <Stack direction="row" spacing={0.4} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    (
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {problem?.solved ?? 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    /
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    {problem?.unsolved ?? 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    /
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {problem?.attemptsCount ?? 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    )
                  </Typography>
                </Stack>
              ) : null}
            </Box>
          );
        },
        renderCell: ({ row }) => {
          const info = getContestantProblemInfo(row, problem.symbol);
          return (
            <ContestantProblemResultCell
              contestType={contest?.type}
              typeInfo={contest?.typeInfo}
              info={info}
              problem={problem}
              rowType={row.rowType}
            />
          );
        },
      }),
    );

    return [...base, ...problemColumns];
  }, [
    contest?.id,
    contest?.isRated,
    contest?.type,
    contest?.typeInfo,
    contestId,
    contestProblems,
    isCompactLayout,
    problemMap,
    t,
  ]);

  return columns;
};
