import { useMediaQuery, useTheme } from '@mui/material';
import { Page404 } from 'modules/errors/ui/pages';
import { useProblemDetailPage } from 'modules/problems/application/hooks/useProblemDetailPage';
import { ProblemHeader } from 'modules/problems/ui/shared/components/problem-detail/ProblemHeader';
import { ProblemWorkspaceEditor } from 'modules/problems/ui/shared/components/problem-detail/ProblemWorkspaceEditor';
import { ProblemWorkspaceLayout } from 'modules/problems/ui/shared/components/problem-detail/ProblemWorkspaceLayout';
import { useWorkspaceHotkeys } from 'modules/problems/ui/shared/helpers/useWorkspaceHotkeys';
import { WorkspaceRoot } from 'shared/components/sections/common/Workspace';
import { ProblemDetailDescription } from './components/ProblemDetailDescription';
import { ProblemMobileActions } from './components/ProblemMobileActions';
import { ProblemMobileTabs } from './components/ProblemMobileTabs';

const ProblemDetailPage = () => {
  const model = useProblemDetailPage();
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
    studyPlanId,
    mutateProblem,
    showAnswerForInputAction,
    handlePrev,
    handleNext,
  } = model;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  useWorkspaceHotkeys({
    run: {
      enabled: Boolean(model.currentUser && model.hasCode && !model.isRunning),
      onTrigger: model.handleRun,
    },
    submit: {
      enabled: Boolean(model.currentUser && model.hasCode && !model.isSubmitting),
      onTrigger: model.handleSubmit,
    },
    checkSamples: {
      enabled: Boolean(
        model.currentUser && model.hasCode && model.canUseCheckSamples && !model.isCheckingSamples,
      ),
      onTrigger: model.handleCheckSamples,
    },
    answerForInput: {
      enabled: Boolean(model.currentUser && model.showAnswerForInputAction && !model.isAnswering),
      onTrigger: model.handleAnswerForInput,
    },
  });
  if (model.isNotFound) return <Page404 />;
  return (
    <WorkspaceRoot>
      <ProblemHeader
        studyPlanId={studyPlanId}
        onPrev={handlePrev}
        onNext={handleNext}
        canNavigate={Boolean(problem?.id)}
        problemId={problemId}
        problem={problem}
        hasCode={hasCode}
        isRunning={isRunning}
        isCheckingSamples={isCheckingSamples}
        isAnswering={isAnswering}
        isSubmitting={isSubmitting}
        onRun={handleRun}
        onCheckSamples={handleCheckSamples}
        onAnswerForInput={handleAnswerForInput}
        onSubmit={handleSubmit}
        onRefreshProblem={() => mutateProblem()}
        canUseCheckSamples={canUseCheckSamples}
        showAnswerForInput={showAnswerForInputAction}
        inputValue={input}
      />
      <ProblemWorkspaceLayout
        isMobile={isMobile}
        showEditor={model.activeTab === 'code'}
        loading={model.isProblemLoading}
        refreshing={model.isRevalidating}
        hasLoadError={model.hasLoadError}
        onRetry={model.handleRetry}
        description={<ProblemDetailDescription model={model} isMobileDetail={isMobile} />}
        editor={<ProblemWorkspaceEditor model={model} isMobileDetail={isMobile} />}
        tabs={<ProblemMobileTabs model={model} />}
        footer={<ProblemMobileActions model={model} />}
      />
    </WorkspaceRoot>
  );
};
export default ProblemDetailPage;
