import type { useProblemWorkspace } from 'modules/problems/application/hooks/useProblemWorkspace';
import type { ProblemDetail } from 'modules/problems/domain/entities/problem.entity';
import { ProblemEditorPanel } from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorPanel';
import ProblemEditorSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemEditorSkeleton';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';

type Props = {
  model: ReturnType<typeof useProblemWorkspace> & {
    problem?: ProblemDetail;
    showInitialSkeleton: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
  };
  isMobileDetail: boolean;
  isDisabled?: boolean;
  showSampleResultsTab?: boolean;
  upsolveHref?: string;
};
export const ProblemWorkspaceEditor = ({
  model,
  isMobileDetail,
  isDisabled,
  showSampleResultsTab,
  upsolveHref,
}: Props) => {
  const {
    problem,
    selectedLang,
    setSelectedLang,
    editorKey,
    codeRef,
    persistCode,
    input,
    setInput,
    answer,
    output,
    selectedSampleIndex,
    setSelectedSampleIndex,
    sampleTests,
    checkSamplesResult,
    editorTab,
    setEditorTab,
    handleRun,
    handleCheckSamples,
    isRunning,
    isCheckingSamples,
    canUseCheckSamples,
    handleSubmit,
    isSubmitting,
    showInitialSkeleton,
  } = model;
  const themeMode = useThemeMode();
  const editorTheme = themeMode.mode === 'dark' ? 'vs-dark' : 'vs';
  return problem && !showInitialSkeleton ? (
    <ProblemEditorPanel
      mobilePlain={isMobileDetail}
      problem={problem}
      initialCode={codeRef.current}
      editorKey={editorKey}
      onCodeChange={persistCode}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      sampleTests={sampleTests}
      selectedSampleIndex={selectedSampleIndex}
      onSampleChange={setSelectedSampleIndex}
      input={input}
      onInputChange={setInput}
      output={output}
      answer={answer}
      onRun={handleRun}
      onSubmit={handleSubmit}
      onCheckSamples={handleCheckSamples}
      isRunning={isRunning}
      isSubmitting={isSubmitting}
      isCheckingSamples={isCheckingSamples}
      checkSamplesResult={checkSamplesResult}
      editorTab={editorTab}
      onEditorTabChange={setEditorTab}
      canUseCheckSamples={canUseCheckSamples}
      editorTheme={editorTheme}
      showSampleResultsTab={showSampleResultsTab}
      isDisabled={isDisabled}
      upsolveHref={upsolveHref}
    />
  ) : (
    <ProblemEditorSkeleton />
  );
};
