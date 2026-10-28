import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { getResourceById, resources } from 'app/routes/resources';
import { getStudyPlanDetails } from 'modules/problems/application/queries';
import { useStudyPlan } from 'modules/problems/application/queries.ts';
import { getStudyPlanBranding } from 'modules/problems/ui/shared/utils/studyPlanBranding.ts';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';
import DialogHeader from 'shared/components/common/DialogHeader';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm.tsx';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
import { useSWRConfig } from 'swr';

type StudyPlanPreviewDialogProps = {
  open: boolean;
  studyPlanId?: number | null;
  onClose: () => void;
};

const StudyPlanPreviewDialog = ({ open, studyPlanId, onClose }: StudyPlanPreviewDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode, systemMode } = useColorScheme();
  const { mutate: mutateCache } = useSWRConfig();
  const {
    data: studyPlan,
    isLoading,
    mutate,
  } = useStudyPlan(open && studyPlanId ? studyPlanId : undefined);
  const branding = getStudyPlanBranding(
    studyPlan ?? {},
    (mode === 'system' ? systemMode : mode) ?? 'light',
  );

  const handleOpenPlan = () => {
    if (!studyPlanId) return;
    onClose();
    navigate(getResourceById(resources.StudyPlan, studyPlanId));
  };

  const handlePurchaseSuccess = async () => {
    if (!studyPlanId) return;

    try {
      const refreshedPlan = await getStudyPlanDetails(studyPlanId);
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
    <Dialog
      aria-labelledby="study-plan-preview-title"
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogHeader id="study-plan-preview-title" title={dialogTitle} onClose={onClose} />
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
              variant="section"
              sx={{
                borderRadius: 0,
                overflow: 'hidden',
                bgcolor: 'transparent',
                color: 'text.primary',
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
                          color: 'success.main',
                          bgcolor: 'action.hover',
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
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
                          filter: branding.iconFilter,
                          flexShrink: 0,
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
              variant="section"
              sx={{
                borderRadius: 0,
                borderColor: branding.borderColor,
                bgcolor: 'transparent',
              }}
            >
              <CardContent>
                <Stack spacing={1.75}>
                  <Typography variant="subtitle1" fontWeight={600}>
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
              <Button variant="contained">{t('problems.studyPlans.purchase')}</Button>
            </KepcoinSpendConfirm>
          )
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

export default StudyPlanPreviewDialog;
