import { PropsWithChildren, useEffect, useLayoutEffect, useMemo } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { REFRESH } from 'app/reducers/SettingsReducer';
import { createTheme } from 'app/theme/theme.ts';
import { useSettingsContext } from './SettingsProvider';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const {
    config: {
      locale,
      themePreset,
      primaryColor,
      fontFamily,
      fontSize,
      backgroundPattern,
      cardStyle,
      cardBackground,
    },
    configDispatch,
  } = useSettingsContext();

  const customTheme = useMemo(() => {
    return createTheme({
      locale,
      preset: themePreset,
      primaryColor,
      fontFamily,
      fontSize,
    });
  }, [fontFamily, fontSize, locale, primaryColor, themePreset]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-aurora-preset', themePreset);
    root.setAttribute('data-kep-bg-pattern', backgroundPattern);
    root.setAttribute('data-kep-card-style', cardStyle);
    root.setAttribute('data-kep-card-background', cardBackground);
  }, [backgroundPattern, cardBackground, cardStyle, themePreset]);

  useEffect(() => {
    const observer = new MutationObserver(() => configDispatch({ type: REFRESH }));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-kep-color-scheme'],
    });
    return () => observer.disconnect();
  }, [configDispatch]);

  return (
    <MuiThemeProvider
      disableTransitionOnChange
      theme={customTheme}
      defaultMode="system"
      modeStorageKey="kep-mode"
    >
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
