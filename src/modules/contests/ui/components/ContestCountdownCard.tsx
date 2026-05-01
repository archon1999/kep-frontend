import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Link as RouterLink } from 'react-router-dom';
import { getResourceByParams, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { ContestDetail } from '../../domain/entities/contest-detail.entity';
import { ContestStatus } from '../../domain/entities/contest-status';

dayjs.extend(duration);

interface ContestCountdownCardProps {
  contest?: ContestDetail | null;
  isLoading?: boolean;
}

type CountdownPhase = ContestStatus.NotStarted | ContestStatus.Already | ContestStatus.Finished;

const CountdownTile = ({ value, label }: { value: string; label: string }) => (
  <Stack
    spacing={0.5}
    alignItems="center"
    sx={(theme) => ({
      px: 2,
      py: 1.5,
      minWidth: 72,
      borderRadius: 2,
      background: theme.palette.background.paper,
      boxShadow: `0 10px 40px ${theme.palette.common.black}0a`,
      color: theme.palette.text.primary,
    })}
  >
    <Typography variant="h4" fontWeight={800}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
      {label}
    </Typography>
  </Stack>
);

const ContestCountdownCard = ({ contest, isLoading = false }: ContestCountdownCardProps) => {
  const { t } = useTranslation();
  const [isLoadedOnce, setIsLoadedOnce] = useState(Boolean(contest));
  const [now, setNow] = useState(dayjs());
  const [phase, setPhase] = useState<CountdownPhase | null>(contest?.statusCode ?? null);
  const [activeModal, setActiveModal] = useState<'start' | 'finish' | null>(null);
  const prevPhaseRef = useRef<CountdownPhase | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setPhase(contest?.statusCode ?? null);
    if (contest && !isLoadedOnce) {
      setIsLoadedOnce(true);
    }
  }, [contest?.id, contest?.statusCode, contest?.startTime, contest?.finishTime]);

  const startDate = contest?.startTime ? dayjs(contest.startTime) : null;
  const finishDate = contest?.finishTime ? dayjs(contest.finishTime) : null;

  const safePhase = phase ?? ContestStatus.NotStarted;

  const targetDate = useMemo(() => {
    if (safePhase === ContestStatus.Already) return finishDate;
    if (safePhase === ContestStatus.NotStarted) return startDate;
    return null;
  }, [finishDate, safePhase, startDate]);

  const diffMs = targetDate ? Math.max(targetDate.diff(now), 0) : 0;
  const time = dayjs.duration(diffMs);
  const totalHours = Math.floor(time.asHours());
  const minutes = time.minutes();
  const seconds = time.seconds();

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
      return t('contests.startsLabel', { date: startDate.format('DD MMM, HH:mm') });
    }
    if (finishDate) {
      return t('contests.countdownCard.finishedAt', { date: finishDate.format('DD MMM, HH:mm') });
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
      <Card
        variant="outlined"
        sx={(theme) => ({
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          color: theme.palette.text.primary,
          background: `linear-gradient(150deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
          borderColor: alpha(theme.palette.primary.main, 0.16),
        })}
      >
        {contest?.logo ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              // backgroundImage: `url(${contest.logo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.08,
              filter: 'blur(1px)',
            }}
          />
        ) : null}
        <Box
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
          })}
        />
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          {showSkeleton ? (
            <Stack spacing={2}>
              <Skeleton variant="rounded" width={140} height={36} sx={{ mx: 'auto' }} />
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
                useFlexGap
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" width={96} height={82} />
                ))}
              </Stack>
              <Skeleton variant="text" width="70%" sx={{ mx: 'auto' }} />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack direction="column" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<KepIcon name="timer" fontSize={16} />}
                  label={statusChip.label}
                  color={statusChip.color}
                  variant="filled"
                  sx={{
                    color: statusChip.color === 'default' ? 'text.primary' : '#fff',
                    backgroundColor: statusChip.color === 'default' ? 'background.paper' : undefined,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
                useFlexGap
              >
                {tiles.map((item) => (
                  <CountdownTile key={item.label} value={item.value} label={item.label} />
                ))}
              </Stack>

              {helperLabel ? (
                <Typography align="center" variant="caption" fontWeight={500}>
                  {helperLabel}
                </Typography>
              ) : null}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(activeModal && contest)}
        onClose={() => setActiveModal(null)}
        aria-labelledby="contest-countdown-dialog-title"
      >
        <DialogTitle id="contest-countdown-dialog-title">
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
