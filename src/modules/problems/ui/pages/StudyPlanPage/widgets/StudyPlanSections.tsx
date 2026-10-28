import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources';
import { contentInsetSx, interactiveContentSx } from 'app/theme/styles/content';
import { difficultyOptions, getDifficultyColor } from 'modules/problems/config/difficulty.ts';
import type {
  DifficultyBreakdown,
  StudyPlanDetail,
} from 'modules/problems/domain/entities/problem.entity.ts';
import { getStudyPlanBranding } from 'modules/problems/ui/shared/utils/studyPlanBranding.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';
import PatternArtwork from 'shared/components/common/PatternArtwork';

type StudyPlanHeroProps = {
  studyPlan?: Pick<
    StudyPlanDetail,
    'code' | 'title' | 'description' | 'icon' | 'themeColor' | 'themeColorSecondary'
  >;
  isLoading: boolean;
};

const StudyPlanHero = ({ studyPlan, isLoading }: StudyPlanHeroProps) => {
  const { mode, systemMode } = useColorScheme();
  const branding = getStudyPlanBranding(
    studyPlan ?? {},
    (mode === 'system' ? systemMode : mode) ?? 'light',
  );

  if (isLoading) {
    return <Skeleton variant="rounded" height={260} />;
  }

  return (
    <Card
      variant="section"
      sx={{
        overflow: 'hidden',
        bgcolor: 'transparent',
        color: 'text.primary',
      }}
    >
      <CardContent sx={contentInsetSx}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                color: 'text.secondary',
                '& p': { m: 0 },
              }}
            >
              <MathJaxView rawHtml={studyPlan?.description} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            {branding.iconSrc ? (
              <Box
                component="img"
                src={branding.iconSrc}
                alt={studyPlan?.title}
                sx={{
                  width: '100%',
                  maxWidth: 144,
                  filter: branding.iconFilter,
                  display: 'block',
                  mx: { xs: 'auto', md: '0' },
                  ml: { md: 'auto' },
                }}
              />
            ) : null}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

type StudyPlanProgressCardProps = {
  solvedPercent: number;
  problemsCount: number;
  statistics: DifficultyBreakdown | null;
  accentColor: string;
  progressTrackColor: string;
};

const StudyPlanProgressCard = ({
  solvedPercent,
  problemsCount,
  statistics,
  accentColor,
  progressTrackColor,
}: StudyPlanProgressCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="section">
      <CardContent sx={contentInsetSx}>
        <Stack spacing={2.5}>
          <div>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
              <Typography component="h2" variant="h6">
                {t('problems.studyPlans.progressTitle')}
              </Typography>
              <PatternArtwork kind="daily-tasks" sx={{ width: 96 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {t('problems.studyPlans.progressSubtitle', {
                solved: statistics?.totalSolved ?? 0,
                total: problemsCount,
              })}
            </Typography>
          </div>

          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2">{t('problems.studyPlans.completed')}</Typography>
              <Typography variant="metric" sx={{ fontSize: 24 }}>
                {solvedPercent}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={solvedPercent}
              sx={{
                height: 10,
                borderRadius: 0,
                bgcolor: progressTrackColor,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 0,
                  bgcolor: accentColor,
                },
              }}
            />
          </Box>

          <Stack spacing={1.5}>
            {difficultyOptions.map((difficulty) => {
              const key = difficulty.key as keyof DifficultyBreakdown;
              const totalKey =
                `all${difficulty.key[0].toUpperCase()}${difficulty.key.slice(1)}` as keyof DifficultyBreakdown;
              const solved = statistics?.[key] ?? 0;
              const total = statistics?.[totalKey] ?? 0;
              if (!total) return null;

              return (
                <Box key={difficulty.key}>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2">{t(difficulty.label)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {solved} / {total}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    color={getDifficultyColor(difficulty.value)}
                    value={(100 * solved) / total}
                    sx={{ height: 8, borderRadius: 0 }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const StudyPlanDaysSection = ({ studyPlan }: { studyPlan: StudyPlanDetail }) => {
  const { t } = useTranslation();
  const { mode, systemMode } = useColorScheme();
  const branding = getStudyPlanBranding(
    studyPlan,
    (mode === 'system' ? systemMode : mode) ?? 'light',
  );

  return (
    <Stack spacing={3}>
      <div>
        <Typography component="h2" variant="h5">
          {t('problems.studyPlans.trackTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {studyPlan.isPurchased
            ? t('problems.studyPlans.trackSubtitle')
            : t('problems.studyPlans.trackLockedSubtitle')}
        </Typography>
      </div>

      {studyPlan.days.map((day) => (
        <Stack key={day.day} spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip
              label={t('problems.studyPlans.dayLabel', { day: day.day })}
              sx={{
                color: branding.accentColor,
                borderColor: branding.borderColor,
                bgcolor: branding.surfaceStrongColor,
              }}
              variant="outlined"
            />
            <Typography component="h3" variant="h6">
              {day.title}
            </Typography>
          </Stack>

          <Box sx={{ '& p': { my: 0 } }}>
            <MathJaxView rawHtml={day.description} />
          </Box>

          {day.problems.length > 0 ? (
            <Stack spacing={0}>
              {day.problems.map((problem) => (
                <Card
                  key={problem.id}
                  variant="section"
                  sx={{
                    ...interactiveContentSx,
                    borderRadius: 0,
                    bgcolor: 'transparent',
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Stack spacing={1.5}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <div>
                          <Typography
                            variant="subtitle1"
                            component={RouterLink}
                            to={`${getResourceById(resources.Problem, problem.id)}?study-plan=${studyPlan.id}`}
                            sx={{
                              color: 'text.primary',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {problem.id}. {problem.title}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={1}>
                            {problem.tags.map((tag) => (
                              <Chip key={`${problem.id}-${tag.id}`} size="small" label={tag.name} />
                            ))}
                          </Stack>
                        </div>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {problem.userInfo?.hasSolved || problem.userInfo?.hasAttempted ? (
                            <IconifyIcon
                              icon={
                                problem.userInfo.hasSolved
                                  ? 'mdi:check-circle-outline'
                                  : 'mdi:progress-clock'
                              }
                              role="img"
                              aria-label={t(
                                problem.userInfo.hasSolved
                                  ? 'problems.statusSolved'
                                  : 'problems.statusUnsolved',
                              )}
                              sx={{
                                color: problem.userInfo.hasSolved ? 'success.main' : 'warning.main',
                                fontSize: 22,
                              }}
                            />
                          ) : null}
                          {problem.difficultyTitle ? (
                            <Chip
                              size="small"
                              color={getDifficultyColor(problem.difficulty)}
                              label={problem.difficultyTitle}
                            />
                          ) : null}
                          <Button
                            component={RouterLink}
                            to={`${getResourceById(resources.Problem, problem.id)}?study-plan=${studyPlan.id}`}
                            variant="contained"
                            size="small"
                          >
                            {t('problems.studyPlans.solve')}
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
};

export { StudyPlanHero, StudyPlanDaysSection, StudyPlanProgressCard };
