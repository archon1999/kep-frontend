import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import AuthProvider from 'app/providers/AuthProvider.tsx';
import DocumentTitleProvider from 'app/providers/DocumentTitleProvider.tsx';
import { useSettingsContext } from 'app/providers/SettingsProvider.tsx';
import { REFRESH } from 'app/reducers/SettingsReducer.ts';
import SettingPanelToggler from 'shared/components/settings-panel/SettingPanelToggler.tsx';
import SettingsPanel from 'shared/components/settings-panel/SettingsPanel.tsx';
import useIcons from 'shared/hooks/useIcons.tsx';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import { addRecentPage } from 'shared/lib/recent-pages.ts';
import {
  applyThemeToggleEffectStyle,
  getStoredThemeToggleEffect,
} from 'shared/lib/themeToggleEffects.ts';

const normalizeTitle = (title: string, fallback: string) =>
  title.replace(/ - KEP\.uz$/, '') || fallback;
const SPLASH_MIN_VISIBLE_MS = 1400;
const SPLASH_FADE_MS = 420;

const hideInitialSplash = () => {
  const splash = document.getElementById('loading-bg');
  if (!splash) return undefined;

  const splashStartedAt = (window as Window & { __kepSplashStartedAt?: number })
    .__kepSplashStartedAt;
  const elapsedMs = Date.now() - (splashStartedAt ?? Date.now());
  const remainingMs = Math.max(SPLASH_MIN_VISIBLE_MS - elapsedMs, 0);

  const timeoutId = window.setTimeout(() => {
    splash.classList.add('kep-splash-hidden');
    window.setTimeout(() => splash.remove(), SPLASH_FADE_MS);
  }, remainingMs);

  return () => window.clearTimeout(timeoutId);
};

const App = () => {
  const { pathname, search, hash } = useLocation();
  const { mode } = useThemeMode();
  const { configDispatch } = useSettingsContext();
  useIcons();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    applyThemeToggleEffectStyle(getStoredThemeToggleEffect());
    return hideInitialSplash();
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
      <DocumentTitleProvider>
        <Outlet />
        <SettingsPanel />
        <SettingPanelToggler />
      </DocumentTitleProvider>
    </AuthProvider>
  );
};

export default App;
