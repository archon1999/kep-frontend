import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { ProblemDetail } from 'modules/problems/domain/entities/problem.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';
import Logo from 'shared/components/common/Logo';
import MixedText from 'shared/components/common/MixedText';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import { useLoginRedirect } from 'shared/lib/authRedirect';

interface ProblemHeaderProps {
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
        flexShrink: 0,
        borderBottom: 1,
        borderColor: 'divider',
        px: { xs: 1, md: 3 },
        py: 0.5,
        pt: { xs: 'max(4px, env(safe-area-inset-top))', md: 0.5 },
        minHeight: 52,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto auto' },
        gridTemplateAreas: {
          xs: '"mobile"',
          md: '"nav actions user"',
        },
        alignItems: 'center',
        gap: { xs: 1, md: 2 },
        bgcolor: 'background.default',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          gridArea: 'nav',
          minWidth: 0,
          overflowX: 'auto',
          display: { xs: 'none', md: 'flex' },
        }}
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
              <IconButton
                onClick={onPrev}
                color="primary"
                disabled={!canNavigate}
                size="small"
                aria-label={t('problems.detail.previousProblem')}
              >
                <IconifyIcon icon="mdi:chevron-left" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('problems.detail.nextProblem')}>
            <span>
              <IconButton
                onClick={onNext}
                color="primary"
                disabled={!canNavigate}
                size="small"
                aria-label={t('problems.detail.nextProblem')}
              >
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
        sx={{ gridArea: 'actions', minWidth: 0, display: { xs: 'none', md: 'flex' } }}
      >
        <Tooltip title={isRunning ? t('problems.detail.running') : t('problems.detail.runHotkey')}>
          <span>
            <Button
              variant="outlined"
              onClick={requireAuth(onRun)}
              aria-label={t('problems.detail.runHotkey')}
              disabled={isRunning || !hasCode}
              loading={isRunning}
              startIcon={<IconifyIcon icon="mdi:play-outline" />}
            >
              {t('problems.detail.run')}
            </Button>
          </span>
        </Tooltip>

        {canUseCheckSamples ? (
          <Tooltip title={t('problems.detail.checkSamplesHotkey')}>
            <span>
              <IconButton
                color="secondary"
                onClick={requireAuth(onCheckSamples)}
                aria-label={t('problems.detail.checkSamplesHotkey')}
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
                <IconButton
                  color="secondary"
                  size="large"
                  aria-label={t('problems.detail.checkSamplesHotkey')}
                >
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
                <IconButton
                  color="info"
                  disabled={isAnswering}
                  size="large"
                  aria-label={t('problems.detail.answerForInputHotkey')}
                >
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
              aria-label={t('problems.detail.submitHotkey')}
              disabled={isSubmitting || !hasCode}
              loading={isSubmitting}
              endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
            >
              <ScrambleText>{t('problems.detail.submit')}</ScrambleText>
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Box
        sx={{
          gridArea: 'user',
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'flex-end',
        }}
      >
        <AppbarActionItems type="slim" />
      </Box>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{
          gridArea: 'mobile',
          display: { xs: 'flex', md: 'none' },
          minWidth: 0,
          width: '100%',
        }}
      >
        <Tooltip title={t('common.back')}>
          <IconButton
            component={RouterLink}
            to={
              studyPlanId ? getResourceById(resources.StudyPlan, studyPlanId) : resources.Problems
            }
            color="primary"
            aria-label={t('common.back')}
            sx={{ width: 44, height: 44, flexShrink: 0 }}
          >
            <IconifyIcon icon="mdi:arrow-left" width={24} height={24} />
          </IconButton>
        </Tooltip>
        <Typography
          noWrap
          sx={{ flex: 1, minWidth: 0, fontFamily: 'var(--kep-display-font)', fontSize: 18 }}
        >
          <MixedText>{problem?.title ?? t('problems.title')}</MixedText>
        </Typography>
        <IconButton
          onClick={onPrev}
          disabled={!canNavigate}
          aria-label={t('problems.detail.previousProblem')}
          sx={{ width: 40, height: 44, flexShrink: 0 }}
        >
          <IconifyIcon icon="mdi:chevron-left" />
        </IconButton>
        <IconButton
          onClick={onNext}
          disabled={!canNavigate}
          aria-label={t('problems.detail.nextProblem')}
          sx={{ width: 40, height: 44, flexShrink: 0 }}
        >
          <IconifyIcon icon="mdi:chevron-right" />
        </IconButton>
      </Stack>
    </Box>
  );
};
