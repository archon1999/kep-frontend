import type { CSSObject } from '@mui/material/styles';

export const listFrameStyles: CSSObject = {
  position: 'relative',
  width: 'calc(100% - var(--kep-page-gutter) * 2)',
  maxWidth: 'var(--kep-page-width)',
  margin: '0 auto 40px',
  borderInline: '1px solid var(--kep-line)',
  borderBottom: '1px solid var(--kep-line)',
  fontFamily: 'var(--kep-reading-font)',
  '&::before, &::after': {
    content: "''",
    position: 'absolute',
    insetBlock: 0,
    width: 10,
    pointerEvents: 'none',
    background: 'repeating-linear-gradient(to bottom, var(--kep-line) 0 1px, transparent 1px 16px)',
  },
  '&::before': { left: -20 },
  '&::after': { right: -20 },
  '@media (max-width: 540px)': {
    '&::before': { left: -11, width: 5 },
    '&::after': { right: -11, width: 5 },
  },
};

export const listContentStyles: CSSObject = {
  position: 'relative',
  padding: 0,
  '&::after': {
    content: "''",
    position: 'absolute',
    insetInline: -3,
    bottom: -3,
    height: 5,
    pointerEvents: 'none',
    background:
      'linear-gradient(var(--kep-text), var(--kep-text)) left / 5px 5px no-repeat, linear-gradient(var(--kep-text), var(--kep-text)) right / 5px 5px no-repeat',
  },
};

export const listRuleStyles: CSSObject = {
  height: 8,
  flexShrink: 0,
  borderBlock: '1px solid var(--kep-line)',
  background: 'repeating-linear-gradient(90deg, transparent 0 17px, var(--kep-line) 17px 18px)',
};
