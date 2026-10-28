import type { Theme } from '@mui/material/styles';
import { medalColors } from './colors/medals';
import { displayFontFamily, readingFontFamily } from './fonts';
import type { ThemePreset } from './presets';

declare module '@mui/material/styles' {
  interface Theme {
    preset: ThemePreset;
  }
  interface ThemeOptions {
    preset?: ThemePreset;
  }
}

export const designTokens = {
  accent: { cool: '#93d7e2', warm: '#eacc9c', middle: '#c8d5c1', ink: '#10252b' },
  medal: medalColors,
  font: { display: displayFontFamily, reading: readingFontFamily },
  layout: { maxWidth: '1500px', gutter: '60px', inset: '32px', headerHeight: '96px' },
  gradient: 'linear-gradient(110deg, var(--kep-sand), var(--kep-ice))',
  pixelFontFeature: '"ss01" 1',
} as const;

/** CSS consumers and MUI components share the same palette and layout contract. */
export const themeCssVariables = (theme: Theme) => ({
  '--kep-ice':
    theme.preset === 'default' ? designTokens.accent.cool : theme.vars.palette.primary.main,
  '--kep-sand':
    theme.preset === 'default' ? designTokens.accent.warm : theme.vars.palette.secondary.main,
  '--kep-logo-sand': theme.vars.palette.secondary.main,
  '--kep-logo-mid':
    theme.preset === 'default' ? designTokens.accent.middle : theme.vars.palette.primary.light,
  '--kep-logo-ice': theme.vars.palette.primary.main,
  '--kep-accent-ink':
    theme.preset === 'default' ? designTokens.accent.ink : theme.vars.palette.primary.contrastText,
  '--kep-line': theme.vars.palette.divider,
  '--kep-bg': theme.vars.palette.background.default,
  '--kep-panel': theme.vars.palette.background.paper,
  '--kep-text': theme.vars.palette.text.primary,
  '--kep-muted': theme.vars.palette.text.secondary,
  '--kep-gold': designTokens.medal.dark.gold,
  '--kep-silver': designTokens.medal.dark.silver,
  '--kep-bronze': designTokens.medal.dark.bronze,
  '--kep-font-family': theme.typography.fontFamily,
  '--kep-reading-font': theme.typography.fontFamily,
  '--kep-display-font': designTokens.font.display,
  '--kep-page-width': designTokens.layout.maxWidth,
  '--kep-page-gutter': designTokens.layout.gutter,
  '--kep-content-inset': designTokens.layout.inset,
  '--kep-header-height': designTokens.layout.headerHeight,
});
