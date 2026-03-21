import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
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
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';
import { useStudyPlan } from '../../application/queries.ts';
import { difficultyOptions, getDifficultyColor } from '../../config/difficulty.ts';
import type { StudyPlanDetail } from '../../domain/entities/problem.entity.ts';
import { getStudyPlanBranding } from '../utils/studyPlanBranding.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

const StudyPlanPage = () => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const theme = useTheme();
  const studyPlanId = Number(params.id);
  const { data: studyPlan, isLoading } = useStudyPlan(
    Number.isNaN(studyPlanId) ? undefined : studyPlanId,
  );

  useDocumentTitle(
    studyPlan ? 'pageTitles.studyPlan' : undefined,
    studyPlan ? { studyPlanTitle: studyPlan.title } : undefined,
  );

  const solvedPercent = useMemo(() => {
    if (!studyPlan?.problemsCount) return 0;
    return Math.round((100 * (studyPlan.statistics.totalSolved ?? 0)) / studyPlan.problemsCount);
  }, [studyPlan?.problemsCount, studyPlan?.statistics.totalSolved]);

  const branding = getStudyPlanBranding(studyPlan ?? {}, theme.palette.mode);

  return (
    <Stack spacing={4} mt={4}>
      <Box sx={{ px: { xs: 3, md: 5 }, pb: { xs: 5, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              <StudyPlanHero studyPlan={studyPlan} isLoading={isLoading} />

              {isLoading ? (
                <Skeleton variant="rounded" height={360} />
              ) : studyPlan ? (
                <StudyPlanDaysSection studyPlan={studyPlan} />
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2}>
              <Button startIcon={<IconifyIcon icon="mdi:chevron-left"/>} component={RouterLink} to={resources.StudyPlans} variant="soft">
                {t('problems.studyPlans.backToPlans')}
              </Button>

              <Stack spacing={3}>
                {isLoading ? (
                  <Skeleton variant="rounded" height={240} />
                ) : studyPlan ? (
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderColor: branding.borderColor,
                      bgcolor: branding.surfaceColor,
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Typography variant="h6">{t('problems.studyPlans.metaTitle')}</Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip
                            variant="outlined"
                            label={t('problems.studyPlans.daysCount', {
                              count: studyPlan.daysCount ?? 0,
                            })}
                          />
                          <Chip
                            variant="outlined"
                            label={t('problems.studyPlans.problemsCount', {
                              count: studyPlan.problemsCount ?? 0,
                            })}
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ) : null}
              </Stack>

              {isLoading ? (
                <Skeleton variant="rounded" height={240} />
              ) : (
                <StudyPlanProgressCard
                  solvedPercent={solvedPercent}
                  problemsCount={studyPlan?.problemsCount ?? 0}
                  statistics={studyPlan?.statistics}
                  accentColor={branding.accentColor}
                  borderColor={branding.borderColor}
                  progressTrackColor={branding.progressTrackColor}
                  surfaceColor={branding.surfaceColor}
                />
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

type StudyPlanHeroProps = {
  studyPlan?: Pick<
    StudyPlanDetail,
    'code' | 'title' | 'description' | 'icon' | 'themeColor' | 'themeColorSecondary'
  >;
  isLoading: boolean;
};

const StudyPlanHero = ({ studyPlan, isLoading }: StudyPlanHeroProps) => {
  const theme = useTheme();
  const branding = getStudyPlanBranding(studyPlan ?? {}, theme.palette.mode);

  if (isLoading) {
    return <Skeleton variant="rounded" height={260} />;
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: branding.surfaceColor,
        color: 'text.primary',
        border: '1px solid',
        borderColor: branding.borderColor,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', md: '2.35rem' } }}>
              {studyPlan?.title}
            </Typography>
            <Box
              mt={2}
              sx={{
                color: 'text.secondary',
                '& p': { m: 0 },
              }}
            >
              <MathJaxView rawHtml={studyPlan?.description} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {branding.iconSrc ? (
              <Box
                component="img"
                src={branding.iconSrc}
                alt={studyPlan?.title}
                sx={{
                  width: '100%',
                  maxWidth: 220,
                  display: 'block',
                  mx: { xs: 'auto', md: '0' },
                  ml: { md: 'auto' },
                  filter: 'drop-shadow(0 18px 30px rgba(15, 23, 42, 0.2))',
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
  statistics: {
    totalSolved: number;
    [key: string]: number;
  };
  accentColor: string;
  borderColor: string;
  progressTrackColor: string;
  surfaceColor: string;
};

const StudyPlanProgressCard = ({
  solvedPercent,
  problemsCount,
  statistics,
  accentColor,
  borderColor,
  progressTrackColor,
  surfaceColor,
}: StudyPlanProgressCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor,
        bgcolor: surfaceColor,
      }}
    >
      <CardContent>
        <Stack spacing={2.5}>
          <div>
            <Typography variant="h6">{t('problems.studyPlans.progressTitle')}</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {t('problems.studyPlans.progressSubtitle', {
                solved: statistics.totalSolved ?? 0,
                total: problemsCount,
              })}
            </Typography>
          </div>

          <Box>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2">{t('problems.studyPlans.completed')}</Typography>
              <Typography variant="subtitle2">{solvedPercent}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={solvedPercent}
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: progressTrackColor,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  bgcolor: accentColor,
                },
              }}
            />
          </Box>

          <Stack spacing={1.5}>
            {difficultyOptions.map((difficulty) => {
              const solved = statistics[difficulty.key] ?? 0;
              const total =
                statistics[`all${difficulty.key[0].toUpperCase()}${difficulty.key.slice(1)}`] ?? 0;
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
                    sx={{ height: 8, borderRadius: 999 }}
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
  const theme = useTheme();
  const branding = getStudyPlanBranding(studyPlan, theme.palette.mode);

  return (
    <Stack spacing={5}>
      <div>
        <Typography variant="h5">{t('problems.studyPlans.trackTitle')}</Typography>
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
            <Typography variant="h6">{day.title}</Typography>
          </Stack>

          <Box sx={{ '& p': { my: 0 } }}>
            <MathJaxView rawHtml={day.description} />
          </Box>

          {day.problems.length > 0 ? (
            <Stack spacing={1.25}>
              {day.problems.map((problem) => (
                <Card
                  key={problem.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    bgcolor: problem.userInfo?.hasSolved
                      ? alpha('#16a34a', 0.08)
                      : problem.userInfo?.hasAttempted
                        ? alpha('#dc2626', 0.06)
                        : undefined,
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

export default StudyPlanPage;
