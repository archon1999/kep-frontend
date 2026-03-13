import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import KepIcon from 'shared/components/base/KepIcon';
import ContestCountdownCard from '../components/ContestCountdownCard';
import { useContest, useContestProblems } from '../../application/queries';
import { contestHasBalls } from '../../utils/contestType';
import ContestPageHeader from '../components/ContestPageHeader';

const ContestProblemsPage = () => {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { t } = useTranslation();

  const { data: contest, isLoading: isContestLoading } = useContest(contestId);
  const { data: problems = [], isLoading } = useContestProblems(contestId);
  useDocumentTitle(
    contest?.title ? 'pageTitles.contestProblems' : undefined,
    contest?.title
      ? {
          contestTitle: contest.title,
        }
      : undefined,
  );

  const isProblemsLoading = isContestLoading || isLoading;

  return (
    <Stack spacing={3} sx={responsivePagePaddingSx}>
      <ContestPageHeader
        title={contest?.title ?? t('contests.tabs.problems')}
        contest={contest as any}
        contestId={contestId}
        isLoading={isContestLoading}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={1.25}>
            {isProblemsLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      bgcolor: 'background.elevation1',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      justifyContent: 'space-between',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                      <Skeleton variant="rounded" width={48} height={24} />
                      <Stack spacing={0.5} minWidth={0} flex={1}>
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="45%" />
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                      <Skeleton variant="rounded" width={48} height={28} />
                      <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width={64} height={28} />
                        <Skeleton variant="rounded" width={64} height={28} />
                      </Stack>
                    </Stack>
                  </Box>
                ))
              : problems.map((problem) => (
                  <Box
                    key={problem.symbol}
                    component={RouterLink}
                    to={getResourceByParams(resources.ContestProblem, {
                      id: contest?.id ?? contestId ?? '',
                      symbol: problem.symbol,
                    })}
                    sx={{
                      p: 1.5,
                      bgcolor: 'background.elevation1',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      color: 'inherit',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: (theme) =>
                        theme.transitions.create(
                          ['transform', 'box-shadow', 'border-color', 'background-color'],
                          {
                            duration: theme.transitions.duration.shorter,
                          },
                        ),
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                        borderColor: 'primary.main',
                        bgcolor: 'background.paper',
                      },
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 2,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                      <Chip label={problem.symbol} color="primary" size="small" />
                      <Stack spacing={0.25} minWidth={0}>
                        <Typography sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }} noWrap>
                          {problem.problem.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {problem.problem.timeLimit} ms, {problem.problem.memoryLimit} MB
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                      {contestHasBalls(contest?.type) && (
                        <Chip label={problem.ball ?? '˘?"'} size="small" variant="outlined" />
                      )}
                      <Stack direction="row" spacing={1}>
                        <Chip
                          icon={<KepIcon name="solved" fontSize={16} />}
                          label={problem.solved ?? 0}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                        <Chip
                          icon={<KepIcon name="unsolved" fontSize={16} />}
                          label={(problem.attemptUsersCount ?? 0) - (problem.solved ?? 0)}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </Stack>
                    </Stack>
                  </Box>
                ))}
            {!problems.length && !isProblemsLoading ? (
              <Typography variant="body2" color="text.secondary">
                {t('contests.noProblems')}
              </Typography>
            ) : null}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ContestCountdownCard contest={contest} isLoading={isContestLoading} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ContestProblemsPage;
