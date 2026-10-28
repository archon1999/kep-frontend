import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import DialogHeader from 'shared/components/common/DialogHeader';
import { getCountdownParts, getDateTimeValue } from 'shared/lib/dateTime';

interface ContestStandingsCountdownProps {
  contest?: ContestDetail | null;
}

const DigitBox = ({ digit }: { digit: string }) => (
  <Typography
    variant="metric"
    sx={{
      minWidth: { xs: 22, md: 32 },
      fontSize: { xs: 30, md: 42 },
      lineHeight: 1.15,
      textAlign: 'center',
    }}
  >
    {digit}
  </Typography>
);

const TimeUnit = ({ label, value }: { label: string; value: number }) => {
  const digits = String(value).padStart(2, '0').split('');

  return (
    <Stack
      spacing={{ xs: 0.4, md: 1 }}
      alignItems="center"
      sx={{ flex: { xs: 1, md: '0 0 auto' }, minWidth: { xs: 0, md: 'auto' } }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 0.5, sm: 0.75, md: 1 }}
        sx={{ width: { xs: '100%', md: 'auto' } }}
      >
        {digits.map((digit, idx) => (
          <DigitBox key={`${label}-${idx}`} digit={digit} />
        ))}
      </Stack>
      <Typography
        variant="caption"
        sx={{
          letterSpacing: { xs: 0, md: 0.4 },
          fontSize: { xs: '0.58rem', sm: '0.65rem', md: undefined },
          lineHeight: { xs: 1, md: undefined },
          fontWeight: { xs: 700, md: undefined },
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
};

const MobileSeparator = () => (
  <Typography
    aria-hidden="true"
    sx={{
      display: { xs: 'block', md: 'none' },
      mt: { xs: 1.05, sm: 1.4 },
      fontSize: { xs: 20, sm: 26 },
      fontWeight: 800,
      lineHeight: 1,
      color: 'text.secondary',
    }}
  >
    :
  </Typography>
);

const ContestStandingsCountdown = ({ contest }: ContestStandingsCountdownProps) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());
  const [phase, setPhase] = useState<ContestStatus | null>(contest?.statusCode ?? null);
  const [activeModal, setActiveModal] = useState<'start' | 'finish' | null>(null);
  const prevPhaseRef = useRef<ContestStatus | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
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

  const startDate = contest?.startTime;
  const finishDate = contest?.finishTime;

  const safePhase = phase ?? ContestStatus.NotStarted;

  const targetDate = useMemo(() => {
    if (safePhase === ContestStatus.NotStarted) return startDate;
    if (safePhase === ContestStatus.Already) return finishDate;
    return null;
  }, [finishDate, safePhase, startDate]);

  const remainingMs = targetDate ? Math.max(getDateTimeValue(targetDate) - now, 0) : 0;
  const { hours, minutes, seconds } = getCountdownParts(remainingMs);

  useEffect(() => {
    if (!targetDate || phase === null) return;

    if (remainingMs <= 0) {
      if (safePhase === ContestStatus.NotStarted) {
        setPhase(ContestStatus.Already);
      } else if (safePhase === ContestStatus.Already) {
        setPhase(ContestStatus.Finished);
      }
    }
  }, [remainingMs, phase, safePhase, targetDate]);

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
        <Card variant="section">
          <CardContent sx={{ px: { xs: 1.25, sm: 2, md: 3 }, py: { xs: 1.5, md: 2 } }}>
            <Stack spacing={{ xs: 1, md: 2 }} alignItems="center">
              <Typography
                variant="label"
                sx={{
                  color: { xs: 'text.primary', md: 'text.secondary' },
                  letterSpacing: { xs: 0.2, md: 0.6 },
                  fontSize: { xs: '0.68rem', md: undefined },
                  lineHeight: { xs: 1, md: undefined },
                  fontWeight: { xs: 800, md: undefined },
                  textTransform: 'uppercase',
                }}
              >
                {t('contests.countdownCard.ends')}
              </Typography>

              <Stack
                direction="row"
                spacing={{ xs: 0.75, sm: 1.25, md: 3 }}
                alignItems="flex-start"
                justifyContent={{ xs: 'space-between', md: 'center' }}
                sx={{ width: { xs: '100%', md: 'auto' }, minWidth: 0 }}
              >
                <TimeUnit label={t('contests.timeLabels.hour')} value={hours} />
                <MobileSeparator />
                <TimeUnit label={t('contests.timeLabels.minute')} value={minutes} />
                <MobileSeparator />
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
        <DialogHeader
          id="contest-standings-countdown-dialog-title"
          title={
            activeModal === 'start'
              ? t('contests.countdownCard.started')
              : t('contests.countdownCard.finished')
          }
          onClose={() => setActiveModal(null)}
        />
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
