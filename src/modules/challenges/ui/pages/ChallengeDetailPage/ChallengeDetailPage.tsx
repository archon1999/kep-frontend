import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useChallengeDetailPage } from 'modules/challenges/application/hooks/useChallengeDetailPage';
import { ChallengeQuestionTimeType, ChallengeStatus } from 'modules/challenges/domain';
import { QuestionType } from 'modules/testing/domain';
import EmptyState from 'shared/components/common/EmptyState';
import PageLoader from 'shared/components/loading/PageLoader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import ChallengeDetailPageContent from './ChallengeDetailPageContent.tsx';
import { QuestionCardHandle } from './components/ChallengeQuestionCard.tsx';
import ChallengeBlurDialog from './dialogs/ChallengeBlurDialog.tsx';
import ChallengeFinishDialog from './dialogs/ChallengeFinishDialog.tsx';
import ChallengeStartDialog from './dialogs/ChallengeStartDialog.tsx';
import { clearChallengeChessProgress } from './lib/chessPuzzleProgress.ts';

const ChallengeDetailPage = () => {
  const {
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
  } = useChallengeDetailPage();

  const { t } = useTranslation();

  const questionCardRef = useRef<QuestionCardHandle>(null);
  const blurCheckTimeoutRef = useRef<number | null>(null);
  const suppressBlurUntilRef = useRef(0);

  useEffect(() => {
    if (!challenge) return;

    if (
      challenge.status !== ChallengeStatus.Already ||
      challenge.nextQuestion?.question?.type !== QuestionType.ChessPuzzle
    ) {
      clearChallengeChessProgress(challenge.id);
      return;
    }

    clearChallengeChessProgress(challenge.id, challenge.nextQuestion.number);
  }, [
    challenge?.id,
    challenge?.nextQuestion?.number,
    challenge?.nextQuestion?.question?.type,
    challenge?.status,
  ]);

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

    window.addEventListener('pagehide', handlePageExit);

    return () => {
      window.removeEventListener('pagehide', handlePageExit);
    };
  }, [blurProtectionActive, handlePageExit]);

  if (isLoading) return <PageLoader />;

  if (!challenge) {
    return (
      <FramedPage>
        <EmptyState
          kind={error ? 'error' : 'empty'}
          title={t(error ? 'common.loadFailed' : 'challenges.notFound')}
          action={
            error ? <Button onClick={() => void mutate()}>{t('common.retry')}</Button> : undefined
          }
        />
      </FramedPage>
    );
  }

  return (
    <FramedPage>
      <Box
        sx={{
          minHeight: hideBackgroundContent ? '70vh' : undefined,
        }}
      >
        <ChallengeDetailPageContent
          challenge={challenge}
          hideBackgroundContent={hideBackgroundContent}
          showQuestion={Boolean(showQuestion)}
          question={question}
          questionCardRef={questionCardRef}
          onSubmit={handleSubmit}
          submitting={submitting}
          secondsLeft={secondsLeft}
        />

        <ChallengeStartDialog
          open={startDialogOpen}
          challenge={challenge}
          timerModeLabel={timerModeLabel}
          starting={starting}
          onStart={handleStart}
        />

        <ChallengeFinishDialog
          open={finishDialogOpen}
          challenge={challenge}
          onClose={handleStayOnPage}
          onBackToList={handleFinishClose}
        />

        <ChallengeBlurDialog open={blurDialogOpen} onClose={handleBlurDialogClose} />
      </Box>
    </FramedPage>
  );
};

export default ChallengeDetailPage;
