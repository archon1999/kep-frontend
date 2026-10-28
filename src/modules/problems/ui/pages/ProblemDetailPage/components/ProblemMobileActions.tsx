import { useTranslation } from 'react-i18next';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import type { useProblemDetailPage } from 'modules/problems/application/hooks/useProblemDetailPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinSpendConfirm from 'shared/components/common/KepcoinSpendConfirm';

type Props = {
  model: Pick<
    ReturnType<typeof useProblemDetailPage>,
    | 'problem'
    | 'hasCode'
    | 'input'
    | 'handleRun'
    | 'handleCheckSamples'
    | 'handleAnswerForInput'
    | 'isRunning'
    | 'isCheckingSamples'
    | 'isAnswering'
    | 'canUseCheckSamples'
    | 'handleSubmit'
    | 'isSubmitting'
    | 'problemId'
    | 'activeTab'
    | 'mutateProblem'
    | 'showAnswerForInputAction'
  >;
};
export const ProblemMobileActions = ({ model }: Props) => {
  const {
    problem,
    hasCode,
    input,
    handleRun,
    handleCheckSamples,
    handleAnswerForInput,
    isRunning,
    isCheckingSamples,
    isAnswering,
    canUseCheckSamples,
    handleSubmit,
    isSubmitting,
    problemId,
    activeTab,
    mutateProblem,
    showAnswerForInputAction,
  } = model;
  const { t } = useTranslation();

  if (!problem || activeTab !== 'code') return null;
  return (
    <Stack
      component="footer"
      direction="row"
      spacing={0.5}
      sx={{
        flexShrink: 0,
        px: 1.5,
        pt: 1,
        pb: 'max(10px, env(safe-area-inset-bottom))',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      {canUseCheckSamples ? (
        <Tooltip title={t('problems.detail.checkSamplesHotkey')}>
          <span>
            <IconButton
              onClick={handleCheckSamples}
              disabled={!hasCode || isCheckingSamples}
              aria-label={t('problems.detail.checkSamplesHotkey')}
              sx={{ width: 44, height: 44 }}
            >
              <IconifyIcon icon="mdi:check-all" />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <KepcoinSpendConfirm
          value={100}
          purchaseUrl={`/api/problems/${problemId}/purchase-check-samples/`}
          onSuccess={() => {
            void mutateProblem();
          }}
        >
          <IconButton
            aria-label={t('problems.detail.checkSamplesHotkey')}
            sx={{ width: 44, height: 44 }}
          >
            <IconifyIcon icon="mdi:check-all" />
          </IconButton>
        </KepcoinSpendConfirm>
      )}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<IconifyIcon icon="mdi:play" />}
        onClick={handleRun}
        disabled={!hasCode || isRunning}
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 44,
          px: 0.75,
          fontSize: '0.72rem',
          lineHeight: 1.1,
          whiteSpace: 'normal',
          '& .MuiButton-startIcon': { display: 'none' },
        }}
      >
        {isRunning ? t('problems.detail.running') : t('problems.detail.run')}
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<IconifyIcon icon="mdi:send-outline" />}
        onClick={handleSubmit}
        disabled={!hasCode || isSubmitting}
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 44,
          px: 0.75,
          fontSize: '0.72rem',
          lineHeight: 1.1,
          whiteSpace: 'normal',
          '& .MuiButton-startIcon': { display: 'none' },
        }}
      >
        {t('problems.detail.submit')}
      </Button>
      {showAnswerForInputAction ? (
        <KepcoinSpendConfirm
          value={1}
          purchaseUrl={`/api/problems/${problem.id}/answer-for-input/`}
          requestBody={{ input_data: input }}
          onSuccess={handleAnswerForInput}
        >
          <IconButton
            disabled={isAnswering}
            aria-label={t('problems.detail.answerForInputHotkey')}
            sx={{ width: 44, height: 44 }}
          >
            <IconifyIcon icon="mdi:chat-question-outline" />
          </IconButton>
        </KepcoinSpendConfirm>
      ) : null}
    </Stack>
  );
};
