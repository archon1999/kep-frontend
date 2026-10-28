import type { CSSObject } from '@mui/material/styles';
import { contentEntranceStyles } from './transitions';

export const pageHeaderStyles: CSSObject[] = [
  {
    '&.kep-page-hero, & .kep-page-hero': {
      position: 'relative',
      isolation: 'isolate',
      overflow: 'hidden',
      textAlign: 'center',
      background: 'var(--kep-bg)',
      color: 'var(--kep-text)',
      padding: '44px 24px 28px',
    },
  },
  {
    '&.kep-page-hero-pattern, & .kep-page-hero-pattern': {
      position: 'absolute',
      zIndex: '-1',
      inset: '0 0 auto',
      height: '180px',
      display: 'flex',
      pointerEvents: 'none',
      maskImage: 'linear-gradient(#000 15%, transparent 100%)',
    },
  },
  {
    '&.kep-page-hero-pattern::before, & .kep-page-hero-pattern::before, &.kep-page-hero-pattern::after, & .kep-page-hero-pattern::after':
      {
        content: "''",
        flex: '1',
        background: 'var(--kep-logo-ice)',
        maskImage: "url('/assets/theme/footer-dot-pattern.png')",
        maskMode: 'luminance',
        maskSize: '100% auto',
        maskPosition: 'center 40%',
        maskRepeat: 'no-repeat',
        opacity: '0.8',
      },
  },
  {
    '&.kep-page-hero-pattern::after, & .kep-page-hero-pattern::after': {
      background: 'var(--kep-logo-sand)',
    },
  },
  {
    '&.kep-page-hero-copy, & .kep-page-hero-copy': {
      position: 'relative',
      '& > *': contentEntranceStyles,
      '& > h1': { animationDelay: '45ms' },
      '& > p': { animationDelay: '90ms' },
    },
  },
  {
    '& .kep-page-hero-pattern-immersive': {
      inset: 0,
      height: '100%',
      maskImage: 'linear-gradient(#000, #000 12%, transparent 78%)',
      '&::before, &::after': {
        opacity: 0.4,
        maskImage: 'radial-gradient(circle, #000 0.7px, transparent 1px)',
        maskMode: 'alpha',
        maskSize: '5px 5px',
        maskRepeat: 'repeat',
      },
    },
    '& .kep-page-hero-pointer': {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background:
        'radial-gradient(320px circle at var(--pointer-x, 50%) var(--pointer-y, 30%), var(--kep-logo-ice), transparent 85%)',
      maskImage: 'radial-gradient(circle, #000 0.8px, transparent 1.2px)',
      maskSize: '5px 5px',
      opacity: 0,
      transition: 'opacity 350ms ease',
    },
    '@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)': {
      '.kep-page-hero-interactive:hover & .kep-page-hero-pointer': { opacity: 0.8 },
    },
    '@media (prefers-reduced-motion: reduce)': {
      '& .kep-page-hero-pointer': { display: 'none' },
    },
  },
  {
    '&.kep-page-hero-badge, & .kep-page-hero-badge': {
      textTransform: 'uppercase',
      display: 'inline-block',
      padding: '5px 12px',
      border: '1px solid color-mix(in srgb, var(--kep-logo-ice) 50%, var(--kep-line))',
      borderRadius: '999px',
      background: 'var(--kep-bg)',
      fontSize: '11px',
      lineHeight: '1.3',
      fontWeight: '500',
    },
  },
  {
    '&.kep-page-hero h1, & .kep-page-hero h1': {
      margin: '12px 0 14px',
      fontFamily: 'var(--kep-display-font)',
      fontSize: 'clamp(40px, 4.5vw, 64px)',
      fontWeight: '500',
      lineHeight: '1.1',
      letterSpacing: '-0.035em',
      fontVariantLigatures: 'normal',
      overflowWrap: 'anywhere',
    },
  },
  {
    '&.kep-page-hero .kep-page-hero-copy > p, & .kep-page-hero-copy > p': {
      fontFamily: 'var(--kep-reading-font)',
      maxWidth: '650px',
      margin: '0 auto',
      fontSize: '16px',
      lineHeight: '1.5',
      color: 'var(--kep-muted)',
      textWrap: 'balance',
    },
  },
  {
    '&.kep-page-hero-rule, & .kep-page-hero-rule': {
      position: 'relative',
      height: '28px',
      borderBlock: '1px solid var(--kep-line)',
      background: 'repeating-linear-gradient(90deg, transparent 0 17px, var(--kep-line) 17px 18px)',
    },
  },
  {
    '&.kep-page-hero-rule::before, & .kep-page-hero-rule::before, &.kep-page-hero-rule::after, & .kep-page-hero-rule::after':
      {
        content: "''",
        position: 'absolute',
        bottom: '-3px',
        width: '5px',
        height: '5px',
        background: 'var(--kep-text)',
      },
  },
  {
    '&.kep-page-hero-rule::before, & .kep-page-hero-rule::before': {
      left: '-3px',
    },
  },
  {
    '&.kep-page-hero-rule::after, & .kep-page-hero-rule::after': {
      right: '-3px',
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-page-hero, & .kep-page-hero': {
        padding: '36px 24px 24px',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-page-hero-pattern:not(.kep-page-hero-pattern-immersive), & .kep-page-hero-pattern:not(.kep-page-hero-pattern-immersive)':
        {
          height: '160px',
        },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-page-hero-pattern:not(.kep-page-hero-pattern-immersive)::before, & .kep-page-hero-pattern:not(.kep-page-hero-pattern-immersive)::before, &.kep-page-hero-pattern:not(.kep-page-hero-pattern-immersive)::after, & .kep-page-hero-pattern:not(.kep-page-hero-pattern-immersive)::after':
        {
          maskSize: 'cover',
        },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-page-hero-rule, & .kep-page-hero-rule': {
        height: '24px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-page-hero, & .kep-page-hero': {
        padding: '28px 16px 22px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-page-hero .kep-page-hero-copy > p, & .kep-page-hero-copy > p': {
        fontSize: '14px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-page-hero-rule, & .kep-page-hero-rule': {
        height: '20px',
      },
    },
  },
  {
    '& .kep-page-detail': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px 24px',
      textAlign: 'left',
      padding: '28px var(--kep-content-inset) 24px',
      '& h1': {
        margin: 0,
        fontSize: 'clamp(30px, 3.5vw, 48px)',
        color: 'transparent',
        background:
          'linear-gradient(105deg, var(--kep-logo-sand), var(--kep-logo-mid) 40%, var(--kep-logo-ice))',
        backgroundClip: 'text',
        width: 'fit-content',
        maxWidth: '100%',
      },
      '& .kep-page-hero-pattern': { opacity: 0.35 },
      '& .kep-page-hero-copy': { flex: '1 1 280px', minWidth: 0 },
      '& .kep-page-hero-copy > p': { margin: '12px 0 0', textWrap: 'pretty' },
      '& .kep-page-header-actions': { marginTop: 0, minWidth: 0, maxWidth: '100%' },
      '&.kep-page-header-with-navigation': {
        paddingBottom: 0,
        rowGap: '12px',
      },
      '& .kep-page-header-navigation': {
        flex: '1 0 100%',
        width: '100%',
        minWidth: 0,
        '@media (max-width: 599.95px)': { paddingBlock: '4px 16px' },
      },
      '& + .kep-page-hero-rule': { height: '12px' },
      '@media (max-width: 599.95px)': {
        paddingBlock: '20px 18px',
        gap: '14px',
        '& h1': { fontSize: 'clamp(26px, 6.2vw, 32px)', lineHeight: 1.2, overflowWrap: 'anywhere' },
        '& .kep-page-header-actions': { width: '100%' },
        '& .kep-page-header-actions > .MuiStack-root': { flexWrap: 'wrap', gap: '8px' },
        '& .kep-page-header-actions .MuiButton-root': { maxWidth: '100%', whiteSpace: 'normal' },
      },
    },
  },
];
