import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  ButtonBase,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources';
import { contentEntranceStyles, motion } from 'app/theme/styles/transitions';
import type { StudyPlanListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import StudyPlanPreviewDialog from 'modules/problems/ui/shared/components/StudyPlanPreviewDialog.tsx';
import { getStudyPlanBranding } from 'modules/problems/ui/shared/utils/studyPlanBranding.ts';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
import MixedText from 'shared/components/common/MixedText';

type StudyPlanCardProps = {
  studyPlan: StudyPlanListItem;
  highlight?: boolean;
  variant?: 'default' | 'compact' | 'sidebar';
};

const StudyPlanCard = ({ studyPlan, variant = 'default' }: StudyPlanCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode, systemMode } = useColorScheme();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isCompact = variant === 'compact';
  const branding = getStudyPlanBranding(
    studyPlan,
    (mode === 'system' ? systemMode : mode) ?? 'light',
  );
  const progressPercent = Math.max(0, Math.min(100, studyPlan.progressPercent ?? 0));
  const solvedCount = studyPlan.solvedCount ?? 0;

  const handleOpen = () => {
    if (studyPlan.isPurchased) {
      navigate(getResourceById(resources.StudyPlan, studyPlan.id));
      return;
    }

    setIsPreviewOpen(true);
  };

  if (variant === 'sidebar')
    return (
      <>
        <ButtonBase
          onClick={handleOpen}
          sx={{
            width: '100%',
            height: 208,
            px: 'var(--kep-content-inset)',
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            textAlign: 'left',
            borderRadius: 0,
            '&:hover h3, &:focus-visible h3': { color: 'primary.main' },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: -2,
            },
          }}
        >
          <Stack direction="row" gap={2} alignItems="center" sx={{ minHeight: 56 }}>
            <Typography
              component="h3"
              variant="h6"
              sx={{
                flex: 1,
                minWidth: 0,
                fontSize: 21,
                fontWeight: 500,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              <MixedText>{studyPlan.title}</MixedText>
            </Typography>
            {branding.iconSrc && (
              <Box
                component="img"
                src={branding.iconSrc}
                alt=""
                sx={{
                  width: 40,
                  height: 40,
                  objectFit: 'contain',
                  filter: branding.iconFilter,
                  flexShrink: 0,
                }}
              />
            )}
          </Stack>
          <Stack direction="row" alignItems="center" gap={2.5} sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <Box
                component="span"
                sx={{ typography: 'metric', fontSize: 17, color: 'text.primary', mr: 0.75 }}
              >
                {studyPlan.daysCount ?? '—'}
              </Box>
              {t('problems.sidebar.days', { count: studyPlan.daysCount ?? 0 })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <Box
                component="span"
                sx={{ typography: 'metric', fontSize: 17, color: 'text.primary', mr: 0.75 }}
              >
                {studyPlan.problemsCount ?? '—'}
              </Box>
              {t('problems.sidebar.problems', { count: studyPlan.problemsCount ?? 0 })}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{ mt: 'auto', pt: 1.5, borderTop: 1, borderColor: 'divider' }}
          >
            {studyPlan.isPurchased ? (
              <Typography variant="caption" color="success.main">
                {t('problems.studyPlans.purchased')}
              </Typography>
            ) : (
              <KepcoinValue value={5} textVariant="metric" iconSize={20} fontWeight={500} />
            )}
            <Typography variant="body2" color="primary.main" sx={{ fontSize: 13 }}>
              {t('problems.recommendation.openPlan')} <span aria-hidden="true">↗</span>
            </Typography>
          </Stack>
        </ButtonBase>
        <StudyPlanPreviewDialog
          open={isPreviewOpen}
          studyPlanId={studyPlan.id}
          onClose={() => setIsPreviewOpen(false)}
        />
      </>
    );

  return (
    <>
      <Card
        variant={isCompact ? 'section' : 'panel'}
        sx={{
          ...contentEntranceStyles,
          height: '100%',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <CardActionArea
          onClick={handleOpen}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
          <Box
            sx={{
              minHeight: isCompact ? 148 : 192,
              flex: 1,
              position: 'relative',
              bgcolor: 'background.default',
              color: 'text.primary',
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
            }}
          >
            <CardContent
              sx={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: isCompact ? 1.5 : 2,
                p: isCompact ? 2.25 : 3,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  size="small"
                  label={t('problems.studyPlans.cardLabel')}
                  sx={{
                    color: branding.accentColor,
                    bgcolor: branding.surfaceStrongColor,
                  }}
                />
                {studyPlan.isPurchased ? (
                  <Chip
                    size="small"
                    label={t('problems.studyPlans.purchased')}
                    sx={{
                      color: 'success.main',
                      bgcolor: 'action.hover',
                    }}
                  />
                ) : null}
              </Stack>

              <Stack direction="row" gap={2} alignItems="center" sx={{ flex: 1 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    component="h2"
                    variant={isCompact ? 'h6' : 'h5'}
                    fontWeight={600}
                    lineHeight={1.3}
                  >
                    <MixedText>{studyPlan.title}</MixedText>
                  </Typography>
                  {!isCompact ? (
                    <Typography mt={1.25} variant="body2" color="text.secondary">
                      {studyPlan.descriptionShort}
                    </Typography>
                  ) : null}
                </Box>

                {branding.iconSrc ? (
                  <Box
                    component="img"
                    src={branding.iconSrc}
                    alt=""
                    sx={{
                      flexShrink: 0,
                      transition: `transform 260ms ${motion.easing}`,
                      '.MuiCardActionArea-root:hover &': { transform: 'translateY(-3px)' },
                      [motion.reduced]: {
                        transition: 'none',
                        '.MuiCardActionArea-root:hover &': { transform: 'none' },
                      },
                      width: isCompact ? 56 : 80,
                      maxHeight: isCompact ? 56 : 80,
                      objectFit: 'contain',
                      filter: branding.iconFilter,
                      opacity: isCompact ? 0.95 : 1,
                    }}
                  />
                ) : null}
              </Stack>
            </CardContent>
          </Box>

          <CardContent sx={{ p: isCompact ? 2 : 2.5 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {studyPlan.daysCount ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('problems.studyPlans.daysCount', { count: studyPlan.daysCount })}
                />
              ) : null}
              {studyPlan.problemsCount ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('problems.studyPlans.problemsCount', { count: studyPlan.problemsCount })}
                />
              ) : null}
            </Stack>

            {studyPlan.isPurchased && studyPlan.problemsCount ? (
              <Stack spacing={0.75} mt={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {t('problems.studyPlans.completed')}
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    {solvedCount} / {studyPlan.problemsCount}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{
                    height: 8,
                    borderRadius: 0,
                    bgcolor: branding.progressTrackColor,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 0,
                      bgcolor: branding.accentColor,
                    },
                  }}
                />
              </Stack>
            ) : (
              <Box mt={2.8}>
                <KepcoinValue value={5} />
              </Box>
            )}
          </CardContent>
        </CardActionArea>
      </Card>

      <StudyPlanPreviewDialog
        open={isPreviewOpen}
        studyPlanId={studyPlan.id}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};

export default StudyPlanCard;
