import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
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
import KepIcon from 'shared/components/base/KepIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import { useStartChallenge, useSubmitChallengeAnswer } from '../../application/mutations.ts';
import { useChallengeDetail } from '../../application/queries.ts';
import { ChallengeQuestionTimeType, ChallengeStatus } from '../../domain';
import ChallengeCountdown from '../components/ChallengeCountdown.tsx';
import ChallengeQuestionCard, {
  ChallengeQuestionCardHandle,
} from '../components/ChallengeQuestionCard.tsx';
import ChallengeResultsCard from '../components/ChallengeResultsCard.tsx';
import ChallengeUserChip from '../components/ChallengeUserChip.tsx';

dayjs.extend(relativeTime);

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const arenaId = searchParams.get('arena');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: challenge, isLoading, mutate } = useChallengeDetail(id);
  const { trigger: startChallenge, isMutating: starting } = useStartChallenge();
  const { trigger: submitAnswer, isMutating: submitting } = useSubmitChallengeAnswer();
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
  const timerStartedRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [blurDialogOpen, setBlurDialogOpen] = useState(false);

  const question = useMemo(
    () => challenge?.nextQuestion?.question,
    [challenge?.nextQuestion?.question],
  );

  useEffect(() => {
    if (!challenge || challenge.status !== ChallengeStatus.Already || !question) {
      setTimerRunning(false);
      timerStartedRef.current = false;
      return;
    }

    if (challenge.questionTimeType === ChallengeQuestionTimeType.TimeToOne) {
      setSecondsLeft(challenge.timeSeconds);
      setTimerRunning(true);
    } else if (!timerStartedRef.current) {
      setSecondsLeft(challenge.timeSeconds);
      setTimerRunning(true);
      timerStartedRef.current = true;
    }
  }, [
    challenge?.id,
    challenge?.status,
    challenge?.nextQuestion?.number,
    challenge?.questionTimeType,
    challenge?.timeSeconds,
    question,
  ]);

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  useEffect(() => {
    if (!timerRunning || secondsLeft > 0) return;
    setTimerRunning(false);
    questionCardRef.current?.submit({
      isFinish: challenge?.questionTimeType === ChallengeQuestionTimeType.TimeToAll,
      force: true,
    });
  }, [timerRunning, secondsLeft, challenge?.questionTimeType]);

  useEffect(() => {
    const handleBlur = () => {
      if (!challenge?.nextQuestion?.question || challenge.status === ChallengeStatus.Finished) {
        return;
      }
      setBlurDialogOpen(true);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [challenge]);

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
  const timerModeLabel =
    challenge.questionTimeType === ChallengeQuestionTimeType.TimeToOne
      ? t('challenges.timer.perQuestion')
      : t('challenges.timer.wholeChallenge');

  return (
    <Box sx={responsivePagePaddingSx}>
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
                disabled={submitting}
                isSubmitting={submitting}
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
                    {challenge.status === ChallengeStatus.NotStarted ? (
                      <Button
                        variant="contained"
                        onClick={handleStart}
                        disabled={starting}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        {t('challenges.start')}
                      </Button>
                    ) : null}
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

      <Dialog
        open={startDialogOpen}
        onClose={() => setStartDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="challenge-time" fontSize={20} color="primary.main" />
            <Typography variant="h6">{t('challenges.startDialogTitle')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.startDialogSubtitle')}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <ChallengeUserChip player={challenge.playerFirst} />
              <Typography variant="h6" fontWeight={900} color="primary.main">
                VS
              </Typography>
              <ChallengeUserChip player={challenge.playerSecond} align="right" />
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={challenge.rated ? t('challenges.rated') : t('challenges.unrated')}
                variant="outlined"
              />
              <Chip label={t('challenges.questionsCount', { count: challenge.questionsCount })} />
              <Chip label={t('challenges.timeLimitShort', { seconds: challenge.timeSeconds })} />
              <Chip label={timerModeLabel} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDialogOpen(false)}>{t('common.close')}</Button>
          <Button variant="contained" onClick={handleStart} disabled={starting}>
            {t('challenges.start')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={finishDialogOpen} onClose={handleStayOnPage} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="challenge" fontSize={20} color="success.main" />
            <Typography variant="h6">{t('challenges.finishDialogTitle')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.finishedDescription')}
            </Typography>
            <ChallengeResultsCard challenge={challenge} />
          </Stack>
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
