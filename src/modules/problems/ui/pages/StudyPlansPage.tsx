import { Box, Button, Grid, Skeleton, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { resources } from 'app/routes/resources';
import { useStudyPlans } from '../../application/queries.ts';
import StudyPlanCard from '../components/StudyPlanCard.tsx';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';

const StudyPlansPage = () => {
  const { t } = useTranslation();
  const { data: studyPlans, isLoading } = useStudyPlans();

  return (
    <Stack spacing={4}>
      <PageHeader
        title={t('problems.studyPlans.pageTitle')}
        breadcrumb={[
          { label: t('home'), url: resources.Home },
          { label: t('problems.title'), url: resources.Problems },
          { label: t('problems.studyPlans.pageTitle'), active: true },
        ]}
        actionComponent={
          <Button component={RouterLink} to={resources.Problems} variant="text">
            {t('problems.studyPlans.backToProblems')}
          </Button>
        }
      />

      <Box sx={{ px: { xs: 3, md: 5 }, pb: { xs: 5, md: 6 } }}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            {(isLoading ? Array.from({ length: 3 }) : studyPlans ?? []).map((studyPlan, index) => (
              <Grid key={isLoading ? `study-plan-skeleton-${index}` : studyPlan.id} size={{ xs: 12, md: 6, xl: 4 }}>
                {isLoading ? (
                  <Skeleton variant="rounded" height={280} />
                ) : (
                  <StudyPlanCard studyPlan={studyPlan} />
                )}
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    </Stack>
  );
};

export default StudyPlansPage;
