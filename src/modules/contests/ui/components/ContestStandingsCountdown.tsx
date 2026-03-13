import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { getResourceByParams, resources } from 'app/routes/resources';
import { ContestDetail } from '../../domain/entities/contest-detail.entity';
import { ContestStatus } from '../../domain/entities/contest-status';

interface ContestStandingsCountdownProps {
  contest?: ContestDetail | null;
}

const DigitBox = ({ digit }: { digit: string }) => (
  <Box
    sx={(theme) => ({
      width: 90,
      height: 110,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 2,
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.common.white, 0.08)
          : alpha(theme.palette.primary.main, 0.05),
      border: '1px solid',
      borderColor:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.primary.light, 0.3)
          : alpha(theme.palette.primary.main, 0.14),
      boxShadow: `0 14px 46px ${theme.palette.common.black}18`,
      fontWeight: 800,
      fontSize: 40,
    })}
  >
    {digit}
  </Box>
);

const TimeUnit = ({ label, value }: { label: string; value: number }) => {
  const digits = String(value).padStart(2, '0').split('');

  return (
    <Stack spacing={1} alignItems="center">
      <Stack direction="row" spacing={1}>
        {digits.map((digit, idx) => (
          <DigitBox key={`${label}-${idx}`} digit={digit} />
        ))}
      </Stack>
      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
    </Stack>
  );
};

const ContestStandingsCountdown = ({ contest }: ContestStandingsCountdownProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(dayjs());
  const [phase, setPhase] = useState<ContestStatus | null>(contest?.statusCode ?? null);
  const [activeModal, setActiveModal] = useState<'start' | 'finish' | null>(null);
  const prevPhaseRef = useRef<ContestStatus | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    initializedRef.current = false;
    prevPhaseRef.current = null;
    setActiveModal(null);
  }, [contest?.id]);

  useEffect(() => {
    setPhase(contest?.statusCode ?? null);
  }, [contest?.id, contest?.statusCode, contest?.startTime, contest?.finishTime]);

  const startDate = contest?.startTime ? dayjs(contest.startTime) : null;
  const finishDate = contest?.finishTime ? dayjs(contest.finishTime) : null;

  const safePhase = phase ?? ContestStatus.NotStarted;

  const targetDate = useMemo(() => {
    if (safePhase === ContestStatus.NotStarted) return startDate;
    if (safePhase === ContestStatus.Already) return finishDate;
    return null;
  }, [finishDate, safePhase, startDate]);

  const remainingSeconds = targetDate ? Math.max(Math.floor(targetDate.diff(now) / 1000), 0) : 0;
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  useEffect(() => {
    if (!targetDate || phase === null) return;

    if (remainingSeconds <= 0) {
      if (safePhase === ContestStatus.NotStarted) {
        setPhase(ContestStatus.Already);
      } else if (safePhase === ContestStatus.Already) {
        setPhase(ContestStatus.Finished);
      }
    }
  }, [remainingSeconds, phase, safePhase, targetDate]);

  useEffect(() => {
    if (phase === null) return;
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevPhaseRef.current = phase;
      return;
    }

    if (prevPhaseRef.current === ContestStatus.NotStarted && phase === ContestStatus.Already) {
      setActiveModal('start');
    } else if (prevPhaseRef.current === ContestStatus.Already && phase === ContestStatus.Finished) {
      setActiveModal('finish');
    }

    prevPhaseRef.current = phase;
  }, [phase]);

  if (!contest) {
    return null;
  }

  const problemsLink = getResourceByParams(resources.ContestProblems, { id: contest.id });
  const standingsLink = getResourceByParams(resources.ContestStandings, { id: contest.id });
  const showCard = safePhase === ContestStatus.Already;

  return (
    <>
      {showCard ? (
        <Card
          variant="outlined"
          sx={(theme) => ({
            borderRadius: 3,
            overflow: 'hidden',
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(140deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(theme.palette.secondary.main, 0.16)})`
                : `linear-gradient(140deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
            borderColor: alpha(theme.palette.primary.main, 0.2),
          })}
        >
          <CardContent sx={{ px: 3, py: 3.5 }}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
                {t('contests.countdownCard.ends')}
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                alignItems="center"
                justifyContent="center"
              >
                <TimeUnit label={t('contests.timeLabels.hour')} value={hours} />
                <TimeUnit label={t('contests.timeLabels.minute')} value={minutes} />
                <TimeUnit label={t('contests.timeLabels.second')} value={seconds} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        aria-labelledby="contest-standings-countdown-dialog-title"
      >
        <DialogTitle id="contest-standings-countdown-dialog-title">
          {activeModal === 'start'
            ? t('contests.countdownCard.started')
            : t('contests.countdownCard.finished')}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            {activeModal === 'start'
              ? t('contests.countdownCard.startedBody')
              : t('contests.countdownCard.finishedBody')}
          </Typography>
        </DialogContent>
        <DialogActions>
          {activeModal === 'start' ? (
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={problemsLink}
              onClick={() => setActiveModal(null)}
            >
              {t('contests.tabs.problems')}
            </Button>
          ) : null}
          {activeModal === 'finish' ? (
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={standingsLink}
              onClick={() => setActiveModal(null)}
            >
              {t('contests.tabs.standings')}
            </Button>
          ) : null}
          <Button variant="text" onClick={() => setActiveModal(null)}>
            {t('common.close', 'Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContestStandingsCountdown;
