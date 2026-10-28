import type { FontFamily } from './fonts';

const optionalFonts: Partial<Record<FontFamily, string>> = {
  'DM Sans': 'DM+Sans:wght@300;400;500;600;700;800',
  Manrope: 'Manrope:wght@400;500;600;700;800',
};

// The default font is local. Fetch an optional family only when selected or
// when its preview is visible in the customizer, never in the critical path.
export const loadReadingFont = (font: FontFamily, document: Document) => {
  const family = optionalFonts[font];
  if (!family) return;
  const id = `kep-reading-font-${font.replace(/ /g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  document.head.appendChild(link);
};
