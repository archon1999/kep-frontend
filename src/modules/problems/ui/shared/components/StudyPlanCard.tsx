import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
import type { StudyPlanListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import { getStudyPlanBranding } from 'modules/problems/ui/shared/utils/studyPlanBranding.ts';
import StudyPlanPreviewDialog from 'modules/problems/ui/shared/components/StudyPlanPreviewDialog.tsx';

type StudyPlanCardProps = {
  studyPlan: StudyPlanListItem;
  highlight?: boolean;
  variant?: 'default' | 'compact';
};

const StudyPlanCard = ({
  studyPlan,
  variant = 'default',
}: StudyPlanCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isCompact = variant === 'compact';
  const branding = getStudyPlanBranding(studyPlan, theme.palette.mode);
  const progressPercent = Math.max(0, Math.min(100, studyPlan.progressPercent ?? 0));
  const solvedCount = studyPlan.solvedCount ?? 0;

  const handleOpen = () => {
    if (studyPlan.isPurchased) {
      navigate(getResourceById(resources.StudyPlan, studyPlan.id));
      return;
    }

    setIsPreviewOpen(true);
  };

  return (
    <>
      <Card
        background={variant == 'compact' ? 0 : 1}
        sx={{
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <CardActionArea onClick={handleOpen} sx={{ height: '100%', alignItems: 'stretch' }}>
          <Box
            sx={{
              minHeight: isCompact ? 148 : 192,
              position: 'relative',
              bgcolor: branding.surfaceColor,
              color: 'text.primary',
              borderBottom: '1px solid',
              borderBottomColor: branding.borderColor,
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
                      color: theme.palette.success.main,
                      bgcolor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.18 : 0.1),
                    }}
                  />
                ) : null}
              </Stack>

              <Box sx={{ maxWidth: isCompact ? '100%' : '72%' }}>
                <Typography variant={isCompact ? 'h6' : 'h5'} fontWeight={700} lineHeight={1.05}>
                  {studyPlan.title}
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
                  alt={studyPlan.title}
                  sx={{
                    position: 'absolute',
                    right: isCompact ? 12 : 18,
                    bottom: isCompact ? 8 : 12,
                    width: isCompact ? 72 : 108,
                    maxHeight: isCompact ? 72 : 108,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 14px 24px rgba(15, 23, 42, 0.25))',
                    opacity: isCompact ? 0.95 : 1,
                  }}
                />
              ) : null}
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
                    borderRadius: 999,
                    bgcolor: branding.progressTrackColor,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 999,
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
