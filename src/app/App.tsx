import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router';
import AuthProvider, { useAuth } from 'app/providers/AuthProvider.tsx';
import DocumentTitleProvider from 'app/providers/DocumentTitleProvider.tsx';
import { useSettingsContext } from 'app/providers/SettingsProvider.tsx';
import { REFRESH } from 'app/reducers/SettingsReducer.ts';
import { resources } from 'app/routes/resources.ts';
import SettingPanelToggler from 'shared/components/settings-panel/SettingPanelToggler.tsx';
import SettingsPanel from 'shared/components/settings-panel/SettingsPanel.tsx';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { addRecentPage } from 'shared/lib/recent-pages.ts';
import {
  applyThemeToggleEffectStyle,
  getStoredThemeToggleEffect,
} from 'shared/lib/themeToggleEffects.ts';

const normalizeTitle = (title: string, fallback: string) =>
  title.replace(/ - KEP\.uz$/, '') || fallback;
const SPLASH_FADE_MS = 420;

const hideInitialSplash = () => {
  const splash = document.getElementById('loading-bg');
  if (!splash) return undefined;

  splash.classList.add('kep-splash-hidden');
  const timeoutId = window.setTimeout(() => splash.remove(), SPLASH_FADE_MS);

  return () => window.clearTimeout(timeoutId);
};

const InitialSplashController = () => {
  const { isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return undefined;

    return hideInitialSplash();
  }, [isAuthLoading]);

  return null;
};

const App = () => {
  const { pathname, search, hash } = useLocation();
  const isGameDetail = Boolean(useMatch(`${resources.Games}/:gameId`));
  const { mode } = useThemeMode();
  const { configDispatch } = useSettingsContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    applyThemeToggleEffectStyle(getStoredThemeToggleEffect());
  }, []);

  useEffect(() => {
    const fullPath = `${pathname}${search}${hash}`;
    const pageTitle = normalizeTitle(document.title, fullPath);

    addRecentPage({
      path: fullPath,
      title: pageTitle,
    });
  }, [pathname, search, hash]);

  useLayoutEffect(() => {
    configDispatch({ type: REFRESH });
  }, [mode]);

  return (
    <AuthProvider>
      <InitialSplashController />
      <DocumentTitleProvider>
        <Outlet />
        {!isGameDetail && <SettingsPanel />}
        {!isGameDetail && <SettingPanelToggler />}
      </DocumentTitleProvider>
    </AuthProvider>
  );
};

export default App;
