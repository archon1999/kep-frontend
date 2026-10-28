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

  const { currentUser } = useAuth();

  const redirectToLogin = useLoginRedirect();

  const { data: challenge, error, isLoading, mutate } = useChallengeDetail(id);

  const { trigger: startChallenge, isMutating: starting } = useStartChallenge();

  const { trigger: submitAnswer, isMutating: submitting } = useSubmitChallengeAnswer();

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

  const timeExpiredHandledRef = useRef(false);

  const penaltyInFlightRef = useRef<string | null>(null);

  const reconciledPenaltyRef = useRef<string | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(0);

  const [timerRunning, setTimerRunning] = useState(false);

  const [startDialogOpen, setStartDialogOpen] = useState(false);

  const [finishDialogOpen, setFinishDialogOpen] = useState(false);

  const [blurDialogOpen, setBlurDialogOpen] = useState(false);

  const question = useMemo(
    () => challenge?.nextQuestion?.question,
    [challenge?.nextQuestion?.question],
  );

  const hasActiveQuestion = Boolean(question);

  const blurProtectionActive = challenge?.status === ChallengeStatus.Already && hasActiveQuestion;

  const getActiveAntiCheatPenalty = useCallback(
    (reason: ChallengePenaltyReason): PendingAntiCheatPenalty | null => {
      if (!challenge || challenge.status !== ChallengeStatus.Already || !question) return null;
      if (!challenge.nextQuestion?.number) return null;

      return {
        challengeId: challenge.id,
        questionNumber: challenge.nextQuestion.number,
        reason,
      };
    },
    [challenge, question],
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
    timeExpiredHandledRef.current = false;
  }, [challenge?.id]);

  useEffect(() => {
    if (!challenge || challenge.status !== ChallengeStatus.Already || !hasActiveQuestion) {
      setTimerRunning(false);
      return;
    }

    if (challenge.questionTimeType === ChallengeQuestionTimeType.TimeToOne) {
      setSecondsLeft(challenge.timeSeconds);
      setTimerRunning(true);
    } else {
      setSecondsLeft(challenge.remainingTimeSeconds ?? challenge.timeSeconds);
      setTimerRunning(true);
    }
  }, [
    challenge?.id,
    challenge?.status,
    challenge?.nextQuestion?.number,
    challenge?.questionTimeType,
    challenge?.remainingTimeSeconds,
    challenge?.timeSeconds,
    hasActiveQuestion,
  ]);

  const handleTimeExpired = useCallback(async () => {
    if (
      !challenge ||
      challenge.status !== ChallengeStatus.Already ||
      !question ||
      timeExpiredHandledRef.current
    ) {
      return;
    }

    timeExpiredHandledRef.current = true;
    setTimerRunning(false);
    toast.error(t('challenges.timeExpired'));

    try {
      await submitAnswer({
        challengeId: challenge.id,
        payload: {
          answer: null,
          isFinish: true,
        },
      });

      await mutate();
    } catch {
      timeExpiredHandledRef.current = false;
    }
  }, [challenge, mutate, question, submitAnswer, t]);

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

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

  const handleSubmit = async (payload: {
    answer: unknown;
    isFinish?: boolean;
    forceFail?: boolean;
  }) => {
    if (!challenge) return;
    try {
      const result = await submitAnswer({ challengeId: challenge.id, payload });

      if (result?.success !== undefined) {
        const message = result.success
          ? t('challenges.answerCorrect')
          : t('challenges.answerWrong');
        const notify = result.success ? toast.success : toast.error;
        notify(message);
      }

      await mutate();
    } catch {
      toast.error(t('challenges.submitAnswerError'));
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
    timerRunning,
    setTimerRunning,
    secondsLeft,
    startDialogOpen,
    finishDialogOpen,
    handleStayOnPage,
  };
};
