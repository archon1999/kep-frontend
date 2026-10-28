import type { CSSProperties } from 'react';
import { TypographyVariantsOptions } from '@mui/material/styles';
import { FontFamily, ThemePreset, initialConfig } from 'app/config.ts';
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

const createTypography = (
  fontFamily: FontFamily = initialConfig.fontFamily,
  fontSize: number = initialConfig.fontSize,
  preset: ThemePreset = initialConfig.themePreset,
): TypographyVariantsOptions => ({
  fontFamily: [`"${fontFamily}"`, '"Open Sans"', 'Arial', 'sans-serif'].join(', '),
  fontSize,
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
  label: {
    fontFamily: [`"${fontFamily}"`, '"Open Sans"', 'Arial', 'sans-serif'].join(', '),
    fontFeatureSettings: 'normal',
    fontSize: '.75rem',
    fontWeight: 600,
    letterSpacing: '.06em',
    lineHeight: 1.5,
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: preset === 'default' ? displayFontFamily : undefined,
    fontWeight: 700,
    fontSize: '3rem', // 48px
    lineHeight: 1.5,
  },
  h2: {
    fontFamily: preset === 'default' ? displayFontFamily : undefined,
    fontWeight: 700,
    fontSize: '2.625rem', // 42px
    lineHeight: 1.5,
  },
  h3: {
    fontFamily: preset === 'default' ? displayFontFamily : undefined,
    fontWeight: 700,
    fontSize: '2rem', // 32px
    lineHeight: 1.5,
  },
  h4: {
    fontFamily: preset === 'default' ? displayFontFamily : undefined,
    fontWeight: 700,
    fontSize: '1.75rem', // 28px
    lineHeight: 1.5,
  },
  h5: {
    fontFamily: preset === 'default' ? displayFontFamily : undefined,
    fontWeight: 700,
    fontSize: '1.5rem', // 24px
    lineHeight: 1.5,
  },
  h6: {
    fontFamily: preset === 'default' ? displayFontFamily : undefined,
    fontWeight: 700,
    fontSize: '1.3125rem', // 21px
    lineHeight: 1.4,
  },
  subtitle1: {
    fontWeight: 400,
    fontSize: '1rem', // 16px
    lineHeight: 1.3,
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.3,
  },
  body1: {
    fontWeight: 400,
    fontSize: '1rem', // 16px
    lineHeight: 1.6,
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.6,
  },
  button: {
    fontWeight: 700,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.286,
    textTransform: 'capitalize',
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem', // 12px
    lineHeight: 1.2,
  },
  overline: {
    fontWeight: 400,
    fontSize: '0.75rem', // 12px
    lineHeight: 1.2,
    textTransform: 'uppercase',
  },
  ...(preset === 'default' && {
    h1: {
      fontFamily: preset === 'default' ? displayFontFamily : undefined,
      fontWeight: 500,
      fontSize: '3rem',
      lineHeight: 1.1,
      fontVariantLigatures: 'normal',
      letterSpacing: 'normal',
    },
    h2: {
      fontFamily: preset === 'default' ? displayFontFamily : undefined,
      fontWeight: 500,
      fontSize: '2.625rem',
      lineHeight: 1.1,
      fontVariantLigatures: 'normal',
      letterSpacing: 'normal',
    },
    h3: {
      fontFamily: preset === 'default' ? displayFontFamily : undefined,
      fontWeight: 500,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-.025em',
    },
    h4: {
      fontFamily: preset === 'default' ? displayFontFamily : undefined,
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.25,
      letterSpacing: '-.02em',
    },
    h5: {
      fontFamily: preset === 'default' ? displayFontFamily : undefined,
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '-.015em',
    },
    h6: {
      fontFamily: preset === 'default' ? displayFontFamily : undefined,
      fontWeight: 500,
      fontSize: '1.3125rem',
      lineHeight: 1.4,
    },
    button: { fontWeight: 500, fontSize: '.875rem', lineHeight: 1.286, textTransform: 'none' },
  }),
});

export default createTypography;
