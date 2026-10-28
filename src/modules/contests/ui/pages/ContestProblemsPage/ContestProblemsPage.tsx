import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { useContestProblemsPage } from 'modules/contests/application/hooks/useContestProblemsPage';
import ContestCountdownCard from 'modules/contests/ui/shared/components/ContestCountdownCard';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import { contestHasBalls } from 'modules/contests/ui/shared/utils/contestType';
import IconifyIcon from 'shared/components/base/IconifyIcon';

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
                            {problem.problem.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {problem.problem.timeLimit} ms · {problem.problem.memoryLimit} MB
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack direction="row" gap={1} alignItems="center" useFlexGap flexWrap="wrap">
                        {contestHasBalls(contest?.type, contest?.typeInfo) && (
                          <Chip variant="status" size="small" label={problem.ball ?? '—'} />
                        )}
                        <Chip
                          icon={<IconifyIcon icon="mdi:check-circle-outline" />}
                          variant="status"
                          size="small"
                          color="success"
                          label={problem.solved ?? 0}
                        />
                        <Chip
                          icon={<IconifyIcon icon="mdi:close-circle-outline" />}
                          variant="status"
                          size="small"
                          color="error"
                          label={Math.max(
                            0,
                            (problem.attemptUsersCount ?? 0) - (problem.solved ?? 0),
                          )}
                        />
                        <Button
                          component={RouterLink}
                          to={href}
                          variant="outlined"
                          size="small"
                          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
                          sx={{ ml: { xs: 'auto', sm: 0.5 } }}
                        >
                          {t('contests.detail.solve')}
                        </Button>
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
