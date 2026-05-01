import { Button, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { SwiperSlide } from 'swiper/react';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import Swiper from 'shared/components/base/Swiper.tsx';
import type { StudyPlanListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import StudyPlanCard from 'modules/problems/ui/shared/components/StudyPlanCard.tsx';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import Box from '@mui/material/Box';

type StudyPlansShowcaseProps = {
  studyPlans: StudyPlanListItem[];
  highlightedPlanId?: number | null;
};

const ProblemStudyPlansShowcase = ({ studyPlans, highlightedPlanId: _highlightedPlanId }: StudyPlansShowcaseProps) => {
  const { t } = useTranslation();

  if (studyPlans.length === 0) {
    return null;
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:map-outline" width={20} height={20} />
            <Typography variant="subtitle1" fontWeight={700}>
              {t('problems.studyPlans.title')}
            </Typography>
          </Stack>
        }
        action={
          <Button component={RouterLink} to={resources.StudyPlans} size="small">
            {t('problems.studyPlans.navButton')}
          </Button>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1.06}
          spaceBetween={12}
          loop={studyPlans.length > 1}
          autoplay={{
            delay: 3000
          }}
          sx={{
            '& .swiper-slide': {
              height: 'auto',
            },
          }}
          breakpoints={{
            0: { slidesPerView: 1.04 },
            600: { slidesPerView: 1.1 },
            900: { slidesPerView: 1 },
          }}
        >
          {studyPlans.map((studyPlan) => (
            <SwiperSlide key={studyPlan.id}>
              <Box sx={{ p: 1 }}>
                <StudyPlanCard
                  studyPlan={studyPlan}
                  variant="compact"
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </CardContent>
    </Card>
  );
};

export default ProblemStudyPlansShowcase;
