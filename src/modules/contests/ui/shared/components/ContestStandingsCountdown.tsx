import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import DialogHeader from 'shared/components/common/DialogHeader';
import { getCountdownParts, getDateTimeValue } from 'shared/lib/dateTime';
import { countdownStyles } from './ContestStandingsCountdown.styles';

interface ContestStandingsCountdownProps {
  contest?: ContestDetail | null;
}

const TimeUnit = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <Stack sx={countdownStyles.unit}>
    <Typography variant="metric" sx={[countdownStyles.digits, accent && countdownStyles.seconds]}>
      {String(value).padStart(2, '0')}
    </Typography>
    <Typography variant="pixel" component="span" sx={countdownStyles.unitLabel}>
      {label}
    </Typography>
  </Stack>
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
  const startTimeMs = getDateTimeValue(startDate);
  const durationMs = startTimeMs && finishDate ? getDateTimeValue(finishDate) - startTimeMs : 0;
  const elapsed =
    Number.isFinite(durationMs) && durationMs > 0
      ? Math.min(100, Math.max(0, 100 - (remainingMs / durationMs) * 100))
      : undefined;
  const isClosing = remainingMs > 0 && remainingMs <= 5 * 60 * 1000;

  return (
    <>
      {showCard ? (
        <Card
          variant="section"
          sx={[
            countdownStyles.panel,
            isClosing && { '--countdown-accent': 'var(--mui-palette-warning-main)' },
          ]}
        >
          <CardContent sx={countdownStyles.content}>
            <Box
              role="timer"
              aria-live="off"
              aria-label={t('contests.countdownCard.ends')}
              sx={countdownStyles.clock}
            >
              <TimeUnit label={t('contests.timeLabels.hour')} value={hours} />
              <Box aria-hidden="true" sx={countdownStyles.separator} />
              <TimeUnit label={t('contests.timeLabels.minute')} value={minutes} />
              <Box aria-hidden="true" sx={countdownStyles.separator} />
              <TimeUnit label={t('contests.timeLabels.second')} value={seconds} accent />
            </Box>
          </CardContent>
          {elapsed !== undefined && (
            <LinearProgress
              variant="determinate"
              value={elapsed}
              aria-label={t('contests.countdownCard.elapsed')}
              sx={countdownStyles.progress}
            />
          )}
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
