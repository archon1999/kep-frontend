import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useContestReplay } from 'modules/contests/application/queries';
import type { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import type { ContestTypeInfo } from 'modules/contests/domain/entities/contest.entity';
import {
  findReplayFrame,
  formatReplayTime,
  replayTime,
} from 'modules/contests/domain/utils/contestReplay';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ReplayStandings from '../components/ReplayStandings';

interface Props {
  contestId: number;
  title: string;
  contestType: string;
  typeInfo?: ContestTypeInfo | null;
  problemDetails: ContestProblemEntity[];
  showPenalties: boolean;
  onClose: () => void;
}

export default function ContestReplayDialog({
  contestId,
  title,
  contestType,
  typeInfo,
  problemDetails,
  showPenalties,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const mobile = useMediaQuery('(max-width:600px)');
  const { data, error, isLoading, mutate } = useContestReplay(contestId);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [minutes, setMinutes] = useState(2);
  const [limit, setLimit] = useState(10);
  const timeRef = useRef(time);
  timeRef.current = time;
  const duration = data?.durationSeconds ?? 0;

  useEffect(() => {
    if (!playing || duration <= 0) return;
    const started = performance.now();
    const startTime = timeRef.current;
    let handle = 0;
    let lastPaint = 0;
    const tick = (now: number) => {
      const next = replayTime(startTime, now - started, duration, minutes);
      if (now - lastPaint >= 33 || next >= duration) {
        timeRef.current = next;
        setTime(next);
        lastPaint = now;
      }
      if (next >= duration) setPlaying(false);
      else handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    const pauseWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => {
      cancelAnimationFrame(handle);
      document.removeEventListener('visibilitychange', pauseWhenHidden);
    };
  }, [playing, minutes, duration]);

  const frameIndex = data ? findReplayFrame(data.frames, time) : -1;
  const rows = useMemo(
    () => data?.frames[frameIndex]?.rows.slice(0, limit) ?? [],
    [data, frameIndex, limit],
  );
  const seek = (next: number) => {
    setAnimateRows(false);
    setPlaying(false);
    timeRef.current = next;
    setTime(next);
  };
  const togglePlay = () => {
    setAnimateRows(true);
    if (time >= duration) {
      timeRef.current = 0;
      setTime(0);
    }
    setPlaying((value) => !value);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={mobile}
      aria-labelledby="contest-replay-title"
    >
      <DialogTitle
        component="div"
        id="contest-replay-title"
        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6">{t('contests.replay.title')}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label={t('contests.replay.close')}>
          <IconifyIcon icon="mdi:close" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1.5, sm: 3 }, pb: 3, overflowX: 'hidden' }}>
        {isLoading ? (
          <Stack alignItems="center" gap={2} sx={{ py: 8 }}>
            <CircularProgress />
            <Typography>{t('contests.replay.loading')}</Typography>
          </Stack>
        ) : error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void mutate()}>{t('contests.replay.retry')}</Button>}
          >
            {t('contests.replay.error')}
          </Alert>
        ) : !data?.available ? (
          <Alert severity="info">{t('contests.replay.unavailable')}</Alert>
        ) : !data.participantsCount ? (
          <Alert severity="info">{t('contests.replay.empty')}</Alert>
        ) : (
          <Stack gap={2.5} sx={{ mt: 1.5 }}>
            <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
              <Stack direction="row" gap={1} alignItems="center">
                <Button
                  variant="contained"
                  onClick={togglePlay}
                  disabled={duration <= 0}
                  startIcon={<IconifyIcon icon={playing ? 'mdi:pause' : 'mdi:play'} />}
                >
                  {t(playing ? 'contests.replay.pause' : 'contests.replay.play')}
                </Button>
                <Button onClick={() => seek(0)} startIcon={<IconifyIcon icon="mdi:restart" />}>
                  {t('contests.replay.restart')}
                </Button>
              </Stack>
              <Stack direction="row" gap={1} sx={{ ml: 'auto' }}>
                <TextField
                  select
                  size="small"
                  label={t('contests.replay.duration')}
                  value={minutes}
                  onChange={(event) => setMinutes(Number(event.target.value))}
                  sx={{ minWidth: 130 }}
                >
                  {[1, 2, 3].map((value) => (
                    <MenuItem key={value} value={value}>
                      {t('contests.replay.minutes', { count: value })}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label={t('contests.replay.visible')}
                  value={limit}
                  onChange={(event) => setLimit(Number(event.target.value))}
                  sx={{ minWidth: 110 }}
                >
                  {[10, 20].map((value) => (
                    <MenuItem key={value} value={value}>
                      {t('contests.replay.top', { count: value })}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
            <Box sx={{ px: 1 }}>
              <Stack direction="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">{t('contests.replay.contestTime')}</Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                  data-testid="replay-clock"
                >
                  {formatReplayTime(time)} / {formatReplayTime(duration)}
                </Typography>
              </Stack>
              <Slider
                sx={{ '& .MuiSlider-thumb, & .MuiSlider-track': { transition: 'none' } }}
                min={0}
                max={duration || 1}
                step={1}
                value={time}
                onChange={(_, value) => seek(value as number)}
                disabled={duration <= 0}
                aria-label={t('contests.replay.contestTime')}
                getAriaValueText={formatReplayTime}
              />
            </Box>
            <ReplayStandings
              rows={rows}
              problems={data.problems}
              contestType={contestType}
              typeInfo={typeInfo}
              problemDetails={problemDetails}
              showPenalties={showPenalties}
              animate={animateRows}
            />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
