import { loader } from '@monaco-editor/react';
import { registerEditorThemes } from 'app/theme/editor';
import { registerKEPLang } from 'shared/lib/keplang';
import { useThemeMode } from './useThemeMode';

// Match the installed Monaco version, including its fixes for cancelled diff requests.
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.56.0/min/vs' } });

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
