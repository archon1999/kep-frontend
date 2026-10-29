import { useEffect, useRef, useState } from 'react';
import type { RunResult } from '../domain';
import { examples } from './examples';
import { startRun } from './mutations';
import { getRunResult } from './queries';

const storageKey = 'kep:playground:kep:v1';
const loadDraft = (): { code: string; input: string } => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (
      saved &&
      typeof saved === 'object' &&
      'code' in saved &&
      'input' in saved &&
      typeof saved.code === 'string' &&
      typeof saved.input === 'string'
    ) {
      return { code: saved.code.slice(0, 30000), input: saved.input.slice(0, 65536) };
    }
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  return { ...examples[0] };
};

export const usePlayground = () => {
  const [draft, setDraft] = useState(loadDraft);
  const [result, setResult] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [executedDraft, setExecutedDraft] = useState<{ code: string; input: string } | null>(null);
  const [error, setError] = useState<'busy' | 'network' | 'timeout' | null>(null);
  const controller = useRef<AbortController | null>(null);
  const byteLength = new TextEncoder().encode(draft.code).length;
  const inputBytes = new TextEncoder().encode(draft.input).length;
  const valid = byteLength > 0 && byteLength <= 30000 && inputBytes <= 65536;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch {
        /* Optional draft. */
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft]);
  useEffect(() => () => controller.current?.abort(), []);

  const run = async () => {
    if (busy || !valid) return;
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    setError(null);
    setResult(null);
    setExecutedDraft({ ...draft });
    const deadline = Date.now() + 40000;
    try {
      let current = await startRun(draft, request.signal);
      setResult(current);
      while (current.status === 'queued' || current.status === 'running') {
        if (Date.now() > deadline) {
          setError('timeout');
          break;
        }
        await new Promise<void>((resolve) => window.setTimeout(resolve, 800));
        if (request.signal.aborted) return;
        current = await getRunResult(current.id, request.signal);
        setResult(current);
      }
    } catch (cause) {
      if (!request.signal.aborted) {
        const status = cause && typeof cause === 'object' && 'status' in cause ? cause.status : 0;
        setError(status === 429 ? 'busy' : 'network');
      }
    } finally {
      if (!request.signal.aborted) setBusy(false);
    }
  };

  return {
    draft,
    result,
    busy,
    error,
    resultIsStale: Boolean(
      result &&
      executedDraft &&
      (draft.code !== executedDraft.code || draft.input !== executedDraft.input),
    ),
    byteLength,
    valid,
    run,
    setCode: (code: string) => setDraft((value) => ({ ...value, code })),
    setInput: (input: string) => setDraft((value) => ({ ...value, input })),
    selectExample: (id: string) => {
      const example = examples.find((item) => item.id === id);
      if (example) {
        setDraft({ code: example.code, input: example.input });
        setResult(null);
        setExecutedDraft(null);
        setError(null);
      }
    },
    download: () => {
      const url = URL.createObjectURL(new Blob([draft.code], { type: 'text/plain;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'main.kep';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
};
