import { useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import { getResourceById, resources } from 'app/routes/resources';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm.tsx';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
import { problemsQueries, useStudyPlan } from '../../application/queries.ts';
import { getStudyPlanBranding } from '../utils/studyPlanBranding.ts';

type StudyPlanPreviewDialogProps = {
  open: boolean;
  studyPlanId?: number | null;
  onClose: () => void;
};

const StudyPlanPreviewDialog = ({
  open,
  studyPlanId,
  onClose,
}: StudyPlanPreviewDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mutate: mutateCache } = useSWRConfig();
  const {
    data: studyPlan,
    isLoading,
    mutate,
  } = useStudyPlan(open && studyPlanId ? studyPlanId : undefined);
  const branding = getStudyPlanBranding(studyPlan ?? {}, theme.palette.mode);

  const handleOpenPlan = () => {
    if (!studyPlanId) return;
    onClose();
    navigate(getResourceById(resources.StudyPlan, studyPlanId));
  };

  const handlePurchaseSuccess = async () => {
    if (!studyPlanId) return;

    try {
      const refreshedPlan = await problemsQueries.problemsRepository.getStudyPlan(studyPlanId);
      await mutate(refreshedPlan, { revalidate: false });
      await mutateCache(
        ['study-plans'],
        (current: any[] | undefined) =>
          current?.map((item) =>
            Number(item?.id) === studyPlanId ? { ...item, ...refreshedPlan } : item,
          ),
        { revalidate: false },
      );
      await mutateCache(['study-plan', studyPlanId], refreshedPlan, { revalidate: false });
    } catch {
      await mutate((current) => (current ? { ...current, isPurchased: true } : current), {
        revalidate: true,
      });
      await mutateCache(
        ['study-plans'],
        (current: any[] | undefined) =>
          current?.map((item) =>
            Number(item?.id) === studyPlanId ? { ...item, isPurchased: true } : item,
          ),
        { revalidate: true },
      );
    }

    handleOpenPlan();
  };

  const dialogTitle = useMemo(() => {
    if (isLoading) return t('problems.studyPlans.pageTitle');
    return studyPlan?.title ?? t('problems.studyPlans.pageTitle');
  }, [isLoading, studyPlan?.title, t]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Stack spacing={2.5}>
            <Skeleton variant="rounded" height={220} />
            <Skeleton variant="text" height={32} width="55%" />
            <Skeleton variant="text" height={24} width="100%" />
            <Skeleton variant="text" height={24} width="88%" />
            <Skeleton variant="rounded" height={112} />
          </Stack>
        ) : !studyPlan ? (
          <Alert severity="warning" variant="outlined">
            {t('problems.emptySubtitle')}
          </Alert>
        ) : (
          <Stack spacing={2.5}>
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
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
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

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2.5}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h5" fontWeight={700}>
                        {studyPlan.title}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={1.5}>
                        {studyPlan.daysCount ? (
                          <Chip
                            size="small"
                            label={t('problems.studyPlans.daysCount', {
                              count: studyPlan.daysCount,
                            })}
                            sx={{
                              color: branding.accentColor,
                              bgcolor: branding.surfaceStrongColor,
                            }}
                          />
                        ) : null}
                        {studyPlan.problemsCount ? (
                          <Chip
                            size="small"
                            label={t('problems.studyPlans.problemsCount', {
                              count: studyPlan.problemsCount,
                            })}
                            sx={{
                              color: branding.accentColor,
                              bgcolor: branding.surfaceStrongColor,
                            }}
                          />
                        ) : null}
                      </Stack>
                    </Box>

                    {branding.iconSrc ? (
                      <Box
                        component="img"
                        src={branding.iconSrc}
                        alt={studyPlan.title}
                        sx={{
                          width: 112,
                          height: 112,
                          objectFit: 'contain',
                          flexShrink: 0,
                          filter: 'drop-shadow(0 18px 28px rgba(15, 23, 42, 0.22))',
                        }}
                      />
                    ) : null}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {studyPlan.description ? (
              <Box
                sx={{
                  color: 'text.secondary',
                  '& p': { my: 0 },
                }}
              >
                <MathJaxView rawHtml={studyPlan.description} />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {studyPlan.descriptionShort}
              </Typography>
            )}

            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: branding.borderColor,
                bgcolor: branding.surfaceColor,
              }}
            >
              <CardContent>
                <Stack spacing={1.75}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('problems.studyPlans.metaTitle')}
                  </Typography>

                  {!studyPlan.isPurchased ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('problems.studyPlans.lockedDescription')}
                    </Typography>
                  ) : null}

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('problems.studyPlans.priceLabel')}
                    </Typography>
                    <KepcoinValue value={studyPlan.kepcoinValue} textVariant="body2" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>
          {t('common.close')}
        </Button>
        {studyPlan ? (
          studyPlan.isPurchased ? (
            <Button variant="contained" onClick={handleOpenPlan}>
              {t('problems.recommendation.openPlan')}
            </Button>
          ) : (
            <KepcoinSpendConfirm
              value={studyPlan.kepcoinValue}
              purchaseUrl={`/api/study-plans/${studyPlan.id}/purchase/`}
              onSuccess={handlePurchaseSuccess}
            >
              <Box
                sx={{
                  px: 2.25,
                  py: 1.05,
                  borderRadius: 2,
                  bgcolor: branding.accentColor,
                  color: theme.palette.getContrastText(branding.accentColor),
                  fontWeight: 600,
                }}
              >
                {t('problems.studyPlans.purchase')}
              </Box>
            </KepcoinSpendConfirm>
          )
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default StudyPlanPreviewDialog;
