import { useMediaQuery, useTheme } from '@mui/material';
import { useContestProblemPage } from 'modules/contests/application/hooks/useContestProblemPage';
import { Page404 } from 'modules/errors/ui/pages';
import { ProblemWorkspaceEditor } from 'modules/problems/ui/shared/components/problem-detail/ProblemWorkspaceEditor';
import { ProblemWorkspaceLayout } from 'modules/problems/ui/shared/components/problem-detail/ProblemWorkspaceLayout';
import { useWorkspaceHotkeys } from 'modules/problems/ui/shared/helpers/useWorkspaceHotkeys';
import { WorkspaceRoot } from 'shared/components/sections/common/Workspace';
import { ContestProblemDescription } from './components/ContestProblemDescription';
import { ContestProblemMobileActions } from './components/ContestProblemMobileActions';
import ContestWorkspaceHeader from './components/ContestWorkspaceHeader';

const ContestProblemPage = () => {
  const model = useContestProblemPage();
  const {
    hasCode,
    handleRun,
    isRunning,
    handleSubmit,
    isSubmitting,
    contest,
    contestId,
    problemSymbol,
    sortedProblems,
    prevSymbol,
    nextSymbol,
    handlePrev,
    handleNext,
    isContestLocked,
    timeLeft,
    upsolveHref,
    canOpenOriginalProblem,
  } = model;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  useWorkspaceHotkeys({
    run: {
      enabled: Boolean(
        model.currentUser && model.hasCode && !model.isRunning && !model.isContestLocked,
      ),
      onTrigger: model.handleRun,
    },
    submit: {
      enabled: Boolean(
        model.currentUser && model.hasCode && !model.isSubmitting && !model.isContestLocked,
      ),
      onTrigger: model.handleSubmit,
    },
  });

  if (model.isNotFound) return <Page404 />;
  return (
    <WorkspaceRoot>
      <ContestWorkspaceHeader
        contest={contest}
        contestId={contestId}
        problems={sortedProblems}
        symbol={problemSymbol}
        timeLeft={timeLeft}
        upsolveHref={canOpenOriginalProblem ? upsolveHref : undefined}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={Boolean(prevSymbol)}
        hasNext={Boolean(nextSymbol)}
        onRun={handleRun}
        onSubmit={handleSubmit}
        hasCode={hasCode}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        isLocked={isContestLocked}
      />
      <ProblemWorkspaceLayout
        isMobile={isMobile}
        showEditor={model.activeTab === 'code'}
        loading={model.isProblemLoading}
        refreshing={model.isRevalidating}
        hasLoadError={model.hasLoadError}
        onRetry={model.handleRetry}
        blockWhileRefreshing
        description={<ContestProblemDescription model={model} isNarrowLayout={isMobile} />}
        editor={
          <ProblemWorkspaceEditor
            model={model}
            isMobileDetail={isMobile}
            showSampleResultsTab={false}
            isDisabled={model.isContestLocked}
            upsolveHref={model.upsolveHref}
          />
        }
        footer={<ContestProblemMobileActions model={model} />}
      />
    </WorkspaceRoot>
  );
};
export default ContestProblemPage;
