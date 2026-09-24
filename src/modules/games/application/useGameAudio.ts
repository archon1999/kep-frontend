import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { GameId } from '../domain/entities/games.types';
import { type GameCue, playGameCue } from './gameAudioCues';
import { GameAudioPlayer, gameMusic } from './gameAudioPlayer';

const MUTE_KEY = 'games:audio-muted';
const OLD_WORLD_MUTE_KEY = 'keppy-world:music-muted';
const MUTE_EVENT = 'games:audio-muted-changed';
let memoryMuted: boolean | null = null;

const storedMuted = () => {
  if (typeof window === 'undefined') return false;
  try {
    const current = window.localStorage.getItem(MUTE_KEY);
    if (current !== null) return current === '1';
    if (memoryMuted !== null) return memoryMuted;
    return window.localStorage.getItem(OLD_WORLD_MUTE_KEY) === '1';
  } catch {
    return memoryMuted ?? false;
  }
};

const subscribeMuted = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === MUTE_KEY || event.key === OLD_WORLD_MUTE_KEY) onChange();
  };
  window.addEventListener(MUTE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(MUTE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
};

/** Music and quiet synthesized cues shared by the five games. */
export const useGameAudio = (gameId: GameId | null, controlledActive?: boolean) => {
  const playerRef = useRef<GameAudioPlayer | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const muted = useSyncExternalStore(subscribeMuted, storedMuted, () => false);
  const [session, setSession] = useState<{ gameId: GameId | null; active: boolean }>({
    gameId: null,
    active: false,
  });
  const active =
    gameId !== null && (controlledActive ?? (session.gameId === gameId && session.active));

  useEffect(() => {
    const player = gameId
      ? new GameAudioPlayer(gameMusic[gameId], gameId === 'keppy-world' ? 0.18 : 0.11)
      : null;
    playerRef.current = player;
    return () => {
      if (playerRef.current === player) playerRef.current = null;
      player?.destroy();
    };
  }, [gameId]);

  useEffect(() => {
    if (active && !muted && !document.hidden) playerRef.current?.start();
    else playerRef.current?.pause();
  }, [active, muted, gameId]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) playerRef.current?.pause();
      else if (active && !muted) playerRef.current?.start();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [active, muted]);

  useEffect(
    () => () => {
      const context = contextRef.current;
      contextRef.current = null;
      if (context) void context.close().catch(() => undefined);
    },
    [],
  );

  const ensureContext = useCallback(() => {
    if (!contextRef.current) contextRef.current = new AudioContext();
    const context = contextRef.current;
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
    return context;
  }, []);

  const startFromGesture = useCallback(() => {
    if (!gameId) return;
    setSession((current) =>
      current.gameId === gameId && current.active ? current : { gameId, active: true },
    );
    if (muted) return;
    playerRef.current?.start();
    try {
      ensureContext();
    } catch {
      // Music can still play when Web Audio is unavailable.
    }
  }, [ensureContext, gameId, muted]);

  const stop = useCallback(() => {
    setSession({ gameId, active: false });
    playerRef.current?.pause();
  }, [gameId]);

  const toggleMuted = useCallback(() => {
    const nextMuted = !muted;
    memoryMuted = nextMuted;
    try {
      window.localStorage.setItem(MUTE_KEY, nextMuted ? '1' : '0');
    } catch {
      // Local storage may be unavailable in a private browsing context.
    }
    window.dispatchEvent(new Event(MUTE_EVENT));
    if (nextMuted) playerRef.current?.pause();
    else if (active && !document.hidden) playerRef.current?.start();
  }, [active, muted]);

  const playCue = useCallback(
    (kind: GameCue, cellIndex?: number) => {
      if (!gameId || muted || document.hidden) return;
      try {
        playGameCue(ensureContext(), kind, cellIndex);
      } catch {
        // A missing or blocked audio device should not interrupt gameplay.
      }
    },
    [ensureContext, gameId, muted],
  );

  const setMusicDucked = useCallback((ducked: boolean) => {
    playerRef.current?.setDucked(ducked);
  }, []);

  return { muted, toggleMuted, startFromGesture, stop, playCue, setMusicDucked };
};
