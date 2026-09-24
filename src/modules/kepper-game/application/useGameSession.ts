import { useEffect, useMemo, useRef, useState } from 'react';
import type { Command, GameProgress, TraceFrame } from '../domain';
import {
  GameSyntaxError,
  countCommands,
  formatProgram,
  getLevel,
  levels,
  parseMap,
  parseProgram,
  runLevel,
} from '../domain';
import { saveGameProgress } from './mutations';
import { loadGameProgress } from './queries';

type Feedback =
  | { kind: 'win'; stars: number }
  | { kind: 'fail'; reason: string; scenario: number }
  | { kind: 'syntax'; line: number }
  | { kind: 'unavailable' };

const firstUnfinished = (progress: GameProgress) =>
  levels.find((level) => !progress.completed.includes(level.id))?.id ?? levels.length;

const usedKinds = (commands: readonly Command[]): Command['kind'][] =>
  commands.flatMap((command) => {
    if (command.kind === 'repeat') return [command.kind, ...usedKinds(command.body)];
    if (command.kind === 'ifBlocked' || command.kind === 'ifCrystalAhead') {
      return [command.kind, ...usedKinds(command.yes), ...usedKinds(command.no)];
    }
    return [command.kind];
  });

export const useGameSession = (username?: string) => {
  const [progress, setProgress] = useState(() => loadGameProgress(username));
  const [levelId, setLevelId] = useState(() => firstUnfinished(loadGameProgress(username)));
  const level = useMemo(() => getLevel(levelId), [levelId]);
  const [source, setSource] = useState(
    () => loadGameProgress(username).drafts[levelId] ?? formatProgram(getLevel(levelId).starter),
  );
  const [program, setProgram] = useState<Command[]>(() => {
    try {
      return parseProgram(
        loadGameProgress(username).drafts[levelId] ?? formatProgram(getLevel(levelId).starter),
      );
    } catch {
      return parseProgram(formatProgram(getLevel(levelId).starter));
    }
  });
  const [mode, setMode] = useState<'blocks' | 'code'>('code');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [trace, setTrace] = useState<TraceFrame[] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const timer = useRef<number | null>(null);
  const playerRef = useRef(username);

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  };

  useEffect(() => {
    if (playerRef.current === username) return;
    playerRef.current = username;
    const saved = loadGameProgress(username);
    const nextLevelId = firstUnfinished(saved);
    const nextSource = saved.drafts[nextLevelId] ?? formatProgram(getLevel(nextLevelId).starter);
    stop();
    setProgress(saved);
    setLevelId(nextLevelId);
    setScenarioIndex(0);
    setSource(nextSource);
    try {
      setProgram(parseProgram(nextSource));
    } catch {
      setProgram(parseProgram(formatProgram(getLevel(nextLevelId).starter)));
    }
    setMode('code');
    setTrace(null);
    setFrameIndex(0);
    setFeedback(null);
  }, [username]);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );

  const persistDraft = (nextSource: string) => {
    setProgress((current) => {
      const updated = { ...current, drafts: { ...current.drafts, [levelId]: nextSource } };
      saveGameProgress(username, updated);
      return updated;
    });
  };

  const changeProgram = (next: Command[]) => {
    if (playing) return;
    const nextSource = formatProgram(next);
    setProgram(next);
    setSource(nextSource);
    setFeedback(null);
    setTrace(null);
    setFrameIndex(0);
    persistDraft(nextSource);
  };

  const changeSource = (next: string) => {
    if (playing) return;
    setSource(next);
    setFeedback(null);
    setTrace(null);
    setFrameIndex(0);
    persistDraft(next);
  };

  const changeMode = (next: 'blocks' | 'code') => {
    if (playing || next === mode) return;
    if (next === 'blocks') {
      try {
        setProgram(parseProgram(source));
      } catch (error) {
        setFeedback({ kind: 'syntax', line: error instanceof GameSyntaxError ? error.line : 1 });
        return;
      }
    } else {
      const formatted = formatProgram(program);
      setSource(formatted);
      persistDraft(formatted);
    }
    setFeedback(null);
    setMode(next);
  };

  const selectLevel = (id: number) => {
    if (
      id < 1 ||
      id > levels.length ||
      id > firstUnfinished(progress) + Number(progress.completed.length === levels.length)
    )
      return;
    stop();
    const nextLevel = getLevel(id);
    const nextSource = progress.drafts[id] ?? formatProgram(nextLevel.starter);
    setLevelId(id);
    setSource(nextSource);
    try {
      setProgram(parseProgram(nextSource));
    } catch {
      setProgram(parseProgram(formatProgram(nextLevel.starter)));
    }
    setMode('code');
    setScenarioIndex(0);
    setTrace(null);
    setFrameIndex(0);
    setFeedback(null);
  };

  const selectScenario = (index: number) => {
    if (playing || index < 0 || index >= level.scenarios.length) return;
    setScenarioIndex(index);
    setTrace(null);
    setFrameIndex(0);
    setFeedback(null);
  };

  const resetProgram = () => {
    stop();
    changeProgram(parseProgram(formatProgram(level.starter)));
  };

  const seekFrame = (index: number) => {
    if (playing || !trace) return;
    setFrameIndex(Math.max(0, Math.min(trace.length - 1, index)));
  };

  const run = () => {
    if (playing) return;
    let currentProgram = program;
    if (mode === 'code') {
      try {
        currentProgram = parseProgram(source);
        setProgram(currentProgram);
      } catch (error) {
        setFeedback({ kind: 'syntax', line: error instanceof GameSyntaxError ? error.line : 1 });
        return;
      }
    }
    if (usedKinds(currentProgram).some((kind) => !level.available.includes(kind))) {
      setFeedback({ kind: 'unavailable' });
      return;
    }
    const results = runLevel(level, currentProgram);
    const preview = results[scenarioIndex].result;
    setTrace(preview.trace);
    setFrameIndex(0);
    setFeedback(null);
    setPlaying(true);
    const failed = results.findIndex(({ result }) => !result.success);
    const stars = Math.max(
      1,
      3 -
        Number(countCommands(currentProgram) > level.par) -
        Number(countCommands(currentProgram) > level.par + 4),
    );
    let step = 0;
    timer.current = window.setInterval(() => {
      step += 1;
      setFrameIndex(Math.min(step, preview.trace.length - 1));
      if (step <= preview.trace.length) return;
      stop();
      if (failed === -1) {
        setFeedback({ kind: 'win', stars });
        setProgress((current) => {
          const updated = {
            ...current,
            completed: [...new Set([...current.completed, level.id])],
            stars: { ...current.stars, [level.id]: Math.max(stars, current.stars[level.id] ?? 0) },
          };
          saveGameProgress(username, updated);
          return updated;
        });
      } else {
        setFeedback({
          kind: 'fail',
          reason: results[failed].result.failure ?? 'unfinished',
          scenario: failed + 1,
        });
      }
    }, 370 / playbackSpeed);
  };

  const map = useMemo(() => parseMap(level.scenarios[scenarioIndex].map), [level, scenarioIndex]);
  const currentFrame = trace?.[frameIndex] ?? {
    x: map.start.x,
    z: map.start.z,
    direction: 0 as const,
    collected: [],
    gateOpen: false,
    collapsed: [],
    action: 'start' as const,
  };
  const unlocked =
    progress.completed.length === levels.length ? levels.length : firstUnfinished(progress);

  return {
    level,
    levels,
    progress,
    unlocked,
    program,
    source,
    mode,
    scenarioIndex,
    map,
    currentFrame,
    trace,
    frameIndex,
    playing,
    playbackSpeed,
    feedback,
    changeProgram,
    changeSource,
    changeMode,
    selectLevel,
    selectScenario,
    resetProgram,
    run,
    stop,
    setPlaybackSpeed,
    seekFrame,
  };
};
