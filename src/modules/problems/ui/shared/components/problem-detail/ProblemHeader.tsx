import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Divider, IconButton, Stack, Tooltip } from '@mui/material';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { ProblemDetail } from 'modules/problems/domain/entities/problem.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import Logo from 'shared/components/common/Logo';
import { useLoginRedirect } from 'shared/lib/authRedirect';

interface ProblemHeaderProps {
  navColor?: string;
  studyPlanId?: number | null;
  onPrev: () => void;
  onNext: () => void;
  canNavigate: boolean;
  problemId?: number;
  problem?: ProblemDetail | null;
  hasCode: boolean;
  isRunning: boolean;
  isCheckingSamples: boolean;
  isAnswering: boolean;
  isSubmitting: boolean;
  onRun: () => void;
  onCheckSamples: () => void;
  onAnswerForInput: (payload?: any) => void;
  onSubmit: () => void;
  onRefreshProblem: () => void;
  canUseCheckSamples: boolean;
  showAnswerForInput: boolean;
  inputValue: string;
}

export const ProblemHeader = ({
  navColor,
  studyPlanId,
  onPrev,
  onNext,
  canNavigate,
  problemId,
  problem,
  hasCode,
  isRunning,
  isCheckingSamples,
  isAnswering,
  isSubmitting,
  onRun,
  onCheckSamples,
  onAnswerForInput,
  onSubmit,
  onRefreshProblem,
  canUseCheckSamples,
  showAnswerForInput,
  inputValue,
}: ProblemHeaderProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();

  const requireAuth = (handler: () => void) => () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    handler();
  };

  return (
    <Box
      component="header"
      sx={{
        borderColor: 'divider',
        px: { xs: 2, md: 3 },
        py: 1.5,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr auto', md: '1fr auto 1fr' },
        gridTemplateAreas: {
          xs: '"nav user" "actions actions"',
          md: '"nav actions user"',
        },
        alignItems: 'center',
        gap: { xs: 1, md: 2 },
        backgroundImage:
          navColor === 'vibrant'
            ? 'linear-gradient(90deg, rgba(124,77,255,0.85), rgba(3,169,244,0.85))'
            : undefined,
        color: navColor === 'vibrant' ? 'common.white' : undefined,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ gridArea: 'nav', minWidth: 0, overflowX: 'auto' }}
      >
        <Logo showName={false} />
        <Divider orientation="vertical" flexItem />
        <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
          {studyPlanId ? (
            <Button
              component={RouterLink}
              to={getResourceById(resources.StudyPlan, studyPlanId)}
              variant="text"
              color="secondary"
              startIcon={<IconifyIcon icon="mdi:map-outline" />}
              sx={{
                textTransform: 'none',
                minWidth: { xs: 40, sm: 64 },
                px: { xs: 1, sm: 1.5 },
                '& .MuiButton-startIcon': {
                  mr: { xs: 0, sm: 1 },
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {t('problems.studyPlans.pageTitle')}
              </Box>
            </Button>
          ) : null}
          <Button
            component={RouterLink}
            to={resources.Problems}
            variant="text"
            color="primary"
            startIcon={<IconifyIcon icon="mdi:format-list-bulleted" />}
            sx={{
              textTransform: 'none',
              minWidth: { xs: 40, sm: 64 },
              px: { xs: 1, sm: 1.5 },
              '& .MuiButton-startIcon': {
                mr: { xs: 0, sm: 1 },
              },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {t('problems.title')}
            </Box>
          </Button>
          <Tooltip title={t('problems.detail.previousProblem')}>
            <span>
              <IconButton onClick={onPrev} color="primary" disabled={!canNavigate} size="small">
                <IconifyIcon icon="mdi:chevron-left" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('problems.detail.nextProblem')}>
            <span>
              <IconButton onClick={onNext} color="primary" disabled={!canNavigate} size="small">
                <IconifyIcon icon="mdi:chevron-right" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ gridArea: 'actions', minWidth: 0 }}
      >
        <Tooltip title={isRunning ? t('problems.detail.running') : t('problems.detail.runHotkey')}>
          <span>
            <IconButton
              color="primary"
              onClick={requireAuth(onRun)}
              disabled={isRunning || !hasCode}
              size="large"
            >
              <IconifyIcon icon="mdi:play-circle-outline" width={22} height={22} />
            </IconButton>
          </span>
        </Tooltip>

        {canUseCheckSamples ? (
          <Tooltip title={t('problems.detail.checkSamplesHotkey')}>
            <span>
              <IconButton
                color="secondary"
                onClick={requireAuth(onCheckSamples)}
                disabled={isCheckingSamples || !hasCode}
                size="large"
              >
                <IconifyIcon icon="mdi:check-all" width={22} height={22} />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title={t('problems.detail.checkSamplesHotkey')}>
            <span>
              <KepcoinSpendConfirm
                value={100}
                purchaseUrl={`/api/problems/${problemId}/purchase-check-samples/`}
                onSuccess={onRefreshProblem}
              >
                <IconButton color="secondary" size="large">
                  <IconifyIcon icon="mdi:check-all" width={22} height={22} />
                </IconButton>
              </KepcoinSpendConfirm>
            </span>
          </Tooltip>
        )}

        {showAnswerForInput && problem?.hasCheckInput ? (
          <Tooltip
            title={
              isAnswering ? t('problems.detail.waiting') : t('problems.detail.answerForInputHotkey')
            }
          >
            <span>
              <KepcoinSpendConfirm
                value={1}
                purchaseUrl={`/api/problems/${problem?.id}/answer-for-input/`}
                requestBody={{ input_data: inputValue }}
                onSuccess={onAnswerForInput}
              >
                <IconButton color="info" disabled={isAnswering} size="large">
                  <IconifyIcon icon="mdi:chat-question-outline" width={22} height={22} />
                </IconButton>
              </KepcoinSpendConfirm>
            </span>
          </Tooltip>
        ) : null}

        <Tooltip title={t('problems.detail.submitHotkey')}>
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={requireAuth(onSubmit)}
              disabled={isSubmitting || !hasCode}
              sx={{ minWidth: 44, px: 1 }}
            >
              <IconifyIcon icon="mdi:send-outline" width={18} height={18} />
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Box sx={{ gridArea: 'user', display: 'flex', justifyContent: 'flex-end' }}>
        <AppbarActionItems type="slim" />
      </Box>
    </Box>
  );
};
