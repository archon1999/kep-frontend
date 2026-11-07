import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocker, useNavigate, useParams, useSearchParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { resources } from 'app/routes/resources';
import {
  sendChallengeAntiCheatPenaltyOnExit,
  useApplyChallengeAntiCheatPenalty,
  useStartChallenge,
  useSubmitChallengeAnswer,
} from 'modules/challenges/application/mutations.ts';
import { useChallengeDetail } from 'modules/challenges/application/queries.ts';
import { ChallengeQuestionTimeType, ChallengeStatus } from 'modules/challenges/domain';
import { ChallengePenaltyReason } from 'modules/challenges/domain/contracts/challenges.repository.ts';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { toast } from 'sonner';

export const PENDING_ANTI_CHEAT_PENALTY_KEY = 'challenge-anti-cheat-penalty';

export interface PendingAntiCheatPenalty {
  challengeId: number;
  questionNumber: number;
  reason: ChallengePenaltyReason;
}

const getPendingAntiCheatPenalty = (): PendingAntiCheatPenalty | null => {
  try {
    const raw = sessionStorage.getItem(PENDING_ANTI_CHEAT_PENALTY_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PendingAntiCheatPenalty>;
    const challengeId = Number(parsed.challengeId);
    const questionNumber = Number(parsed.questionNumber);

    if (!challengeId || !questionNumber) return null;

    return {
      challengeId,
      questionNumber,
      reason: parsed.reason ?? 'reconcile',
    };
  } catch {
    return null;
  }
};

export const useChallengeDetailPage = () => {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const arenaId = searchParams.get('arena');

  const navigate = useNavigate();

  const { t } = useTranslation();

  const { currentUser, sessionExpired, refreshCurrentUser } = useAuth();

  const redirectToLogin = useLoginRedirect();

  const { data: challenge, error, isLoading, mutate } = useChallengeDetail(id);

  const { trigger: startChallenge, isMutating: starting } = useStartChallenge();

  const { trigger: submitAnswer } = useSubmitChallengeAnswer();
  const questionScope = `${id}:${challenge?.nextQuestion?.number ?? 0}`;
  const { run: runAnswer, isPending: submitting } = useScopedAsyncTask(questionScope);
  const handledQuestionRef = useRef<string | null>(null);
  const [submissionError, setSubmissionError] = useState(false);
  const deadlineRef = useRef<{ scope: string; at: number } | null>(null);

  const { trigger: applyAntiCheatPenalty } = useApplyChallengeAntiCheatPenalty();

  useDocumentTitle(
    challenge?.playerFirst?.username && challenge?.playerSecond?.username
      ? 'pageTitles.challenge'
      : undefined,
    challenge
      ? {
          playerFirstUsername: challenge.playerFirst.username,
          playerSecondUsername: challenge.playerSecond.username,
        }
      : undefined,
  );

  const finishHandledRef = useRef(false);

  const penaltyInFlightRef = useRef<string | null>(null);

  const reconciledPenaltyRef = useRef<string | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(0);

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerScope, setTimerScope] = useState<string | null>(null);

  const [startDialogOpen, setStartDialogOpen] = useState(false);

  const [finishDialogOpen, setFinishDialogOpen] = useState(false);

  const [blurDialogOpen, setBlurDialogOpen] = useState(false);

  const question = useMemo(
    () => challenge?.nextQuestion?.question,
    [challenge?.nextQuestion?.question],
  );

  const hasActiveQuestion = Boolean(question);

  const blurProtectionActive =
    challenge?.status === ChallengeStatus.Already &&
    hasActiveQuestion &&
    !sessionExpired &&
    !error &&
    !submissionError;

  const getActiveAntiCheatPenalty = useCallback(
    (reason: ChallengePenaltyReason): PendingAntiCheatPenalty | null => {
      if (
        !challenge ||
        challenge.status !== ChallengeStatus.Already ||
        !question ||
        sessionExpired ||
        error ||
        submissionError
      )
        return null;
      if (!challenge.nextQuestion?.number) return null;

      return {
        challengeId: challenge.id,
        questionNumber: challenge.nextQuestion.number,
        reason,
      };
    },
    [challenge, question, sessionExpired, error, submissionError],
  );

  const runAntiCheatPenalty = useCallback(
    async (
      reason: ChallengePenaltyReason,
      options?: { notify?: boolean; penalty?: PendingAntiCheatPenalty },
    ) => {
      const penalty = options?.penalty ?? getActiveAntiCheatPenalty(reason);
      if (!penalty) return false;

      const key = `${penalty.challengeId}:${penalty.questionNumber}`;
      if (penaltyInFlightRef.current === key) return false;

      penaltyInFlightRef.current = key;

      try {
        const result = await applyAntiCheatPenalty({
          challengeId: penalty.challengeId,
          payload: {
            questionNumber: penalty.questionNumber,
            reason: options?.penalty ? penalty.reason : reason,
          },
        });

        if (result?.penalized && options?.notify !== false) {
          toast.error(t('challenges.blurError'));
          setBlurDialogOpen(true);
        }

        await mutate();
        return Boolean(result?.penalized);
      } catch {
        return false;
      } finally {
        if (penaltyInFlightRef.current === key) {
          penaltyInFlightRef.current = null;
        }
      }
    },
    [applyAntiCheatPenalty, getActiveAntiCheatPenalty, mutate, t],
  );

  const routeBlocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      blurProtectionActive &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search),
  );

  useEffect(() => {
    if (
      !challenge ||
      challenge.status !== ChallengeStatus.Already ||
      !hasActiveQuestion ||
      sessionExpired ||
      error ||
      submissionError
    ) {
      setTimerRunning(false);
      return;
    }
    const deadline =
      challenge.questionDeadline && challenge.serverTime
        ? Date.now() + Date.parse(challenge.questionDeadline) - Date.parse(challenge.serverTime)
        : Date.now() + (challenge.remainingTimeSeconds ?? challenge.timeSeconds) * 1000;
    // A poll or rerender must never restart the same question's clock.
    const previous = deadlineRef.current;
    deadlineRef.current = {
      scope: questionScope,
      at: previous?.scope === questionScope ? Math.min(previous.at, deadline) : deadline,
    };
    const tick = () =>
      setSecondsLeft(
        Math.max(0, Math.ceil(((deadlineRef.current?.at ?? Date.now()) - Date.now()) / 1000)),
      );
    tick();
    setTimerScope(questionScope);
    setTimerRunning(true);
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [
    challenge?.id,
    challenge?.status,
    challenge?.questionDeadline,
    challenge?.serverTime,
    challenge?.remainingTimeSeconds,
    challenge?.timeSeconds,
    questionScope,
    hasActiveQuestion,
    sessionExpired,
    error,
    submissionError,
  ]);

  useEffect(() => {
    if (!challenge) return;

    if (challenge.status === ChallengeStatus.NotStarted) {
      setStartDialogOpen(true);
      finishHandledRef.current = false;
      return;
    }

    setStartDialogOpen(false);
  }, [challenge?.id, challenge?.status]);

  useEffect(() => {
    if (!challenge || challenge.status !== ChallengeStatus.Finished) {
      finishHandledRef.current = false;
      return;
    }

    if (finishHandledRef.current) return;
    finishHandledRef.current = true;

    if (arenaId) {
      navigate(resources.ArenaTournament.replace(':id', arenaId), { replace: true });
      return;
    }

    setFinishDialogOpen(true);
  }, [arenaId, challenge, navigate]);

  useEffect(() => {
    if (!challenge) return;

    const pending = getPendingAntiCheatPenalty();
    if (!pending || pending.challengeId !== challenge.id) return;

    const key = `${pending.challengeId}:${pending.questionNumber}`;
    if (reconciledPenaltyRef.current === key) return;

    reconciledPenaltyRef.current = key;
    sessionStorage.removeItem(PENDING_ANTI_CHEAT_PENALTY_KEY);
    void runAntiCheatPenalty('reconcile', {
      notify: false,
      penalty: {
        ...pending,
        reason: 'reconcile',
      },
    });
  }, [challenge, runAntiCheatPenalty]);

  useEffect(() => {
    if (routeBlocker.state !== 'blocked') return;

    void (async () => {
      await runAntiCheatPenalty('route_leave', { notify: false });
      routeBlocker.proceed();
    })();
  }, [routeBlocker, runAntiCheatPenalty]);

  const handleStart = async () => {
    if (!challenge) return;
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    await startChallenge(challenge.id);
    await mutate();
    setStartDialogOpen(false);
  };

  const handleSubmit = useCallback(
    async (payload: {
      answer: unknown;
      isFinish?: boolean;
      forceFail?: boolean;
      source?: 'answer' | 'timeout' | 'finish';
    }) => {
      const number = challenge?.nextQuestion?.number;
      if (
        !challenge ||
        !number ||
        sessionExpired ||
        error ||
        submissionError ||
        handledQuestionRef.current === questionScope
      )
        return;
      await runAnswer(
        () =>
          submitAnswer({
            challengeId: challenge.id,
            payload: { ...payload, questionNumber: number },
          }),
        {
          onSuccess: async (result) => {
            if (result?.code === 'not_expired') deadlineRef.current = null;
            if (result?.accepted) {
              handledQuestionRef.current = questionScope;
              if (result.timedOut) toast.error(t('challenges.timeExpired'));
              else if (result.success) toast.success(t('challenges.answerCorrect'));
              else toast.error(t('challenges.answerWrong'));
            }
            await mutate();
          },
          onError: () => {
            setSubmissionError(true);
            setTimerRunning(false);
            toast.error(t('challenges.submitAnswerError'));
          },
        },
      );
    },
    [
      challenge,
      sessionExpired,
      error,
      submissionError,
      questionScope,
      runAnswer,
      submitAnswer,
      mutate,
      t,
    ],
  );

  const handleTimeExpired = useCallback(
    () =>
      handleSubmit({
        answer: null,
        isFinish: challenge?.questionTimeType === ChallengeQuestionTimeType.TimeToAll,
        source: 'timeout',
      }),
    [challenge?.questionTimeType, handleSubmit],
  );

  const recoverChallenge = async () => {
    try {
      if (sessionExpired && !(await refreshCurrentUser())) return;
      await mutate();
      setSubmissionError(false);
    } catch {
      setSubmissionError(true);
    }
  };

  const goBack = () => {
    if (arenaId) {
      navigate(resources.ArenaTournament.replace(':id', arenaId));
      return;
    }
    navigate(resources.Challenges);
  };

  const handleFinishClose = () => {
    setFinishDialogOpen(false);
    goBack();
  };

  const handleStayOnPage = () => setFinishDialogOpen(false);

  const handleBlurDialogClose = async () => {
    setBlurDialogOpen(false);
    await mutate();
  };

  const handlePageExit = useCallback(() => {
    const penalty = getActiveAntiCheatPenalty('pagehide');
    if (!penalty) return;
    try {
      sessionStorage.setItem(PENDING_ANTI_CHEAT_PENALTY_KEY, JSON.stringify(penalty));
    } catch {
      // Sending the penalty must still work when browser storage is unavailable.
    }
    sendChallengeAntiCheatPenaltyOnExit(penalty.challengeId, {
      questionNumber: penalty.questionNumber,
      reason: penalty.reason,
    });
  }, [getActiveAntiCheatPenalty]);

  const showQuestion = challenge?.status === ChallengeStatus.Already && question;

  const hideBackgroundContent = challenge?.status === ChallengeStatus.NotStarted;

  const timerModeLabel =
    challenge?.questionTimeType === ChallengeQuestionTimeType.TimeToOne
      ? t('challenges.timer.perQuestion')
      : t('challenges.timer.wholeChallenge');
  return {
    challenge,
    error,
    isLoading,
    mutate,
    starting,
    submitting,
    submissionError,
    sessionExpired,
    recoverChallenge,
    question,
    blurProtectionActive,
    handlePageExit,
    runAntiCheatPenalty,
    handleTimeExpired,
    handleStart,
    handleSubmit,
    handleFinishClose,
    handleBlurDialogClose,
    showQuestion,
    hideBackgroundContent,
    timerModeLabel,
    blurDialogOpen,
    setBlurDialogOpen,
    timerRunning: timerRunning && timerScope === questionScope,
    setTimerRunning,
    secondsLeft,
    startDialogOpen,
    finishDialogOpen,
    handleStayOnPage,
  };
};
