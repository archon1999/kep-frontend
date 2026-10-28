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
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import KepIcon from 'shared/components/base/KepIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import { formatDateTime, getCountdownParts, getDateTimeValue } from 'shared/lib/dateTime';

interface ContestCountdownCardProps {
  contest?: ContestDetail | null;
  isLoading?: boolean;
}

type CountdownPhase = ContestStatus.NotStarted | ContestStatus.Already | ContestStatus.Finished;

const CountdownTile = ({ value, label }: { value: string; label: string }) => (
  <Stack
    spacing={0.75}
    alignItems="center"
    sx={{ flex: 1, minWidth: 0, py: 1.5, border: 1, borderColor: 'divider' }}
  >
    <Typography variant="metric" sx={{ fontSize: { xs: 32, md: 36 }, lineHeight: 1.1 }}>
      {value}
    </Typography>
    <Typography variant="label" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

const ContestCountdownCard = ({ contest, isLoading = false }: ContestCountdownCardProps) => {
  const { t } = useTranslation();
  const [isLoadedOnce, setIsLoadedOnce] = useState(Boolean(contest));
  const [now, setNow] = useState(Date.now());
  const [phase, setPhase] = useState<CountdownPhase | null>(contest?.statusCode ?? null);
  const [activeModal, setActiveModal] = useState<'start' | 'finish' | null>(null);
  const prevPhaseRef = useRef<CountdownPhase | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setPhase(contest?.statusCode ?? null);
    if (contest && !isLoadedOnce) {
      setIsLoadedOnce(true);
    }
  }, [contest, isLoadedOnce]);

  const startDate = contest?.startTime;
  const finishDate = contest?.finishTime;

  const safePhase = phase ?? ContestStatus.NotStarted;

  const targetDate = useMemo(() => {
    if (safePhase === ContestStatus.Already) return finishDate;
    if (safePhase === ContestStatus.NotStarted) return startDate;
    return null;
  }, [finishDate, safePhase, startDate]);

  const diffMs = targetDate ? Math.max(getDateTimeValue(targetDate) - now, 0) : 0;
  const { hours: totalHours, minutes, seconds } = getCountdownParts(diffMs);

  useEffect(() => {
    if (!targetDate || phase === null) return;

    if (diffMs <= 0) {
      if (safePhase === ContestStatus.NotStarted) {
        setPhase(ContestStatus.Already);
      } else if (safePhase === ContestStatus.Already) {
        setPhase(ContestStatus.Finished);
      }
    }
  }, [diffMs, phase, safePhase, targetDate]);

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

  const statusChip = useMemo(() => {
    if (!contest) {
      return {
        label: t('contests.countdownCard.starts'),
        color: 'warning' as const,
      };
    }

    if (safePhase === ContestStatus.Finished) {
      return {
        label: t('contests.countdownCard.finished'),
        color: 'default' as const,
      };
    }

    if (safePhase === ContestStatus.NotStarted) {
      return {
        label: t('contests.countdownCard.starts'),
        color: 'warning' as const,
      };
    }

    return {
      label: t('contests.countdownCard.ends'),
      color: 'success' as const,
    };
  }, [contest, safePhase, t]);

  const tiles = [
    { value: String(totalHours).padStart(2, '0'), label: t('contests.timeLabels.hour') },
    { value: String(minutes).padStart(2, '0'), label: t('contests.timeLabels.minute') },
    { value: String(seconds).padStart(2, '0'), label: t('contests.timeLabels.second') },
  ];

  const helperLabel = useMemo(() => {
    if (safePhase === ContestStatus.NotStarted && startDate) {
      return t('contests.startsLabel', { date: formatDateTime(startDate, 'compactDateTime') });
    }
    if (finishDate) {
      return t(
        safePhase === ContestStatus.Finished
          ? 'contests.countdownCard.finishedAt'
          : 'contests.endsLabel',
        {
          date: formatDateTime(finishDate, 'compactDateTime'),
        },
      );
    }
    return null;
  }, [finishDate, safePhase, startDate, t]);

  useEffect(() => {
    initializedRef.current = false;
    prevPhaseRef.current = null;
    setActiveModal(null);
  }, [contest?.id]);

  const problemsLink =
    contest?.id != null
      ? getResourceByParams(resources.ContestProblems, { id: contest.id })
      : resources.Contests;
  const standingsLink =
    contest?.id != null
      ? getResourceByParams(resources.ContestStandings, { id: contest.id })
      : resources.Contests;

  const showSkeleton = isLoading || (!contest && !isLoadedOnce);

  return (
    <>
      <Card variant="section">
        <CardContent>
          {showSkeleton ? (
            <Stack spacing={2}>
              <Skeleton width="60%" height={28} />
              <Skeleton variant="rectangular" height={85} />
            </Stack>
          ) : (
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="timer" fontSize={20} sx={{ color: 'primary.main' }} />
                <Typography variant="label" component="h2">
                  {statusChip.label}
                </Typography>
              </Stack>
              {safePhase === ContestStatus.Finished ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {helperLabel}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={standingsLink}
                    variant="outlined"
                    endIcon={<KepIcon name="ranking" />}
                  >
                    {t('contests.tabs.standings')}
                  </Button>
                </>
              ) : (
                <>
                  <Stack direction="row" gap={1}>
                    {tiles.map((item) => (
                      <CountdownTile key={item.label} value={item.value} label={item.label} />
                    ))}
                  </Stack>
                  {helperLabel && (
                    <Typography variant="body2" color="text.secondary">
                      {helperLabel}
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(activeModal && contest)}
        onClose={() => setActiveModal(null)}
        aria-labelledby="contest-countdown-dialog-title"
      >
        <DialogHeader
          id="contest-countdown-dialog-title"
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
              onClick={() => setActiveModal(null)}
              component={RouterLink}
              to={problemsLink}
            >
              {t('contests.tabs.problems')}
            </Button>
          ) : null}
          {activeModal === 'finish' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setActiveModal(null)}
              component={RouterLink}
              to={standingsLink}
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

export default ContestCountdownCard;
