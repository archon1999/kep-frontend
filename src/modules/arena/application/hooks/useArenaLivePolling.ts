import { useEffect, useRef } from 'react';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

interface UseArenaLivePollingProps {
  arena?: Arena;
  nextChallengeId?: number;
  onAutoOpenChallenge: (challengeId: number) => void;
  onStatusTransition: (status: ArenaStatus) => void;
  onRefreshTick?: () => void;
}

export const useArenaLivePolling = ({
  arena,
  nextChallengeId,
  onAutoOpenChallenge,
  onStatusTransition,
  onRefreshTick,
}: UseArenaLivePollingProps) => {
  const previousStatusRef = useRef<ArenaStatus | undefined>(arena?.status);
  const openedChallengeRef = useRef<number | undefined>();

  useEffect(() => {
    if (arena?.status == null) return;

    if (previousStatusRef.current != null && previousStatusRef.current !== arena.status) {
      onStatusTransition(arena.status);
    }

    previousStatusRef.current = arena.status;
  }, [arena?.status, onStatusTransition]);

  useEffect(() => {
    if (arena?.status !== ArenaStatus.Already || !nextChallengeId) return;
    if (openedChallengeRef.current === nextChallengeId) return;

    openedChallengeRef.current = nextChallengeId;
    onAutoOpenChallenge(nextChallengeId);
  }, [arena?.status, nextChallengeId, onAutoOpenChallenge]);

  useEffect(() => {
    if (!onRefreshTick || arena?.status === ArenaStatus.NotStarted) return;

    const timer = window.setInterval(() => {
      onRefreshTick();
    }, 30000);

    return () => window.clearInterval(timer);
  }, [arena?.status, onRefreshTick]);
};
