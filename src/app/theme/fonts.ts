export const fontFamilies = ['Open Sans', 'Plus Jakarta Sans', 'DM Sans', 'Manrope'] as const;
export type FontFamily = (typeof fontFamilies)[number];
export const defaultFontFamily: FontFamily = 'Plus Jakarta Sans';

export const displayFontFamily = '"Alpha Lyrae", "Open Sans", Arial, sans-serif';
export const readingFontFamily = '"Plus Jakarta Sans", "Open Sans", Arial, sans-serif';

/** The preference controls reading text; pixel display typography is a separate role. */
export const normalizeFontFamily = (value: unknown): FontFamily =>
  fontFamilies.includes(value as FontFamily) ? (value as FontFamily) : defaultFontFamily;

export const fontFaces = [
  {
    fontFamily: 'JetBrains Mono',
    src: 'url("/assets/theme/jetbrains-mono.woff2") format("woff2")',
    fontWeight: 400,
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    fontFamily: 'Plus Jakarta Sans',
    src: 'url("/assets/theme/plus-jakarta-sans-variable.woff2") format("woff2")',
    fontWeight: '200 800',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    fontFamily: 'Alpha Lyrae',
    src: 'url("/assets/theme/alpha-lyrae.woff2") format("woff2")',
    fontWeight: 500,
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    fontFamily: 'Open Sans',
    src: 'url("/assets/theme/open-sans-variable.woff2") format("woff2")',
    fontWeight: '300 800',
    fontStyle: 'normal',
    fontDisplay: 'swap',
  },
  {
    fontFamily: 'Open Sans',
    src: 'url("/assets/theme/open-sans-italic-variable.woff2") format("woff2")',
    fontWeight: '300 800',
    fontStyle: 'italic',
    fontDisplay: 'swap',
  },
] as const;
