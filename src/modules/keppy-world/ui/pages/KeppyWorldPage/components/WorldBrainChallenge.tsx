import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, LinearProgress, Stack, Typography } from '@mui/material';
import type { BrainAnswer } from 'modules/games/domain/mini-games/brain-games';
import BrainChallengeBoard from 'modules/games/ui/shared/components/BrainChallengeBoard';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import type { WorldBrainChallenge as Challenge, WorldResult } from '../../../../domain';

type Props = {
  challenge: Challenge;
  pending: boolean;
  submit: (answer: unknown) => Promise<WorldResult | undefined>;
};

export default function WorldBrainChallenge({ challenge, pending, submit }: Props) {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now);
  const [paused, setPaused] = useState(false);
  const watching = challenge.kind === 'memory-matrix' && challenge.phase === 'watch';
  const revealUntil =
    challenge.kind === 'memory-matrix' && challenge.revealUntil
      ? Date.parse(challenge.revealUntil)
      : null;
  const deadline = challenge.deadlineAt ? Date.parse(challenge.deadlineAt) : null;
  const nextAt = watching ? revealUntil : deadline;
  const revealFinished = watching && revealUntil !== null && now >= revealUntil;
  const timedOut = deadline !== null && now >= deadline;
  const seconds = nextAt === null ? null : Math.max(0, Math.ceil((nextAt - now) / 1000));

  useEffect(() => {
    setPaused(false);
    setNow(Date.now());
  }, [challenge.roundId]);

  useEffect(() => {
    if (nextAt === null) return;
    const timer = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(timer);
  }, [nextAt]);

  const synchronize = useCallback(async () => {
    const result = await submit({
      roundId: challenge.roundId,
      action: watching ? 'observe' : 'timeout',
    });
    setPaused(!result);
  }, [challenge.roundId, watching, submit]);

  useEffect(() => {
    if (nextAt === null || pending || paused) return;
    // Let the server change phase and discard the reveal; the client never keeps an answer key.
    const timer = window.setTimeout(
      () => void synchronize(),
      Math.max(250, nextAt - Date.now() + 80),
    );
    return () => window.clearTimeout(timer);
  }, [challenge, nextAt, pending, paused, synchronize]);

  const answer = (value: BrainAnswer) => {
    const index =
      challenge.kind === 'number-hunt'
        ? challenge.next
        : challenge.kind === 'memory-matrix'
          ? challenge.selected.length
          : undefined;
    void submit({
      ...value,
      roundId: challenge.roundId,
      ...(index === undefined ? {} : { index }),
    });
  };
  const puzzle =
    challenge.kind === 'memory-matrix' && revealFinished
      ? { ...challenge, highlighted: [] }
      : challenge;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Typography variant="body2" color="text.secondary">
          {t('keppyWorld.brainRound', { current: challenge.round, total: challenge.totalRounds })}
        </Typography>
        {seconds !== null && (
          <Typography
            variant="body2"
            color={!watching && seconds <= 5 ? 'warning.main' : 'text.secondary'}
            aria-label={t(watching ? 'keppyWorld.brainWatchTime' : 'keppyWorld.brainTimeLeft', {
              seconds,
            })}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <IconifyIcon icon={watching ? 'mdi:eye-outline' : 'mdi:timer-outline'} width={18} />
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
          </Typography>
        )}
      </Stack>
      <LinearProgress
        variant="determinate"
        value={(100 * (challenge.round - 1)) / challenge.totalRounds}
        aria-label={t('keppyWorld.brainRound', {
          current: challenge.round,
          total: challenge.totalRounds,
        })}
        sx={{ height: 4, borderRadius: 2 }}
      />
      <BrainChallengeBoard
        key={challenge.roundId}
        puzzle={puzzle}
        disabled={pending || paused || timedOut || revealFinished}
        onAnswer={answer}
      />
      {paused && (
        <Button onClick={() => void synchronize()} disabled={pending}>
          {t('keppyWorld.retry')}
        </Button>
      )}
    </Stack>
  );
}
