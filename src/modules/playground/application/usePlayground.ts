import { useEffect, useRef, useState } from 'react';
import { playgroundRepository } from '../data-access';
import type { Draft, RunRequest, RunResult, RunnerLanguage } from '../domain';
import { decodeDrafts } from '../domain/utils/drafts';
import { createDraftPersistence } from './draft-persistence';
import { examples } from './examples';
import { useRunnerLanguages } from './queries';
import { executeRunJob } from './run-job';

const storageKey = 'kep:playground:drafts:v2';
const legacyKey = 'kep:playground:kep:v1';
const loadDrafts = () => {
  try {
    return decodeDrafts(localStorage.getItem(storageKey), localStorage.getItem(legacyKey));
  } catch {
    return {};
  }
};
const fallback: RunnerLanguage = {
  id: 'kep',
  label: 'KEPLang 0.3.1',
  extension: 'kep',
  editorLanguage: 'keplang',
  template: examples[0].code,
  timeLimit: 1500,
  memoryLimit: 128,
};

export const usePlayground = () => {
  const catalogue = useRunnerLanguages();
  const languages = catalogue.data ?? [fallback];
  const [selectedLang, selectLang] = useState('kep');
  const [drafts, setDrafts] = useState<Record<string, Draft>>(loadDrafts);
  const language = languages.find((item) => item.id === selectedLang) ?? fallback;
  const fileName = language.id === 'java' ? 'Main.java' : `main.${language.extension}`;
  const draft = drafts[selectedLang] ?? { code: language.template, input: '3 5\n' };
  const [result, setResult] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [draftStored, setDraftStored] = useState(true);
  const [executed, setExecuted] = useState<RunRequest | null>(null);
  const [error, setError] = useState<'busy' | 'network' | 'timeout' | 'expired' | 'invalid' | null>(
    null,
  );
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const persistence = useRef<ReturnType<typeof createDraftPersistence> | null>(null);
  const byteLength = new TextEncoder().encode(draft.code).length;
  const inputBytes = new TextEncoder().encode(draft.input).length;
  const valid = byteLength > 0 && byteLength <= 30000 && inputBytes <= 65536;
  const languageReady = Boolean(catalogue.data?.some((item) => item.id === selectedLang));
  useEffect(() => {
    try {
      persistence.current = createDraftPersistence(localStorage, storageKey, setDraftStored);
    } catch {
      setDraftStored(false);
    }
    const flush = () => persistence.current?.flush(false);
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      persistence.current?.dispose();
    };
  }, []);
  useEffect(() => {
    persistence.current?.schedule(drafts);
  }, [drafts]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);
  const updateDraft = (value: Draft) =>
    setDrafts((current) => ({ ...current, [selectedLang]: value }));
  const clearResult = () => {
    setResult(null);
    setExecuted(null);
    setError(null);
  };
  const run = async () => {
    if (controller.current || !valid || !languageReady) return;
    const request = new AbortController();
    controller.current = request;
    const snapshot = { ...draft, lang: selectedLang };
    setBusy(true);
    setError(null);
    setResult(null);
    setExecuted(snapshot);
    const timer = setTimeout(
      () => request.abort(new DOMException('Timeout', 'TimeoutError')),
      100000,
    );
    try {
      await executeRunJob(playgroundRepository, snapshot, request.signal, setResult);
    } catch (cause) {
      if (request.signal.aborted) {
        if (request.signal.reason?.name === 'TimeoutError') setError('timeout');
      } else {
        const status = cause && typeof cause === 'object' && 'status' in cause ? cause.status : 0;
        setError(
          status === 429
            ? 'busy'
            : status === 404
              ? 'expired'
              : status === 400
                ? 'invalid'
                : 'network',
        );
      }
    } finally {
      clearTimeout(timer);
      if (controller.current === request) {
        controller.current = null;
        if (mounted.current) setBusy(false);
      }
    }
  };
  const changeLanguage = (id: string) => {
    if (controller.current || !languages.some((item) => item.id === id)) return;
    setDrafts((current) => ({ ...current, [selectedLang]: { ...draft } }));
    selectLang(id);
    clearResult();
  };
  return {
    draft,
    language,
    fileName,
    languages,
    selectedLang,
    result,
    busy,
    draftStored,
    error,
    byteLength,
    inputBytes,
    valid,
    languageReady,
    languagesLoading: catalogue.isLoading,
    catalogueError: Boolean(catalogue.error),
    retryLanguages: () => void catalogue.mutate(),
    resultIsStale: Boolean(
      result &&
      executed &&
      (selectedLang !== executed.lang ||
        draft.code !== executed.code ||
        draft.input !== executed.input),
    ),
    run,
    changeLanguage,
    setCode: (code: string) =>
      setDrafts((current) => ({
        ...current,
        [selectedLang]: { ...(current[selectedLang] ?? draft), code },
      })),
    setInput: (input: string) =>
      setDrafts((current) => ({
        ...current,
        [selectedLang]: { ...(current[selectedLang] ?? draft), input },
      })),
    selectExample: (id: string) => {
      if (controller.current) return;
      const example =
        selectedLang === 'kep'
          ? examples.find((item) => item.id === id)
          : id === 'sum'
            ? { code: language.template, input: '3 5\n' }
            : undefined;
      if (example) {
        updateDraft({ code: example.code, input: example.input });
        clearResult();
      }
    },
    importCode: (id: string, code: string) => {
      const target = languages.find((item) => item.id === id);
      if (controller.current || !target) return false;
      setDrafts((current) => ({
        ...current,
        [selectedLang]: { ...draft },
        [id]: { code, input: current[id]?.input ?? draft.input },
      }));
      selectLang(id);
      clearResult();
      return true;
    },
    download: () => {
      const url = URL.createObjectURL(new Blob([draft.code], { type: 'text/plain;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
};
