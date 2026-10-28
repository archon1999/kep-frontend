import { registerEditorThemes } from 'app/theme/editor';
import { useThemeMode } from './useThemeMode';

export const useMonacoTheme = (fallbackTheme?: string) => {
  const { isDark, themePreset } = useThemeMode();
  const isDefaultTheme = themePreset === 'default';

  return {
    isDefaultTheme,
    theme: isDefaultTheme
      ? `kep-${isDark ? 'dark' : 'light'}`
      : (fallbackTheme ?? (isDark ? 'vs-dark' : 'vs')),
    beforeMount: registerEditorThemes,
  };
};
