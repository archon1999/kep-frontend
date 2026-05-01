import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useColorScheme } from '@mui/material';
import { ThemeMode, ThemePreset } from 'app/config.ts';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_PRIMARY_COLOR, SET_THEME_PRESET } from 'app/reducers/SettingsReducer';
import { darkPalettes } from 'app/theme/palettes';
import { COLOR_GROUPS } from 'app/theme/primaryColorOverride';
import {
  applyThemeToggleEffectStyle,
  getStoredThemeToggleEffect,
} from 'shared/lib/themeToggleEffects';

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

export const useThemeMode = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  const { config, configDispatch } = useSettingsContext();

  const isDark = mode === 'system' ? systemMode === 'dark' : mode === 'dark';

  const runWithThemeTransition = useCallback((callback: () => void) => {
    const selectedEffect = getStoredThemeToggleEffect();
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const startViewTransition = (document as ViewTransitionDocument).startViewTransition;

    applyThemeToggleEffectStyle(selectedEffect);

    if (!startViewTransition || selectedEffect === 'none' || reducedMotion) {
      callback();
      return;
    }

    startViewTransition.call(document, () => flushSync(callback));
  }, []);

  const setThemeMode = useCallback(
    (themeMode?: ThemeMode) => {
      runWithThemeTransition(() => {
        setMode(themeMode ?? (isDark ? 'light' : 'dark'));
      });
    },
    [isDark, runWithThemeTransition, setMode],
  );

  const setThemePreset = useCallback(
    (presetName: ThemePreset, options?: { updateMode?: boolean }) => {
      const shouldUpdateMode = options?.updateMode !== false;

      runWithThemeTransition(() => {
        configDispatch({ type: SET_THEME_PRESET, payload: presetName });
        configDispatch({
          type: SET_PRIMARY_COLOR,
          payload: COLOR_GROUPS.find((group) => group.key === presetName)?.main ?? null,
        });
        if (shouldUpdateMode) {
          setMode(presetName in darkPalettes ? 'dark' : 'light');
        }
      });
    },
    [configDispatch, runWithThemeTransition, setMode],
  );

  const resetTheme = useCallback(() => {
    runWithThemeTransition(() => {
      setMode(null);
    });
  }, [runWithThemeTransition, setMode]);

  return {
    mode,
    resetTheme,
    isDark,
    systemMode,
    setThemeMode,
    setThemePreset,
    themePreset: config.themePreset,
  };
};
