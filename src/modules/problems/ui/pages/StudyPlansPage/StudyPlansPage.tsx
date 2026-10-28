import { useTranslation } from 'react-i18next';
import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useStudyPlansPage } from 'modules/problems/application/hooks/useStudyPlansPage';
import StudyPlanCard from 'modules/problems/ui/shared/components/StudyPlanCard.tsx';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';

const StudyPlansPage = () => {
  const { studyPlans, isLoading } = useStudyPlansPage();

  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader title={t('problems.studyPlans.pageTitle')} backTo={resources.Problems} />

      <Box sx={{ p: 'var(--kep-content-inset)' }}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Grid key={`study-plan-skeleton-${index}`} size={{ xs: 12, md: 6, xl: 4 }}>
                    <Skeleton variant="rounded" height={280} />
                  </Grid>
                ))
              : (studyPlans ?? []).map((studyPlan) => (
                  <Grid key={studyPlan.id} size={{ xs: 12, md: 6, xl: 4 }}>
                    <StudyPlanCard studyPlan={studyPlan} />
                  </Grid>
                ))}
          </Grid>
        </Stack>
      </Box>
    </FramedPage>
  );
};

export default StudyPlansPage;
