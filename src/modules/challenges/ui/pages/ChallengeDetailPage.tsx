import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocker, useNavigate, useParams, useSearchParams } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { QuestionType } from 'modules/testing/domain';
import KepIcon from 'shared/components/base/KepIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import {
  useApplyChallengeAntiCheatPenalty,
  useStartChallenge,
  useSubmitChessMove,
  useSubmitChallengeAnswer,
} from '../../application/mutations.ts';
import { useChallengeDetail } from '../../application/queries.ts';
import { sendChallengeAntiCheatPenaltyKeepalive } from '../../data-access/api/challenges.client.ts';
import { ChallengeQuestionTimeType, ChallengeStatus } from '../../domain';
import {
  ChessMovePayload,
  ChessMoveResponse,
  ChallengePenaltyReason,
} from '../../domain/ports/challenges.repository.ts';
import ChallengeCountdown from '../components/ChallengeCountdown.tsx';
import ChallengeQuestionCard, {
  ChallengeQuestionCardHandle,
} from '../components/ChallengeQuestionCard.tsx';
import ChallengeResultsCard from '../components/ChallengeResultsCard.tsx';
import ChallengeUserChip from '../components/ChallengeUserChip.tsx';

dayjs.extend(relativeTime);

const PENDING_ANTI_CHEAT_PENALTY_KEY = 'challenge-anti-cheat-penalty';

interface PendingAntiCheatPenalty {
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

const setPendingAntiCheatPenalty = (penalty: PendingAntiCheatPenalty) => {
  sessionStorage.setItem(PENDING_ANTI_CHEAT_PENALTY_KEY, JSON.stringify(penalty));
};

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const arenaId = searchParams.get('arena');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: challenge, isLoading, mutate } = useChallengeDetail(id);
  const { trigger: startChallenge, isMutating: starting } = useStartChallenge();
  const { trigger: submitAnswer, isMutating: submitting } = useSubmitChallengeAnswer();
  const { trigger: submitChessMove, isMutating: submittingChess } = useSubmitChessMove();
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

  const questionCardRef = useRef<ChallengeQuestionCardHandle>(null);
  const finishHandledRef = useRef(false);
  const timeExpiredHandledRef = useRef(false);
  const blurCheckTimeoutRef = useRef<number | null>(null);
  const suppressBlurUntilRef = useRef(0);
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
  const blurProtectionActive = challenge?.status === ChallengeStatus.Already && Boolean(question);

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

  const routeBlocker = useBlocker(({ currentLocation, nextLocation }) => (
    blurProtectionActive
    && (
      currentLocation.pathname !== nextLocation.pathname
      || currentLocation.search !== nextLocation.search
    )
  ));

  useEffect(() => {
    timeExpiredHandledRef.current = false;
  }, [challenge?.id]);

  useEffect(() => {
    if (!challenge || challenge.status !== ChallengeStatus.Already || !question) {
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
    question,
  ]);

  const handleTimeExpired = useCallback(async () => {
    if (
      !challenge
      || challenge.status !== ChallengeStatus.Already
      || !question
      || timeExpiredHandledRef.current
    ) {
      return;
    }

    timeExpiredHandledRef.current = true;
    setTimerRunning(false);
    toast.error(t('challenges.timeExpired'));

    try {
      if (question.type === QuestionType.ChessPuzzle) {
        const questionNumber = challenge.nextQuestion?.number ?? question.number;
        if (!questionNumber) return;

        await submitChessMove({
          challengeId: challenge.id,
          payload: {
            questionNumber,
            playedLine: [],
            finish: true,
          },
        });
      } else {
        await submitAnswer({
          challengeId: challenge.id,
          payload: {
            answer: null,
            isFinish: true,
          },
        });
      }

      await mutate();
    } catch {
      timeExpiredHandledRef.current = false;
    }
  }, [challenge, mutate, question, submitAnswer, submitChessMove, t]);

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  useEffect(() => {
    if (!timerRunning || secondsLeft > 0) return;

    if (challenge?.questionTimeType === ChallengeQuestionTimeType.TimeToAll) {
      void handleTimeExpired();
      return;
    }

    setTimerRunning(false);
    questionCardRef.current?.submit({ force: true });
  }, [timerRunning, secondsLeft, challenge?.questionTimeType, handleTimeExpired]);

  useEffect(() => {
    if (!challenge || challenge.status !== ChallengeStatus.Already) return;

    const interval = window.setInterval(() => {
      void mutate();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [challenge?.id, challenge?.status, mutate]);

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
    const markTransientBlur = () => {
      suppressBlurUntilRef.current = Date.now() + 800;
    };

    window.addEventListener('dragstart', markTransientBlur, true);
    window.addEventListener('dragenter', markTransientBlur, true);
    window.addEventListener('dragover', markTransientBlur, true);
    window.addEventListener('dragend', markTransientBlur, true);
    window.addEventListener('drop', markTransientBlur, true);

    return () => {
      window.removeEventListener('dragstart', markTransientBlur, true);
      window.removeEventListener('dragenter', markTransientBlur, true);
      window.removeEventListener('dragover', markTransientBlur, true);
      window.removeEventListener('dragend', markTransientBlur, true);
      window.removeEventListener('drop', markTransientBlur, true);
    };
  }, []);

  useEffect(() => {
    const clearPendingBlurCheck = () => {
      if (blurCheckTimeoutRef.current != null) {
        window.clearTimeout(blurCheckTimeoutRef.current);
        blurCheckTimeoutRef.current = null;
      }
    };

    if (!blurProtectionActive) {
      clearPendingBlurCheck();
      setBlurDialogOpen(false);
      return;
    }

    const scheduleBlurCheck = () => {
      clearPendingBlurCheck();

      blurCheckTimeoutRef.current = window.setTimeout(() => {
        blurCheckTimeoutRef.current = null;

        if (Date.now() < suppressBlurUntilRef.current) {
          return;
        }

        const pageHidden = document.visibilityState === 'hidden';
        const pageFocused = document.hasFocus();

        if (!pageHidden && pageFocused) {
          return;
        }

        void runAntiCheatPenalty('blur');
      }, 150);
    };

    const handleWindowBlur = () => {
      scheduleBlurCheck();
    };

    const handleWindowFocus = () => {
      clearPendingBlurCheck();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        scheduleBlurCheck();
        return;
      }

      clearPendingBlurCheck();
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearPendingBlurCheck();
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [blurProtectionActive, runAntiCheatPenalty]);

  useEffect(() => {
    if (!blurProtectionActive) return;

    const handlePageHide = () => {
      const penalty = getActiveAntiCheatPenalty('pagehide');
      if (!penalty) return;

      setPendingAntiCheatPenalty(penalty);
      sendChallengeAntiCheatPenaltyKeepalive(penalty.challengeId, {
        questionNumber: penalty.questionNumber,
        reason: penalty.reason,
      });
    };

    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [blurProtectionActive, getActiveAntiCheatPenalty]);

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
    await startChallenge(challenge.id);
    await mutate();
    setStartDialogOpen(false);
  };

  const handleSubmit = async (payload: { answer: unknown; isFinish?: boolean }) => {
    if (!challenge) return;
    const result = await submitAnswer({ challengeId: challenge.id, payload });

    if (result?.success !== undefined) {
      const message = result.success ? t('challenges.answerCorrect') : t('challenges.answerWrong');
      const notify = result.success ? toast.success : toast.error;
      notify(message);
    }

    await mutate();
  };

  const handleChessMove = async (
    payload: ChessMovePayload,
  ): Promise<ChessMoveResponse | undefined> => {
    if (!challenge) return undefined;
    return submitChessMove({ challengeId: challenge.id, payload });
  };

  const handleChessResolved = async () => {
    await mutate();
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!challenge) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Typography variant="body1">{t('challenges.notFound')}</Typography>
      </Box>
    );
  }

  const showQuestion = challenge.status === ChallengeStatus.Already && question;
  const hideBackgroundContent = challenge.status === ChallengeStatus.NotStarted;
  const timerModeLabel =
    challenge.questionTimeType === ChallengeQuestionTimeType.TimeToOne
      ? t('challenges.timer.perQuestion')
      : t('challenges.timer.wholeChallenge');

  return (
    <Box
      sx={{
        ...responsivePagePaddingSx,
        minHeight: hideBackgroundContent ? '70vh' : undefined,
      }}
    >
      {!hideBackgroundContent ? (
        <Stack spacing={3} direction="column">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <ChallengeResultsCard challenge={challenge} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              {showQuestion ? (
                <ChallengeQuestionCard
                  ref={questionCardRef}
                  question={question}
                  onSubmit={handleSubmit}
                  onChessMove={handleChessMove}
                  onChessResolved={handleChessResolved}
                  disabled={submitting || submittingChess}
                  isSubmitting={submitting || submittingChess}
                />
              ) : (
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <KepIcon name="challenge-time" fontSize={20} color="primary.main" />
                        <Typography variant="subtitle1" fontWeight={700}>
                          {challenge.status === ChallengeStatus.Finished
                            ? t('challenges.statusFinished')
                            : t('challenges.statusNotStarted')}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {challenge.status === ChallengeStatus.Finished
                          ? t('challenges.finishedDescription')
                          : t('challenges.waitingForStart')}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Stack direction="column" spacing={2} height="100%">
                <ChallengeCountdown
                  secondsLeft={secondsLeft}
                  totalSeconds={challenge.timeSeconds}
                  mode={challenge.questionTimeType}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      ) : null}

      <Dialog
        open={startDialogOpen}
        onClose={() => undefined}
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(10, 16, 24, 0.72)',
              backdropFilter: 'blur(6px)',
            },
          },
        }}
      >
        <DialogContent sx={{ py: 4 }}>
          <Stack spacing={2.5}>
            <Stack direction="column" spacing={1} alignItems="center" textAlign="center">
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.lighter', color: 'primary.main' }}>
                <KepIcon name="challenge-time" fontSize={24} color="primary.main" />
              </Avatar>
              <Typography variant="h5" fontWeight={900}>
                {t('challenges.startDialogTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('challenges.startDialogSubtitle')}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
              <Chip
                label={challenge.rated ? t('challenges.rated') : t('challenges.unrated')}
                variant="outlined"
              />
              <Chip label={t('challenges.timeLimitShort', { seconds: challenge.timeSeconds })} />
              <Chip label={t('challenges.questionsCount', { count: challenge.questionsCount })} />
              <Chip label={timerModeLabel} />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
              <ChallengeUserChip player={challenge.playerFirst} />
              <Typography variant="h6" fontWeight={900} color="primary.main">
                VS
              </Typography>
              <ChallengeUserChip player={challenge.playerSecond} align="right" />
            </Stack>

            <Stack direction="row" justifyContent="center">
              <Button variant="contained" onClick={handleStart} disabled={starting}>
                {t('challenges.start')}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={finishDialogOpen} onClose={handleStayOnPage} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="challenge" fontSize={20} color="success.main" />
            <Typography variant="h6">{t('challenges.finishDialogTitle')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <ChallengeResultsCard challenge={challenge} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStayOnPage}>{t('common.close')}</Button>
          <Button variant="contained" onClick={handleFinishClose}>
            {t('challenges.backToList')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={blurDialogOpen} onClose={handleBlurDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="challenge" fontSize={20} color="error.main" />
            <Typography variant="h6">{t('challenges.blurError')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            {t('challenges.blurError')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleBlurDialogClose}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChallengeDetailPage;
