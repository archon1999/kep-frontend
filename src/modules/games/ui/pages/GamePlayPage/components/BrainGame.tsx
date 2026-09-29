import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import {
  type BrainAnswer,
  type BrainChallenge,
  type BrainGameId,
  brainLevel,
  brainNumericAnswerMatches,
  brainScore,
  createBrainChallenge,
} from 'modules/games/domain/mini-games/brain-games';
import BrainChallengeBoard from 'modules/games/ui/shared/components/BrainChallengeBoard';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import type { MiniGameProps } from './types';
import GameFrame from './GameFrame';
import MiniGameCompletion from './MiniGameCompletion';
import MiniGameIntro from './MiniGameIntro';

type Phase = 'intro' | 'playing' | 'won' | 'failed' | 'done';
type Session = { challenge: BrainChallenge; round: number; mistakes: number; previewEnds: number };

const BrainGame = ({ id, best, onScore, audio }: MiniGameProps & { id: BrainGameId }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('intro');
  const phaseRef = useRef<Phase>('intro');
  const [level, setLevel] = useState(1);
  const [cleared, setCleared] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const deadlineRef = useRef(0);
  const [remaining, setRemaining] = useState(0);
  const [notice, setNotice] = useState<'wrong' | 'timeUp' | null>(null);
  const config = brainLevel(id, level);
  const score = brainScore(cleared);

  const changePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const updateSession = (next: Session) => {
    sessionRef.current = next;
    setSession(next);
  };

  const beginLevel = (nextLevel: number) => {
    const nextConfig = brainLevel(id, nextLevel);
    const now = Date.now();
    audio.startFromGesture();
    setLevel(nextLevel);
    setNotice(null);
    deadlineRef.current = now + nextConfig.seconds * 1000;
    setRemaining(nextConfig.seconds);
    updateSession({
      challenge: createBrainChallenge(id, nextLevel),
      round: 0,
      mistakes: 0,
      previewEnds: now + nextConfig.previewMs,
    });
    changePhase('playing');
  };

  const start = () => {
    setCleared(0);
    beginLevel(1);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds === 0 && phaseRef.current === 'playing') {
        phaseRef.current = 'failed';
        setPhase('failed');
        setNotice('timeUp');
        audio.playCue('wrong');
        audio.stop();
      }
      const current = sessionRef.current;
      if (
        current?.challenge.puzzle.kind === 'memory-matrix' &&
        current.challenge.puzzle.phase === 'watch' &&
        Date.now() >= current.previewEnds
      ) {
        const next: Session = {
          ...current,
          challenge: {
            ...current.challenge,
            puzzle: { ...current.challenge.puzzle, phase: 'recall', highlighted: undefined },
          },
        };
        sessionRef.current = next;
        setSession(next);
      }
    };
    const interval = window.setInterval(tick, 100);
    return () => window.clearInterval(interval);
  }, [phase, audio.playCue, audio.stop]);

  const onAnswer = (answer: BrainAnswer) => {
    const current = sessionRef.current;
    if (!current || phaseRef.current !== 'playing' || Date.now() >= deadlineRef.current) return;
    const { puzzle, solution } = current.challenge;
    let correct = false;
    let roundComplete = true;
    let nextChallenge = current.challenge;
    if (puzzle.kind === 'math-compare') correct = answer.choice === solution;
    else if (puzzle.kind === 'quick-math' || puzzle.kind === 'number-sequence')
      correct = typeof solution === 'number' && brainNumericAnswerMatches(answer.value, solution);
    else if (puzzle.kind === 'number-hunt') {
      correct = answer.cell !== undefined && puzzle.cells[answer.cell] === puzzle.next;
      roundComplete = puzzle.next === puzzle.cells.length;
      if (correct)
        nextChallenge = { ...current.challenge, puzzle: { ...puzzle, next: puzzle.next + 1 } };
    } else {
      if (
        puzzle.phase === 'watch' ||
        answer.cell === undefined ||
        puzzle.selected.includes(answer.cell)
      )
        return;
      correct = Array.isArray(solution) && solution.includes(answer.cell);
      roundComplete = puzzle.selected.length + 1 === puzzle.targetCount;
      if (correct)
        nextChallenge = {
          ...current.challenge,
          puzzle: { ...puzzle, selected: [...puzzle.selected, answer.cell] },
        };
    }

    if (!correct) {
      audio.playCue('wrong');
      setNotice('wrong');
      const mistakes = current.mistakes + 1;
      updateSession({ ...current, mistakes });
      if (mistakes >= config.mistakes) {
        changePhase('failed');
        audio.stop();
      }
      return;
    }

    setNotice(null);
    if (!roundComplete) {
      audio.playCue('cell', answer.cell);
      updateSession({ ...current, challenge: nextChallenge });
      return;
    }
    audio.playCue('correct');
    const nextRound = current.round + 1;
    if (nextRound === config.rounds) {
      setCleared(level);
      onScore(brainScore(level));
      updateSession({ ...current, challenge: nextChallenge, round: nextRound });
      if (level === 10) {
        changePhase('done');
        audio.playCue('complete');
        audio.stop();
      } else changePhase('won');
    } else {
      updateSession({
        ...current,
        challenge: createBrainChallenge(id, level),
        round: nextRound,
        previewEnds: Date.now() + config.previewMs,
      });
    }
  };

  return (
    <GameFrame best={best} score={score} progress={cleared * 10} showStatus={phase !== 'intro'}>
      {phase === 'intro' ? (
        <MiniGameIntro
          id={id}
          title={t(`games.catalog.${id}.title`)}
          description={t(`gamesMinis.brain.instructions.${id}`)}
          action={t('gamesMinis.common.start')}
          onStart={start}
        />
      ) : phase === 'done' ? (
        <MiniGameCompletion
          score={score}
          best={best}
          title={t('gamesMinis.brain.finished')}
          detail={t('gamesMinis.brain.finishedDetail')}
          onReplay={start}
        />
      ) : (
        <Stack spacing={2.5} sx={{ maxWidth: 720, mx: 'auto', py: { xs: 1, sm: 2 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontSize: 17, fontWeight: 650 }}>
                {t('gamesMinis.common.round', { current: level, total: 10 })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('gamesMinis.brain.rounds', {
                  current: Math.min((session?.round ?? 0) + 1, config.rounds),
                  total: config.rounds,
                })}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              gap={0.75}
              sx={{ color: remaining <= 10 ? 'warning.main' : 'text.secondary' }}
            >
              <IconifyIcon icon="mdi:timer-outline" width={20} />
              <Typography
                sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                aria-label={t('gamesMinis.brain.secondsLeft', { seconds: remaining })}
              >
                {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
              </Typography>
            </Stack>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(remaining / config.seconds) * 100}
            color={remaining <= 10 ? 'warning' : 'primary'}
            aria-label={t('gamesMinis.brain.timeRemaining')}
            sx={{ height: 3, bgcolor: 'action.hover' }}
          />
          {phase === 'playing' && session && (
            <BrainChallengeBoard
              key={`${id}:${level}:${session.round}`}
              puzzle={session.challenge.puzzle}
              onAnswer={onAnswer}
            />
          )}
          {phase === 'playing' && (
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
              <Typography
                role="status"
                variant="body2"
                color={notice ? 'warning.main' : 'text.secondary'}
              >
                {notice ? t('gamesMinis.brain.wrong') : t('gamesMinis.brain.levelReward')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                {t('gamesMinis.brain.lives', { count: config.mistakes - (session?.mistakes ?? 0) })}
              </Typography>
            </Stack>
          )}
          {(phase === 'failed' || phase === 'won') && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <IconifyIcon
                icon={phase === 'won' ? 'mdi:check-circle-outline' : 'mdi:refresh'}
                width={38}
                sx={{ color: phase === 'won' ? 'success.main' : 'text.secondary', mb: 1.5 }}
              />
              <Typography component="h2" sx={{ fontSize: 23, fontWeight: 650 }}>
                {t(
                  phase === 'won'
                    ? 'gamesMinis.brain.levelCleared'
                    : 'gamesMinis.brain.tryLevelAgain',
                )}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 3, fontSize: 14 }}>
                {t(
                  phase === 'won'
                    ? 'gamesMinis.brain.earned'
                    : notice === 'timeUp'
                      ? 'gamesMinis.brain.timeUp'
                      : 'gamesMinis.brain.noLives',
                )}
              </Typography>
              <Button
                variant="contained"
                onClick={() => beginLevel(phase === 'won' ? level + 1 : level)}
                sx={{ boxShadow: 'none' }}
              >
                {t(phase === 'won' ? 'gamesMinis.common.next' : 'gamesMinis.brain.retryLevel')}
              </Button>
            </Box>
          )}
          {phase === 'failed' && score > 0 && (
            <Alert severity="info" sx={{ bgcolor: 'background.elevation1' }}>
              {t('gamesMinis.brain.savedScore', { score })}
            </Alert>
          )}
        </Stack>
      )}
    </GameFrame>
  );
};

export default BrainGame;
