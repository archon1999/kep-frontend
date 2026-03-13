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

const normalizeTitle = (title: string, fallback: string) => title.replace(/ - KEP\.uz$/, '') || fallback;

const App = () => {
  const { pathname, search, hash } = useLocation();
  const { mode } = useThemeMode();
  const { configDispatch } = useSettingsContext();
  useIcons();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
