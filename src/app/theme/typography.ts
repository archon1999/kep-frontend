import type { CSSProperties } from 'react';
import type { TypographyVariantsOptions } from '@mui/material/styles';
import { type FontFamily, initialConfig } from 'app/config.ts';
import { displayFontFamily } from './fonts';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    pixel: CSSProperties;
    metric: CSSProperties;
    label: CSSProperties;
  }
  interface TypographyVariantsOptions {
    pixel?: CSSProperties;
    metric?: CSSProperties;
    label?: CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    pixel: true;
    metric: true;
    label: true;
  }
}

export const uiTypography = {
  body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  smallText: { fontSize: '.875rem', fontWeight: 400, lineHeight: 1.5 },
  cardTitle: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.5 },
} as const;

const createTypography = (
  fontFamily: FontFamily = initialConfig.fontFamily,
  fontSize: number = initialConfig.fontSize,
): TypographyVariantsOptions => ({
  fontFamily: `"${fontFamily}", "Open Sans", Arial, sans-serif`,
  fontSize,
  h1: { fontSize: '3rem', fontWeight: 500, lineHeight: 1.12, letterSpacing: '-.03em' },
  h2: { fontSize: '2.5rem', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-.025em' },
  h3: { fontSize: '2rem', fontWeight: 500, lineHeight: 1.2, letterSpacing: '-.02em' },
  h4: { fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.25, letterSpacing: '-.02em' },
  h5: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.35, letterSpacing: '-.015em' },
  h6: uiTypography.cardTitle,
  body1: uiTypography.body,
  body2: uiTypography.smallText,
  subtitle1: { ...uiTypography.body, fontWeight: 500 },
  subtitle2: { ...uiTypography.smallText, fontWeight: 500 },
  button: { ...uiTypography.smallText, fontWeight: 500, textTransform: 'none' },
  caption: { fontSize: '.75rem', fontWeight: 400, lineHeight: 1.4 },
  overline: {
    fontSize: '.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '.04em',
    textTransform: 'uppercase',
  },
  label: {
    fontSize: '.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '.04em',
    textTransform: 'uppercase',
  },
  pixel: {
    fontFamily: displayFontFamily,
    fontFeatureSettings: '"ss01" 1',
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
  metric: {
    fontFamily: displayFontFamily,
    fontFeatureSettings: '"ss01" 1',
    fontVariantNumeric: 'tabular-nums',
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.2,
  },
});

export default createTypography;
