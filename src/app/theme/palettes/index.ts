import { PaletteOptions } from '@mui/material';
import { ThemePreset } from 'app/config.ts';
import { darkPalette } from 'app/theme/palette/darkPalette';
import { lightPalette } from 'app/theme/palette/lightPalette';
import { arcticPalette } from './arctic';
import { draculaPalette } from './dracula';
import { emberPalette } from './ember';
import { luxuryPalette } from './luxury';
import { midnightPalette } from './midnight';
import { naturePalette } from './nature';
import { retroPalette } from './retro';

export const THEME_DISPLAY_NAMES: Partial<Record<ThemePreset, string>> = {
  'default-light': 'Light',
  'default-dark': 'Dark',
  luxury: 'Luxury',
  retro: 'Retro',
  arctic: 'Arctic',
  nature: 'Nature',
  ember: 'Ember',
  dracula: 'Dracula',
  midnight: 'Midnight',
};

export const lightPalettes: Partial<Record<ThemePreset, PaletteOptions>> = {
  'default-light': lightPalette,
  luxury: luxuryPalette,
  retro: retroPalette,
  arctic: arcticPalette,
  nature: naturePalette,
};

export const darkPalettes: Partial<Record<ThemePreset, PaletteOptions>> = {
  'default-dark': darkPalette,
  ember: emberPalette,
  dracula: draculaPalette,
  midnight: midnightPalette,
};

export const allPalettes: Record<ThemePreset, PaletteOptions> = {
  ...lightPalettes,
  ...darkPalettes,
} as Record<ThemePreset, PaletteOptions>;
