import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@mui/material';
import type { useContestProblemPage } from 'modules/contests/application/hooks/useContestProblemPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type Props = {
  model: Pick<
    ReturnType<typeof useContestProblemPage>,
    | 'problem'
    | 'hasCode'
    | 'handleRun'
    | 'isRunning'
    | 'handleSubmit'
    | 'isSubmitting'
    | 'activeTab'
    | 'handleTabChange'
    | 'isContestLocked'
  >;
};
export const ContestProblemMobileActions = ({ model }: Props) => {
  const {
    problem,
    hasCode,
    handleRun,
    isRunning,
    handleSubmit,
    isSubmitting,
    activeTab,
    handleTabChange,
    isContestLocked,
  } = model;
  const { t } = useTranslation();

  if (!problem) return null;
  return (
    <Stack
      component="footer"
      direction="row"
      spacing={1}
      sx={{
        flexShrink: 0,
        px: 1.5,
        pt: 1,
        pb: 'max(10px, env(safe-area-inset-bottom))',
        bgcolor: 'background.default',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {activeTab === 'code' ? (
        <>
          <Button
            variant="text"
            onClick={() => handleTabChange('description')}
            aria-label={t('contests.problem.description')}
            sx={{ minWidth: 44, px: 1 }}
          >
            <IconifyIcon icon="mdi:arrow-left" />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRun}
            disabled={!hasCode || isRunning || isContestLocked}
            sx={{ flex: 1, minWidth: 0, minHeight: 44 }}
          >
            {isRunning ? t('problems.detail.running') : t('problems.detail.run')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!hasCode || isSubmitting || isContestLocked}
            sx={{ flex: 1, minWidth: 0, minHeight: 44 }}
          >
            {t('problems.detail.submit')}
          </Button>
        </>
      ) : (
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleTabChange('code')}
          startIcon={<IconifyIcon icon="mdi:code-tags" />}
          sx={{ minHeight: 44 }}
        >
          {t('problems.studyPlans.solve')}
        </Button>
      )}
    </Stack>
  );
};
