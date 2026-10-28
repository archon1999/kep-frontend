import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useMatches } from 'react-router';
import { applyDocumentMetadata } from 'app/seo/documentMetadata';
import { resolveSeoRoute, websiteStructuredData } from 'app/seo/routes';

type DocumentTitleHandle = {
  titleKey?: string;
  fallbackTitleKey?: string;
  titleParams?:
    | Record<string, string | number | undefined>
    | ((
        match: ReturnType<typeof useMatches>[number],
      ) => Record<string, string | number | undefined>);
};

type DocumentTitleState = {
  key: string;
  params?: Record<string, string | number | undefined>;
  description?: string;
  pathname: string;
};

type DocumentTitleContextValue = {
  setTitle: (payload: DocumentTitleState | null) => void;
  resetTitle: () => void;
  setExcludedPath: (pathname: string | null) => void;
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
  const { pathname, search } = useLocation();
  const { t, i18n } = useTranslation();
  const [override, setOverride] = useState<DocumentTitleState | null>(null);
  const [excludedPath, setExcludedPath] = useState<string | null>(null);

  const { handle, match } = useMemo(() => getTitleHandleFromMatches(matches), [matches]);
  const handleParams = useMemo(() => getTitleParams(handle, match), [handle, match]);

  const resolvedTitle = useMemo(() => {
    // document.title is plain text, so interpolation must not HTML-escape values.
    const interpolation = { escapeValue: false };

    if (override?.key && override.pathname === pathname) {
      const translated = t(override.key, { ...override.params, interpolation });
      if (!hasInterpolationPlaceholders(translated)) {
        return translated;
      }
    }

    if (handle?.titleKey) {
      const translated = t(handle.titleKey, { ...handleParams, interpolation });
      if (!hasInterpolationPlaceholders(translated)) {
        return translated;
      }

      if (handle.fallbackTitleKey) {
        const fallbackTranslated = t(handle.fallbackTitleKey, { interpolation });
        if (!hasInterpolationPlaceholders(fallbackTranslated)) {
          return fallbackTranslated;
        }
      }
    }

    return '';
  }, [override, handle, handleParams, t, i18n.language, pathname]);

  useEffect(() => {
    const route = resolveSeoRoute(pathname, search);
    const baseTitle = resolvedTitle || APP_NAME;
    const sectionDescription = t(`seo.${route.section}.description`);
    const description =
      override?.pathname === pathname && override.description
        ? override.description
        : !route.isEntry && resolvedTitle
          ? `${resolvedTitle}. ${sectionDescription}`
          : sectionDescription;
    applyDocumentMetadata(document, {
      title: baseTitle === APP_NAME ? APP_NAME : `${baseTitle} - ${APP_NAME}`,
      description: description.replace(/\s+/g, ' ').trim().slice(0, 240),
      language: i18n.resolvedLanguage || i18n.language,
      robots: excludedPath === pathname ? 'noindex, follow' : route.robots,
      canonical: excludedPath === pathname ? undefined : route.canonical,
      structuredData:
        route.isHome && route.indexable && excludedPath !== pathname
          ? websiteStructuredData
          : undefined,
    });
  }, [
    resolvedTitle,
    pathname,
    search,
    t,
    i18n.resolvedLanguage,
    i18n.language,
    override,
    excludedPath,
  ]);

  const setTitle = useCallback((payload: DocumentTitleState | null) => setOverride(payload), []);
  const resetTitle = useCallback(() => setOverride(null), []);

  const contextValue = useMemo(
    () => ({
      setTitle,
      resetTitle,
      setExcludedPath,
    }),
    [setTitle, resetTitle],
  );

  return (
    <DocumentTitleContext.Provider value={contextValue}>{children}</DocumentTitleContext.Provider>
  );
};

export default DocumentTitleProvider;

/** Error views may also replace a valid-looking detail URL after an API 404/403. */
export const useDocumentNoIndex = () => {
  const context = useContext(DocumentTitleContext);
  const { pathname } = useLocation();
  const setExcludedPath = context?.setExcludedPath;
  useEffect(() => {
    setExcludedPath?.(pathname);
    return () => setExcludedPath?.(null);
  }, [pathname, setExcludedPath]);
};

export const useDocumentTitle = (
  key?: string,
  params?: Record<string, string | number | undefined>,
  description?: string,
) => {
  const context = useContext(DocumentTitleContext);
  const { pathname } = useLocation();

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

    setTitle({ key, params: stableParams, description, pathname });
    return () => resetTitle();
  }, [key, stableParams, description, pathname, setTitle, resetTitle]);
};
