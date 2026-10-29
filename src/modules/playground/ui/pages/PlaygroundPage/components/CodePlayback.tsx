import { type ReactNode, useCallback, useEffect, useState } from 'react';

const types = new Set(['son', 'matn', 'mantiq', 'lugat', 'toplam']);
const controls = new Set([
  'to',
  'bosa',
  'bomasa',
  'aylan',
  'shundat',
  'qaytar',
  'toxta',
  'davom',
  'at',
  'rast',
  'yalgan',
]);
const calls = new Set([
  'al',
  'al_soz',
  'al_satr',
  'chiqar',
  'uzunligi',
  'qosh',
  'sarala',
  'bomi',
  'uchir',
  'qiymat',
]);
const tokens = /\/\/[^\n]*|"(?:\\.|[^"\\])*"|\b\d+\b|\b[A-Za-z_][A-Za-z_0-9]*\b/g;

export const useCodePlayback = (source: string, reduced: boolean) => {
  const [playing, setPlaying] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [prefix, setPrefix] = useState('');
  const stop = useCallback(() => setPlaying(false), []);
  const play = useCallback(() => {
    if (reduced) return;
    setPrefix('');
    setCycle((value) => value + 1);
    setPlaying(true);
  }, [reduced]);

  useEffect(() => {
    if (!playing || reduced) return;
    const chars = Array.from(source);
    const duration = Math.min(4200, Math.max(2000, chars.length * 13));
    const started = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      setPrefix(chars.slice(0, Math.floor(progress * chars.length)).join(''));
      if (progress < 1 && !document.hidden) frame = requestAnimationFrame(step);
      else stop();
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [playing, source, cycle, reduced, stop]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, [stop]);
  useEffect(() => {
    if (reduced) stop();
  }, [reduced, stop]);
  return { playing, prefix, play, stop };
};

export const CodePlayback = ({ prefix }: { prefix: string }) => {
  const nodes: ReactNode[] = [];
  let end = 0;
  for (const match of prefix.matchAll(tokens)) {
    const start = match.index;
    nodes.push(prefix.slice(end, start));
    const word = match[0];
    const kind = word.startsWith('//')
      ? 'comment'
      : word.startsWith('"')
        ? 'string'
        : /^\d/.test(word)
          ? 'number'
          : types.has(word)
            ? 'type'
            : controls.has(word)
              ? 'keyword'
              : calls.has(word)
                ? 'function'
                : '';
    nodes.push(
      kind ? (
        <span key={start} className={`playback-${kind}`}>
          {word}
        </span>
      ) : (
        word
      ),
    );
    end = start + word.length;
  }
  nodes.push(prefix.slice(end));
  return (
    <pre className="playground-code-playback" aria-hidden="true">
      {nodes}
      <span className="playback-caret" />
    </pre>
  );
};
