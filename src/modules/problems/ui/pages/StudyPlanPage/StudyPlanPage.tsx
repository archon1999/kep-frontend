import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { resources } from 'app/routes/resources';
import { contentGridSx, contentInsetSx } from 'app/theme/styles/content';
import { useStudyPlanPage } from 'modules/problems/application/hooks/useStudyPlanPage';
import {
  StudyPlanDaysSection,
  StudyPlanHero,
  StudyPlanProgressCard,
} from 'modules/problems/ui/pages/StudyPlanPage/widgets/StudyPlanSections';
import { getStudyPlanBranding } from 'modules/problems/ui/shared/utils/studyPlanBranding.ts';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';

const StudyPlanPage = () => {
  const { studyPlan, isLoading, solvedPercent } = useStudyPlanPage();

  const { t } = useTranslation();
  const { mode, systemMode } = useColorScheme();

  const branding = getStudyPlanBranding(
    studyPlan ?? {},
    (mode === 'system' ? systemMode : mode) ?? 'light',
  );

  return (
    <FramedPage>
      <PageHeader
        variant="detail"
        title={studyPlan?.title ?? t('problems.studyPlans.title')}
        backTo={resources.StudyPlans}
      />
      <Box
        sx={{
          ...contentGridSx,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(280px, 1fr)' },
        }}
      >
        <Box>
          <StudyPlanHero studyPlan={studyPlan} isLoading={isLoading} />
          <Box sx={contentInsetSx}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={360} />
            ) : studyPlan ? (
              <StudyPlanDaysSection studyPlan={studyPlan} />
            ) : null}
          </Box>
        </Box>
        <Box component="aside">
          <Box sx={{ ...contentInsetSx, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="label" component="h2" mb={2}>
              {t('problems.studyPlans.metaTitle')}
            </Typography>
            {isLoading ? (
              <Skeleton height={48} />
            ) : (
              <Stack direction="row" gap={3} flexWrap="wrap">
                <Typography component="p" variant="subtitle1">
                  {t('problems.studyPlans.daysCount', { count: studyPlan?.daysCount ?? 0 })}
                </Typography>
                <Typography component="p" variant="subtitle1">
                  {t('problems.studyPlans.problemsCount', { count: studyPlan?.problemsCount ?? 0 })}
                </Typography>
              </Stack>
            )}
          </Box>
          {isLoading ? (
            <Skeleton variant="rectangular" height={240} />
          ) : (
            <StudyPlanProgressCard
              solvedPercent={solvedPercent}
              problemsCount={studyPlan?.problemsCount ?? 0}
              statistics={studyPlan?.statistics ?? null}
              accentColor={branding.accentColor}
              progressTrackColor={branding.progressTrackColor}
            />
          )}
        </Box>
      </Box>
    </FramedPage>
  );
};

export default StudyPlanPage;
