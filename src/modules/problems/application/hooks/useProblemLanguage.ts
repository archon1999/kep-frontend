import { useCallback, useEffect, useMemo, useState } from 'react';
import { getItemFromStore, setItemToStore } from 'shared/lib/utils';
import { AttemptLangs, ProblemAvailableLanguage } from '../../domain/entities/problem.entity';

const STORAGE_LANG_KEY = 'problem-submit-lang';

const parseStoredLanguage = (stored: unknown) => {
  if (typeof stored === 'string') return stored;
  if (stored && typeof stored === 'object' && 'lang' in (stored as Record<string, unknown>)) {
    return (stored as { lang?: string }).lang ?? null;
  }
  return null;
};

const resolveLanguage = (
  preferred: string | null | undefined,
  availableLanguages?: ProblemAvailableLanguage[],
  fallbackLang: string = AttemptLangs.PYTHON,
) => {
  const effectiveFallback = fallbackLang || AttemptLangs.PYTHON;
  const candidate = preferred || effectiveFallback;

  if (availableLanguages?.length) {
    const isAvailable = availableLanguages.some((lang) => lang.lang === candidate);
    return isAvailable ? candidate : (availableLanguages[0]?.lang ?? effectiveFallback);
  }

  return candidate;
};

interface UseProblemLanguageParams {
  availableLanguages?: ProblemAvailableLanguage[];
  defaultLang?: string;
}

export const useProblemLanguage = ({
  availableLanguages,
  defaultLang,
}: UseProblemLanguageParams) => {
  const [selectedLang, setSelectedLangState] = useState<string>(() => {
    let stored: string | null = null;
    try {
      stored = parseStoredLanguage(getItemFromStore(STORAGE_LANG_KEY));
    } catch {
      // Use the available language when browser storage is unavailable.
    }
    return resolveLanguage(stored, availableLanguages, defaultLang);
  });

  useEffect(() => {
    setSelectedLangState((current) => resolveLanguage(current, availableLanguages, defaultLang));
  }, [availableLanguages, defaultLang]);

  useEffect(() => {
    if (!selectedLang) return;
    try {
      setItemToStore(STORAGE_LANG_KEY, JSON.stringify(selectedLang));
    } catch {
      // Persistence is optional; language selection remains usable without it.
    }
  }, [selectedLang]);

  const setSelectedLang = useCallback(
    (lang: string) => setSelectedLangState(resolveLanguage(lang, availableLanguages, defaultLang)),
    [availableLanguages, defaultLang],
  );

  const selectedLanguage = useMemo(
    () => availableLanguages?.find((lang) => lang.lang === selectedLang) ?? null,
    [availableLanguages, selectedLang],
  );

  return { selectedLang, setSelectedLang, selectedLanguage } as const;
};
