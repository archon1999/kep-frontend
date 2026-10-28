import { type RefObject, useEffect, useEffectEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import type {
  ProblemDetail,
  ProblemSampleTest,
} from 'modules/problems/domain/entities/problem.entity';
import type {
  AnswerForInputResult,
  CustomTestResult,
  SampleTestResult,
  WorkspaceEditorTab,
} from 'modules/problems/domain/entities/workspace.types';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { wsService } from 'shared/services/websocket';
import { toast } from 'sonner';
import {
  checkProblemSampleTests,
  getProblemAnswerForInput,
  runProblemCustomTest,
} from '../mutations';
import { getWorkspaceErrorMessage } from '../workspace-error';

const EMPTY_SAMPLES: ProblemSampleTest[] = [];
type Options = {
  problem?: ProblemDetail;
  scope: string;
  selectedLang: string;
  codeRef: RefObject<string>;
  locked?: boolean;
  allowAnswer?: boolean;
};

export const useProblemExecution = ({
  problem,
  scope,
  selectedLang,
  codeRef,
  locked = false,
  allowAnswer = false,
}: Options) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const taskScope = `${scope}:${currentUser?.username ?? ''}:${locked}`;
  const runTask = useScopedAsyncTask(taskScope);
  const samplesTask = useScopedAsyncTask(taskScope);
  const answerTask = useScopedAsyncTask(taskScope);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [checkSamplesResult, setCheckSamplesResult] = useState<SampleTestResult[]>([]);
  const [editorTab, setEditorTab] = useState<WorkspaceEditorTab>('console');
  const sampleTests = problem?.sampleTests ?? EMPTY_SAMPLES;

  useEffect(() => {
    setSelectedSampleIndex(0);
    setInput('');
    setOutput('');
    setAnswer('');
    setCheckSamplesResult([]);
    setEditorTab('console');
  }, [scope]);

  useEffect(() => {
    const sample = sampleTests[selectedSampleIndex];
    if (sample) {
      setInput(sample.input ?? '');
      setAnswer(sample.output ?? '');
    }
  }, [scope, sampleTests, selectedSampleIndex]);

  const onCustomResult = useEffectEvent((result: CustomTestResult) => {
    if (!runTask.complete()) return;
    const text = `${result.output ?? ''}${result.error ?? ''}`;
    const meta = [
      result.time != null ? `Time: ${result.time}ms` : null,
      result.memory != null ? `Memory: ${result.memory}KB` : null,
    ]
      .filter(Boolean)
      .join(' | ');
    setOutput([text.trim(), meta].filter(Boolean).join('\n'));
  });
  const onSamplesResult = useEffectEvent((result: SampleTestResult[]) => {
    if (!samplesTask.complete()) return;
    setCheckSamplesResult(Array.isArray(result) ? result : []);
    setEditorTab('samples');
  });
  const onAnswerResult = useEffectEvent((result: AnswerForInputResult) => {
    if (!allowAnswer || !answerTask.complete()) return;
    setAnswer(result?.answer ? `${t('problems.detail.answer')}: ${result.answer}` : '');
  });

  useEffect(() => {
    if (!currentUser?.username) return;
    const unsubscribe = [
      wsService.on<CustomTestResult>('custom-test-result', onCustomResult),
      wsService.on<SampleTestResult[]>('check-sample-tests-result', onSamplesResult),
      ...(allowAnswer
        ? [wsService.on<AnswerForInputResult>('answer-for-input-result', onAnswerResult)]
        : []),
    ];
    return () => unsubscribe.forEach((off) => off());
  }, [currentUser?.username, allowAnswer]);

  const requireUser = () => {
    if (currentUser) return true;
    redirectToLogin();
    return false;
  };
  const onError = (error: unknown) =>
    toast.error(getWorkspaceErrorMessage(error, t('problems.detail.error')));
  const handleRun = () => {
    if (!requireUser() || !problem?.id || !selectedLang || !codeRef.current || locked) return;
    return runTask.run(
      () => {
        setOutput('');
        return runProblemCustomTest({
          problemId: problem.id,
          sourceCode: codeRef.current,
          lang: selectedLang,
          inputData: input,
        });
      },
      {
        onSuccess: (result) => {
          if (result?.id) wsService.send('custom-test-add', result.id);
        },
        onError,
        waitForResultMs: 8000,
      },
    );
  };
  const handleCheckSamples = () => {
    if (!requireUser() || !problem?.id || !selectedLang || !codeRef.current || locked) return;
    return samplesTask.run(
      () => {
        setCheckSamplesResult([]);
        return checkProblemSampleTests(problem.id, {
          sourceCode: codeRef.current,
          lang: selectedLang,
        });
      },
      {
        onSuccess: (result) => {
          if (result?.id) wsService.send('check-sample-tests-add', result.id);
        },
        onError,
        waitForResultMs: 15000,
      },
    );
  };
  const handleAnswerForInput = (payload?: { id?: number }) => {
    if (!allowAnswer || !requireUser() || !problem?.id || locked) return;
    return answerTask.run<{ id?: number }>(
      () =>
        payload?.id
          ? Promise.resolve(payload)
          : getProblemAnswerForInput(problem.id, {
              input_data: input,
              lang: selectedLang,
              sourceCode: codeRef.current,
            }),
      {
        onSuccess: (result) => {
          if (result?.id) wsService.send('answer-for-input-add', result.id);
        },
        onError,
        waitForResultMs: 12000,
      },
    );
  };

  return {
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
    handleAnswerForInput,
    isRunning: runTask.isPending,
    isCheckingSamples: samplesTask.isPending,
    isAnswering: answerTask.isPending,
  };
};
