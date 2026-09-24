import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type WorldPoint,
  isWorldTerminalAnswerCorrect,
  isWorldTerminalAnswerFormat,
  worldBeacons,
  worldDistance,
  worldObjectivesComplete,
  worldRoutes,
  worldScore,
  worldShards,
  worldStations,
  worldTerminals,
} from '../domain/world/world';
import {
  type WorldSave,
  claimGuestWorldSave,
  emptyWorldSave,
  loadWorldSave,
  saveWorldSave,
} from './worldPersistence';

const load = (player: string, currentGuestSave?: WorldSave) =>
  player === 'guest'
    ? loadWorldSave(localStorage, player)
    : claimGuestWorldSave(localStorage, player, currentGuestSave);

export const useWorldSession = (player: string, onScore: (score: number) => void) => {
  const [save, setSave] = useState<WorldSave>(() => load(player));
  const [savePlayer, setSavePlayer] = useState(player);
  const [sceneKey, setSceneKey] = useState(0);
  const [started, setStarted] = useState(false);
  const [openTerminal, setOpenTerminal] = useState<string | null>(null);
  const [lastWrong, setLastWrong] = useState(false);
  const [lastHit, setLastHit] = useState(false);
  const playerRef = useRef(player);
  const completedRef = useRef(save.completed);
  const endedRef = useRef(save.completed || save.fallen);
  const reportedFallRef = useRef(save.fallen);
  const latestPosition = useRef(save.position);
  const lastMoveCommitAt = useRef(0);
  const moveTimer = useRef<number | null>(null);

  const clearMoveTimer = useCallback(() => {
    if (moveTimer.current !== null) window.clearTimeout(moveTimer.current);
    moveTimer.current = null;
  }, []);

  const latestSave = useRef({ player: savePlayer, value: save });
  const lastPersisted = useRef<{ player: string; value: WorldSave; at: number } | null>(null);
  const persistTimer = useRef<number | null>(null);
  const flushSave = useCallback(() => {
    if (persistTimer.current !== null) window.clearTimeout(persistTimer.current);
    persistTimer.current = null;
    const snapshot = latestSave.current;
    const value =
      snapshot.player === playerRef.current
        ? { ...snapshot.value, position: latestPosition.current }
        : snapshot.value;
    saveWorldSave(localStorage, snapshot.player, value);
    lastPersisted.current = { player: snapshot.player, value, at: performance.now() };
  }, []);

  const commitMove = useCallback(() => {
    moveTimer.current = null;
    lastMoveCommitAt.current = performance.now();
    const position = latestPosition.current;
    setSave((current) =>
      current.fallen ||
      current.completed ||
      (current.position.x === position.x && current.position.z === position.z)
        ? current
        : { ...current, position },
    );
  }, []);

  useEffect(() => clearMoveTimer, [clearMoveTimer]);

  useEffect(() => {
    if (playerRef.current === player) return;
    flushSave();
    playerRef.current = player;
    const next = load(
      player,
      savePlayer === 'guest' ? { ...save, position: latestPosition.current } : undefined,
    );
    completedRef.current = next.completed;
    endedRef.current = next.completed || next.fallen;
    reportedFallRef.current = next.fallen;
    clearMoveTimer();
    latestPosition.current = next.position;
    lastMoveCommitAt.current = 0;
    setSavePlayer(player);
    setSave(next);
    setSceneKey((current) => current + 1);
    setStarted(false);
    setOpenTerminal(null);
    setLastWrong(false);
    setLastHit(false);
  }, [player, save, savePlayer, clearMoveTimer, flushSave]);

  useEffect(() => {
    if (savePlayer !== player) return;
    latestSave.current = { player, value: save };
    const previous = lastPersisted.current;
    const positionOrTimeOnly =
      previous?.player === player &&
      previous.value.collected === save.collected &&
      previous.value.solved === save.solved &&
      previous.value.charged === save.charged &&
      previous.value.beacons === save.beacons &&
      previous.value.routes === save.routes &&
      previous.value.mistakes === save.mistakes &&
      previous.value.hits === save.hits &&
      previous.value.lockedUntil === save.lockedUntil &&
      previous.value.completed === save.completed &&
      previous.value.fallen === save.fallen;
    const delay = previous ? 1000 - (performance.now() - previous.at) : 0;
    if (!positionOrTimeOnly || delay <= 0) {
      flushSave();
    } else if (persistTimer.current === null) {
      persistTimer.current = window.setTimeout(flushSave, delay);
    }
  }, [player, save, savePlayer, flushSave]);

  useEffect(() => {
    window.addEventListener('pagehide', flushSave);
    return () => {
      window.removeEventListener('pagehide', flushSave);
      flushSave();
    };
  }, [flushSave]);

  useEffect(() => {
    if (!started || save.completed || save.fallen) return;
    const interval = window.setInterval(() => {
      setSave((current) => ({ ...current, elapsed: current.elapsed + 1 }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [save.completed, save.fallen, started]);

  const move = useCallback(
    (position: WorldPoint) => {
      if (endedRef.current) return;
      latestPosition.current = position;
      setStarted(true);
      const remaining = 250 - (performance.now() - lastMoveCommitAt.current);
      if (remaining <= 0) {
        clearMoveTimer();
        commitMove();
      } else if (moveTimer.current === null) {
        moveTimer.current = window.setTimeout(commitMove, remaining);
      }
    },
    [clearMoveTimer, commitMove],
  );

  const start = useCallback(() => setStarted(true), []);

  const collect = useCallback((id: string) => {
    if (!worldShards.some((item) => item.id === id)) return;
    setSave((current) =>
      current.collected.includes(id)
        ? current
        : { ...current, collected: [...current.collected, id] },
    );
  }, []);

  const chargeStation = useCallback((id: string) => {
    if (!worldStations.some((item) => item.id === id)) return;
    setSave((current) =>
      current.charged.includes(id) ? current : { ...current, charged: [...current.charged, id] },
    );
  }, []);

  const collectBeacon = useCallback((id: string) => {
    if (!worldBeacons.some((item) => item.id === id)) return;
    setSave((current) =>
      current.beacons.includes(id) ? current : { ...current, beacons: [...current.beacons, id] },
    );
  }, []);

  const completeRoute = useCallback((id: string) => {
    if (!worldRoutes.some((item) => item.id === id)) return;
    setSave((current) =>
      current.routes.includes(id) ? current : { ...current, routes: [...current.routes, id] },
    );
  }, []);

  const hitHazard = useCallback(() => {
    setSave((current) =>
      current.completed || current.fallen ? current : { ...current, hits: current.hits + 1 },
    );
    setLastHit(true);
    window.setTimeout(() => setLastHit(false), 1800);
  }, []);

  const fall = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    clearMoveTimer();
    setStarted(false);
    setOpenTerminal(null);
    setSave((current) =>
      current.completed || current.fallen
        ? current
        : { ...current, position: latestPosition.current, fallen: true },
    );
  }, [clearMoveTimer]);

  const nearbyTerminal = useMemo(
    () =>
      worldTerminals.find(
        (terminal) =>
          !save.solved.includes(terminal.id) &&
          (save.lockedUntil[terminal.id] ?? 0) <= save.elapsed &&
          worldDistance(save.position, terminal) < 1.9,
      ),
    [save.position, save.solved, save.elapsed, save.lockedUntil],
  );

  const nearbyLockedTerminal = useMemo(
    () =>
      worldTerminals.find(
        (terminal) =>
          !save.solved.includes(terminal.id) &&
          (save.lockedUntil[terminal.id] ?? 0) > save.elapsed &&
          worldDistance(save.position, terminal) < 1.9,
      ),
    [save.position, save.solved, save.elapsed, save.lockedUntil],
  );
  const lockRemaining = nearbyLockedTerminal
    ? (save.lockedUntil[nearbyLockedTerminal.id] ?? 0) - save.elapsed
    : 0;

  const interact = useCallback(() => {
    if (!nearbyTerminal || save.completed || save.fallen) return;
    setLastWrong(false);
    setOpenTerminal(nearbyTerminal.id);
  }, [nearbyTerminal, save.completed, save.fallen]);

  const answer = useCallback(
    (response: number | string) => {
      const terminal = worldTerminals.find((item) => item.id === openTerminal);
      if (!terminal || save.completed || save.fallen) return false;
      if (!isWorldTerminalAnswerFormat(terminal, response)) return false;
      if (!isWorldTerminalAnswerCorrect(terminal, response)) {
        setSave((current) => ({
          ...current,
          mistakes: current.mistakes + 1,
          lockedUntil: { ...current.lockedUntil, [terminal.id]: current.elapsed + 12 },
        }));
        setLastWrong(true);
        window.setTimeout(() => setLastWrong(false), 2200);
        setOpenTerminal(null);
        return false;
      }
      setSave((current) =>
        current.solved.includes(terminal.id)
          ? current
          : { ...current, solved: [...current.solved, terminal.id] },
      );
      setOpenTerminal(null);
      setLastWrong(false);
      return true;
    },
    [openTerminal, save.completed, save.fallen],
  );

  useEffect(() => {
    if (completedRef.current || save.fallen) return;
    if (
      !worldObjectivesComplete({
        shards: save.collected.length,
        terminals: save.solved.length,
        stations: save.charged.length,
        beacons: save.beacons.length,
        routes: save.routes.length,
      })
    ) {
      return;
    }
    completedRef.current = true;
    const score = worldScore(
      save.collected.length,
      save.solved.length,
      save.charged.length,
      save.elapsed,
      save.mistakes,
      save.hits,
      save.beacons.length,
      save.routes.length,
    );
    setSave((current) => ({ ...current, completed: true }));
    onScore(score);
  }, [
    onScore,
    save.collected.length,
    save.solved.length,
    save.charged.length,
    save.beacons.length,
    save.routes.length,
    save.elapsed,
    save.mistakes,
    save.hits,
  ]);

  useEffect(() => {
    if (!save.fallen || reportedFallRef.current) return;
    reportedFallRef.current = true;
    onScore(
      worldScore(
        save.collected.length,
        save.solved.length,
        save.charged.length,
        save.elapsed,
        save.mistakes,
        save.hits,
        save.beacons.length,
        save.routes.length,
      ),
    );
  }, [onScore, save]);

  const reset = useCallback(() => {
    completedRef.current = false;
    endedRef.current = false;
    reportedFallRef.current = false;
    clearMoveTimer();
    latestPosition.current = { x: 0, z: 0 };
    lastMoveCommitAt.current = 0;
    setSave(emptyWorldSave());
    setSceneKey((current) => current + 1);
    setStarted(false);
    setOpenTerminal(null);
    setLastWrong(false);
    setLastHit(false);
  }, [clearMoveTimer]);

  return {
    ...save,
    score: worldScore(
      save.collected.length,
      save.solved.length,
      save.charged.length,
      save.elapsed,
      save.mistakes,
      save.hits,
      save.beacons.length,
      save.routes.length,
    ),
    sceneKey,
    openTerminal,
    nearbyTerminal,
    nearbyLockedTerminal,
    lockRemaining,
    lastWrong,
    lastHit,
    start,
    move,
    collect,
    chargeStation,
    collectBeacon,
    completeRoute,
    hitHazard,
    fall,
    interact,
    answer,
    reset,
    setOpenTerminal,
  };
};
