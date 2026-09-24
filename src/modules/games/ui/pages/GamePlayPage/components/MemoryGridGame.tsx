import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Typography } from '@mui/material';
import {
  MEMORY_ROUND_LENGTHS,
  createMemorySequence,
  memoryGridScore,
  memoryGridSide,
  memoryPreviewTiming,
} from 'modules/games/domain/mini-games/memory-grid';
import GameFrame from './GameFrame.tsx';
import MiniGameCompletion from './MiniGameCompletion.tsx';
import MiniGameIntro from './MiniGameIntro.tsx';
import type { MiniGameProps } from './types.ts';

type Phase = 'intro' | 'preview' | 'input' | 'roundWon' | 'done';
const MAX_MISTAKES = 2;

const MemoryGridGame = ({ best, onScore, audio }: MiniGameProps) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [cursor, setCursor] = useState(0);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [previewStep, setPreviewStep] = useState(0);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [replays, setReplays] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [lastMistake, setLastMistake] = useState(false);
  const score = memoryGridScore(cleared, replays);
  const gridSide = memoryGridSide(round);

  useEffect(() => {
    if (phase !== 'preview') return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    setActiveCell(null);
    setPreviewStep(0);
    const { interval, flash } = memoryPreviewTiming(round);
    sequence.forEach((cell, index) => {
      const at = 450 + index * interval;
      timers.push(
        setTimeout(() => {
          setActiveCell(cell);
          setPreviewStep(index + 1);
          audio.playCue('cell', cell);
        }, at),
      );
      timers.push(setTimeout(() => setActiveCell(null), at + flash));
    });
    timers.push(setTimeout(() => setPhase('input'), 450 + sequence.length * interval));
    return () => timers.forEach(clearTimeout);
  }, [phase, previewVersion, sequence, round, audio.playCue]);

  useEffect(() => {
    audio.setMusicDucked(phase === 'preview');
    return () => audio.setMusicDucked(false);
  }, [phase, audio.setMusicDucked]);

  const start = () => {
    audio.startFromGesture();
    setRound(0);
    setSequence(createMemorySequence(MEMORY_ROUND_LENGTHS[0], Math.random, memoryGridSide(0)));
    setCursor(0);
    setActiveCell(null);
    setReplays(0);
    setMistakes(0);
    setCleared(0);
    setLastMistake(false);
    setPreviewVersion((value) => value + 1);
    setPhase('preview');
  };

  const showAgain = () => {
    if (phase !== 'input') return;
    setReplays((value) => value + 1);
    setCursor(0);
    setPreviewVersion((value) => value + 1);
    setPhase('preview');
  };

  const chooseCell = (cell: number) => {
    if (phase !== 'input') return;
    if (cell !== sequence[cursor]) {
      audio.playCue('wrong');
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      setLastMistake(true);
      setCursor(0);
      if (nextMistakes >= MAX_MISTAKES) {
        audio.stop();
        setPhase('done');
        onScore(memoryGridScore(cleared, replays));
      } else {
        setPreviewVersion((value) => value + 1);
        setPhase('preview');
      }
      return;
    }
    audio.playCue('cell', cell);
    if (cursor + 1 < sequence.length) {
      setCursor((value) => value + 1);
      return;
    }
    const nextCleared = round + 1;
    setCleared(nextCleared);
    setLastMistake(false);
    if (nextCleared === MEMORY_ROUND_LENGTHS.length) {
      audio.stop();
      audio.playCue('complete');
      setPhase('done');
      onScore(memoryGridScore(nextCleared, replays));
    } else {
      audio.playCue('correct');
      setPhase('roundWon');
    }
  };

  const nextRound = () => {
    const next = round + 1;
    setRound(next);
    setSequence(
      createMemorySequence(MEMORY_ROUND_LENGTHS[next], Math.random, memoryGridSide(next)),
    );
    setCursor(0);
    setLastMistake(false);
    setPreviewVersion((value) => value + 1);
    setPhase('preview');
  };

  return (
    <GameFrame
      showStatus={false}
      best={best}
      score={score}
      progress={
        phase === 'done' && cleared === MEMORY_ROUND_LENGTHS.length
          ? 100
          : (cleared / MEMORY_ROUND_LENGTHS.length) * 100
      }
    >
      {phase === 'intro' ? (
        <MiniGameIntro
          id="memory-grid"
          title={t('gamesMinis.memoryGrid.readyTitle')}
          description={t('gamesMinis.memoryGrid.instructions')}
          action={t('gamesMinis.common.start')}
          onStart={start}
        />
      ) : phase === 'done' ? (
        <MiniGameCompletion
          score={score}
          best={best}
          title={t(
            cleared === MEMORY_ROUND_LENGTHS.length
              ? 'gamesMinis.memoryGrid.winTitle'
              : 'gamesMinis.memoryGrid.doneTitle',
          )}
          detail={t('gamesMinis.memoryGrid.doneDetail', {
            cleared,
            total: MEMORY_ROUND_LENGTHS.length,
          })}
          onReplay={start}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: 550,
            mx: 'auto',
            pt: { xs: 1, md: 1.5 },
            pb: 3,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gridTemplateAreas: '"status" "board" "actions"',
            rowGap: 1.5,
            alignItems: 'start',
          }}
        >
          <Box sx={{ gridArea: 'status' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 12, fontWeight: 600 }}
                >
                  {t('gamesMinis.common.round', {
                    current: round + 1,
                    total: MEMORY_ROUND_LENGTHS.length,
                  })}
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: 17, sm: 19 },
                    fontWeight: 600,
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t(
                    phase === 'preview'
                      ? 'gamesMinis.memoryGrid.watch'
                      : phase === 'input'
                        ? 'gamesMinis.memoryGrid.repeat'
                        : 'gamesMinis.memoryGrid.roundWon',
                  )}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 15, sm: 16 },
                    fontWeight: 600,
                    lineHeight: 1.35,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {t('gamesMinis.common.score', { score })}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 11.5, fontVariantNumeric: 'tabular-nums' }}
                >
                  {t('gamesMinis.common.best', { best })}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                {t('gamesMinis.memoryGrid.sequenceLength', { count: sequence.length })}
              </Typography>
              <Typography
                variant="body2"
                color={mistakes ? 'warning.main' : 'text.secondary'}
                sx={{ fontSize: 13 }}
              >
                {t('gamesMinis.memoryGrid.lives', { count: MAX_MISTAKES - mistakes })}
              </Typography>
            </Stack>
            {lastMistake && phase === 'preview' && (
              <Typography variant="body2" color="warning.main" role="status" sx={{ mt: 1.5 }}>
                {t('gamesMinis.memoryGrid.mistake')}
              </Typography>
            )}
          </Box>
          <Box sx={{ gridArea: 'board', width: '100%', minWidth: 0 }}>
            <Box
              role="group"
              aria-label={t('gamesMinis.memoryGrid.gridLabel', { side: gridSide })}
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSide}, minmax(0, 1fr))`,
                gap: { xs: 0.5, sm: 0.75 },
                width: '100%',
                p: { xs: 0.75, sm: 1 },
                bgcolor: '#19344e',
                borderRadius: 2,
              }}
            >
              {Array.from({ length: gridSide * gridSide }, (_, cell) => (
                <Button
                  key={cell}
                  type="button"
                  variant="text"
                  aria-label={t('gamesMinis.memoryGrid.cellLabel', { cell: cell + 1 })}
                  aria-disabled={phase !== 'input'}
                  aria-pressed={activeCell === cell}
                  tabIndex={phase === 'input' ? 0 : -1}
                  onClick={() => chooseCell(cell)}
                  sx={(theme) => ({
                    minWidth: 0,
                    aspectRatio: 1,
                    fontSize: { xs: 15, sm: 18 },
                    fontWeight: 650,
                    borderRadius: 0.75,
                    border: 0,
                    color: activeCell === cell ? '#102638' : '#e6f2ff',
                    bgcolor: activeCell === cell ? '#8be4d1' : '#2b4c68',
                    boxShadow: 'none',
                    transition: 'background-color 120ms ease, transform 120ms ease',
                    transform: activeCell === cell ? 'scale(0.94)' : 'none',
                    '&:hover':
                      phase === 'input' && activeCell !== cell ? { bgcolor: '#386486' } : {},
                    '&:focus-visible': {
                      outline: `3px solid ${theme.vars.palette.primary.main}`,
                      outlineOffset: 2,
                    },
                  })}
                >
                  {cell + 1}
                </Button>
              ))}
            </Box>
            <Stack direction="row" spacing={0.75} sx={{ width: '100%', mt: 2 }}>
              {sequence.map((_, step) => (
                <Box
                  key={step}
                  sx={{
                    flex: 1,
                    height: 4,
                    borderRadius: 1,
                    bgcolor:
                      step <
                      (phase === 'preview'
                        ? previewStep
                        : phase === 'roundWon'
                          ? sequence.length
                          : cursor)
                        ? 'primary.main'
                        : 'divider',
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Box sx={{ gridArea: 'actions', minWidth: 0 }}>
            {phase === 'input' && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                flexWrap="wrap"
              >
                <Typography variant="body2" fontWeight={700}>
                  {t('gamesMinis.memoryGrid.steps', { count: cursor, total: sequence.length })}
                </Typography>
                <Button size="small" onClick={showAgain}>
                  {t('gamesMinis.memoryGrid.replay')}
                </Button>
              </Stack>
            )}
            {phase === 'roundWon' && (
              <Button
                variant="contained"
                onClick={nextRound}
                sx={{ width: { xs: '100%', md: 'auto' } }}
              >
                {t('gamesMinis.common.next')}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </GameFrame>
  );
};

export default MemoryGridGame;
