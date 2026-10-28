import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Alert, Box, Button, Paper, Skeleton, Stack, useMediaQuery } from '@mui/material';
import { resources } from 'app/routes/resources';
import type { StudyPlanListItem } from 'modules/problems/domain/entities/problem.entity';
import StudyPlanCard from 'modules/problems/ui/shared/components/StudyPlanCard';
import Swiper from 'shared/components/base/Swiper';
import EmptyState from 'shared/components/common/EmptyState';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';

type StudyPlansShowcaseProps = {
  studyPlans: StudyPlanListItem[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
};

const ProblemStudyPlansShowcase = ({
  studyPlans,
  isLoading,
  error,
  onRetry,
}: StudyPlansShowcaseProps) => {
  const { t } = useTranslation();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  return (
    <Paper component={PointerSpotlight} variant="section" className="kep-problems-study-plans">
      <SectionHeader
        title={t('problems.studyPlans.title')}
        action={
          <Stack direction="row" alignItems="center" gap={1}>
            <PatternArtwork kind="daily-tasks" sx={{ width: 56, flexShrink: 0 }} />
            <Button component={RouterLink} to={resources.StudyPlans} size="small" variant="text">
              {t('problems.studyPlans.navButton')}
            </Button>
          </Stack>
        }
      />
      {isLoading ? (
        <Stack sx={{ height: 208, px: 'var(--kep-content-inset)', py: 2.5 }}>
          <Stack direction="row" gap={2} alignItems="center" sx={{ minHeight: 56 }}>
            <Box flex={1}>
              <Skeleton width="85%" height={28} />
              <Skeleton width="55%" height={28} />
            </Box>
            <Skeleton variant="rectangular" width={40} height={40} />
          </Stack>
          <Stack direction="row" gap={2.5} sx={{ mt: 2 }}>
            <Skeleton width={72} height={22} />
            <Skeleton width={96} height={22} />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 'auto', pt: 1.5, borderTop: 1, borderColor: 'divider' }}
          >
            <Skeleton width={48} height={24} />
            <Skeleton width={110} height={24} />
          </Stack>
        </Stack>
      ) : error ? (
        <Alert
          severity="error"
          action={onRetry && <Button onClick={onRetry}>{t('common.retry')}</Button>}
          sx={{ m: 2.5 }}
        >
          {t('common.loadFailed')}
        </Alert>
      ) : studyPlans.length ? (
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={0}
          loop={studyPlans.length > 1}
          autoplay={
            reducedMotion
              ? false
              : { delay: 7000, pauseOnMouseEnter: true, disableOnInteraction: true }
          }
        >
          {studyPlans.map((plan) => (
            <SwiperSlide key={plan.id}>
              <StudyPlanCard studyPlan={plan} variant="sidebar" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <EmptyState compact title={t('problems.studyPlans.empty')} sx={{ minHeight: 208 }} />
      )}
    </Paper>
  );
};
export default ProblemStudyPlansShowcase;
