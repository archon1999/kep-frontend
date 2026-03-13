import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMatches } from 'react-router';
import { useTranslation } from 'react-i18next';

type DocumentTitleHandle = {
  titleKey?: string;
  fallbackTitleKey?: string;
  titleParams?:
    | Record<string, string | number | undefined>
    | ((match: ReturnType<typeof useMatches>[number]) => Record<string, string | number | undefined>);
};

type DocumentTitleState = {
  key: string;
  params?: Record<string, string | number | undefined>;
};

type DocumentTitleContextValue = {
  setTitle: (payload: DocumentTitleState | null) => void;
  resetTitle: () => void;
};

const APP_NAME = 'KEP.uz';

const hasInterpolationPlaceholders = (value?: string) => Boolean(value && value.includes('{{'));

const DocumentTitleContext = createContext<DocumentTitleContextValue | undefined>(undefined);

const getTitleHandleFromMatches = (matches: ReturnType<typeof useMatches>) => {
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const handle = matches[index].handle as DocumentTitleHandle | undefined;
    if (handle?.titleKey) {
      return { handle, match: matches[index] };
    }
  }

  return { handle: undefined, match: undefined };
};

const getTitleParams = (
  handle: DocumentTitleHandle | undefined,
  match: ReturnType<typeof useMatches>[number] | undefined,
): Record<string, string | number | undefined> | undefined => {
  if (!handle?.titleParams) {
    return undefined;
  }

  if (typeof handle.titleParams === 'function') {
    return match ? handle.titleParams(match) : undefined;
  }

  return handle.titleParams;
};

const DocumentTitleProvider = ({ children }: PropsWithChildren) => {
  const matches = useMatches();
  const { t, i18n } = useTranslation();
  const [override, setOverride] = useState<DocumentTitleState | null>(null);

  const { handle, match } = useMemo(() => getTitleHandleFromMatches(matches), [matches]);
  const handleParams = useMemo(() => getTitleParams(handle, match), [handle, match]);

  const resolvedTitle = useMemo(() => {
    if (override?.key) {
      const translated = t(override.key, override.params);
      if (!hasInterpolationPlaceholders(translated)) {
        return translated;
      }
    }

    if (handle?.titleKey) {
      const translated = t(handle.titleKey, handleParams);
      if (!hasInterpolationPlaceholders(translated)) {
        return translated;
      }

      if (handle.fallbackTitleKey) {
        const fallbackTranslated = t(handle.fallbackTitleKey);
        if (!hasInterpolationPlaceholders(fallbackTranslated)) {
          return fallbackTranslated;
        }
      }
    }

    return '';
  }, [override, handle, handleParams, t, i18n.language]);

  useEffect(() => {
    const baseTitle = resolvedTitle || APP_NAME;
    document.title = baseTitle === APP_NAME ? APP_NAME : `${baseTitle} - ${APP_NAME}`;
  }, [resolvedTitle]);

  const setTitle = useCallback((payload: DocumentTitleState | null) => setOverride(payload), []);
  const resetTitle = useCallback(() => setOverride(null), []);

  const contextValue = useMemo(
    () => ({
      setTitle,
      resetTitle,
    }),
    [setTitle, resetTitle],
  );

  return (
    <DocumentTitleContext.Provider value={contextValue}>{children}</DocumentTitleContext.Provider>
  );
};

export default DocumentTitleProvider;

export const useDocumentTitle = (
  key?: string,
  params?: Record<string, string | number | undefined>,
) => {
  const context = useContext(DocumentTitleContext);

  if (!context) {
    throw new Error('useDocumentTitle must be used within DocumentTitleProvider');
  }

  const { setTitle, resetTitle } = context;
  const stableParams = useMemo(() => params ?? undefined, [params]);

  useEffect(() => {
    if (!key) {
      resetTitle();
      return;
    }

    setTitle({ key, params: stableParams });
    return () => resetTitle();
  }, [key, stableParams, setTitle, resetTitle]);
};
