import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { useContestProblemsPage } from 'modules/contests/application/hooks/useContestProblemsPage';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import { contestHasBalls } from 'modules/contests/ui/shared/utils/contestType';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';

const ContestProblemsPage = () => {
  const { contest, isContestLoading, contestError, problems, error, contestId, canLoad, loading } =
    useContestProblemsPage();

  const { t } = useTranslation();
  return (
    <ContestPageLayout
      flush
      error={contestError || error}
      header={
        <ContestPageHeader
          title={contest?.title ?? t('contests.tabs.problems')}
          contest={contest}
          contestId={contestId}
          isLoading={isContestLoading}
        />
      }
    >
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, lg: 9 }} sx={{ minWidth: 0 }}>
          <Card variant="section">
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider' }}
            >
              <IconifyIcon icon="mdi:code-tags" sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography component="h2" variant="label">
                {t('contests.detail.problemSet')}
              </Typography>
              <Typography variant="metric" color="primary.main" sx={{ ml: 'auto', fontSize: 22 }}>
                {loading ? '—' : problems.length}
              </Typography>
            </Stack>
            {loading ? (
              <Stack>
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    height={100}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  />
                ))}
              </Stack>
            ) : problems.length ? (
              <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {problems.map((problem) => {
                  const href = getResourceByParams(resources.ContestProblem, {
                    id: contest?.id ?? contestId ?? '',
                    symbol: problem.symbol,
                  });
                  const color = problem.isSolved
                    ? 'success.main'
                    : problem.isAttempted
                      ? 'error.main'
                      : 'primary.main';
                  const solved = problem.solved ?? 0;
                  const unsolved = Math.max(0, (problem.attemptUsersCount ?? 0) - solved);
                  return (
                    <Stack
                      component="li"
                      key={problem.symbol}
                      direction={{ xs: 'column', sm: 'row' }}
                      gap={2}
                      alignItems={{ sm: 'center' }}
                      sx={{
                        p: 2.5,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 0 },
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Stack
                        direction="row"
                        gap={2}
                        alignItems="center"
                        sx={{ minWidth: 0, flex: 1 }}
                      >
                        <Typography variant="metric" sx={{ minWidth: 42, fontSize: 26, color }}>
                          {problem.symbol}
                        </Typography>
                        <Stack gap={0.75} sx={{ minWidth: 0 }}>
                          <Typography
                            component={RouterLink}
                            to={href}
                            variant="body1"
                            sx={{
                              color: 'text.primary',
                              textDecoration: 'none',
                              fontWeight: 600,
                              overflowWrap: 'anywhere',
                              '&:hover': { color: 'primary.main' },
                            }}
                          >
                            <MixedText>{problem.problem.title}</MixedText>
                          </Typography>
                          <Stack
                            direction="row"
                            gap={1.5}
                            useFlexGap
                            flexWrap="wrap"
                            color="text.secondary"
                          >
                            {[
                              {
                                label: t('problems.detail.timeLimit'),
                                value: problem.problem.timeLimit + ' ms',
                                icon: 'mdi:timer-outline',
                              },
                              {
                                label: t('problems.detail.memoryLimit'),
                                value: problem.problem.memoryLimit + ' MB',
                                icon: 'mdi:memory',
                              },
                            ].map((limit) => (
                              <Tooltip key={limit.icon} title={limit.label}>
                                <Stack
                                  direction="row"
                                  gap={0.6}
                                  alignItems="center"
                                  aria-label={limit.label + ': ' + limit.value}
                                >
                                  <IconifyIcon
                                    icon={limit.icon}
                                    aria-hidden="true"
                                    sx={{ fontSize: 16 }}
                                  />
                                  <Typography
                                    variant="metric"
                                    component="span"
                                    sx={{ fontSize: 14, lineHeight: 1.4, whiteSpace: 'nowrap' }}
                                  >
                                    {limit.value}
                                  </Typography>
                                </Stack>
                              </Tooltip>
                            ))}
                          </Stack>
                        </Stack>
                      </Stack>
                      <Stack direction="row" gap={2} alignItems="center" useFlexGap flexWrap="wrap">
                        {contestHasBalls(contest?.type, contest?.typeInfo) && (
                          <Chip variant="status" size="small" label={problem.ball ?? '—'} />
                        )}
                        {[
                          {
                            label: t('contests.solvedShort', { solved }),
                            value: solved,
                            color: 'success.main',
                            icon: 'mdi:check-circle-outline',
                          },
                          {
                            label: t('contests.unsolvedShort', { unsolved }),
                            value: unsolved,
                            color: 'error.main',
                            icon: 'mdi:close-circle-outline',
                          },
                        ].map((stat) => (
                          <Tooltip key={stat.icon} title={stat.label}>
                            <Stack
                              component="span"
                              direction="row"
                              gap={0.75}
                              alignItems="center"
                              aria-label={stat.label}
                              sx={{ color: stat.color }}
                            >
                              <IconifyIcon
                                icon={stat.icon}
                                aria-hidden="true"
                                sx={{ fontSize: 18 }}
                              />
                              <Typography
                                variant="metric"
                                component="span"
                                sx={{ fontSize: 18, lineHeight: 1.4 }}
                              >
                                {stat.value}
                              </Typography>
                            </Stack>
                          </Tooltip>
                        ))}
                        <Tooltip title={t('contests.detail.solve')}>
                          <Link
                            component={RouterLink}
                            to={href}
                            underline="none"
                            aria-label={`${t('contests.detail.solve')}: ${problem.problem.title}`}
                            sx={{
                              ml: { xs: 'auto', sm: 0.5 },
                              width: 40,
                              height: 40,
                              flexShrink: 0,
                              display: 'grid',
                              placeItems: 'center',
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: '50%',
                              color: 'text.secondary',
                              '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
                              '&:focus-visible': {
                                outline: '2px solid',
                                outlineColor: 'primary.main',
                                outlineOffset: 3,
                              },
                            }}
                          >
                            <IconifyIcon
                              icon="mdi:arrow-top-right"
                              aria-hidden="true"
                              sx={{ fontSize: 23 }}
                            />
                          </Link>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  );
                })}
              </Box>
            ) : (
              <CardContent>
                <Typography color="text.secondary">
                  {t(canLoad ? 'contests.noProblems' : 'contests.detail.lockedProblems')}
                </Typography>
              </CardContent>
            )}
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }} sx={{ borderLeft: { lg: '1px solid var(--kep-line)' } }}>
          <ContestCountdownCard contest={contest} isLoading={isContestLoading} />
        </Grid>
      </Grid>
    </ContestPageLayout>
  );
};
export default ContestProblemsPage;
