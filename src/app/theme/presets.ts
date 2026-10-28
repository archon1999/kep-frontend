export const themePresets = [
  'default',
  'cobalt',
  'luxury',
  'retro',
  'arctic',
  'nature',
  'ember',
  'dracula',
  'midnight',
] as const;

export type ThemePreset = (typeof themePresets)[number];

/** Compatibility is confined to persisted settings; components only use canonical IDs. */
export const normalizeThemePreset = (value: unknown): ThemePreset => {
  if (value === 'flames') return 'default';
  if (value === 'old-blue' || value === 'default-light' || value === 'default-dark')
    return 'cobalt';
  return themePresets.includes(value as ThemePreset) ? (value as ThemePreset) : 'default';
};

export const resolveInitialMode = (preset: unknown, mode: unknown): 'light' | 'dark' | 'system' => {
  if (mode === 'light' || mode === 'dark' || mode === 'system') return mode;
  return preset === 'default-light' ? 'light' : 'dark';
};
