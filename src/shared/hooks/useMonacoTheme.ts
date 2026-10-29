import { registerEditorThemes } from 'app/theme/editor';
import { registerKEPLang } from 'shared/lib/keplang';
import { useThemeMode } from './useThemeMode';

export const useMonacoTheme = (fallbackTheme?: string) => {
  const { isDark, themePreset } = useThemeMode();
  const isDefaultTheme = themePreset === 'default';

  return {
    isDefaultTheme,
    theme: isDefaultTheme
      ? `kep-${isDark ? 'dark' : 'light'}`
      : (fallbackTheme ?? (isDark ? 'vs-dark' : 'vs')),
    beforeMount: ((monaco) => {
      registerEditorThemes(monaco);
      registerKEPLang(monaco);
    }) as typeof registerEditorThemes,
  };
};
