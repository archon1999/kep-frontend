import type { CSSObject } from '@mui/material/styles';

/** Component-scoped layout and decoration; shared controls use the MUI theme. */
export const landingFooterStyles: CSSObject[] = [
  {
    '&.kep-footer.kep-footer-home, & .kep-footer.kep-footer-home': {
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-page-width)',
      marginInline: 'auto',
      borderInline: '1px solid var(--kep-line)',
      containerType: 'inline-size',
      overflow: 'hidden',
      fontFamily: 'var(--kep-font-family)',
    },
  },
  {
    '&.kep-footer-home::before, & .kep-footer-home::before, &.kep-footer-home::after, & .kep-footer-home::after':
      {
        content: "''",
        display: 'block',
        height: '36px',
        background:
          'repeating-linear-gradient(90deg, transparent 0 17px, var(--kep-line) 17px 18px)',
        borderBottom: '1px solid var(--kep-line)',
      },
  },
  {
    '&.kep-footer-home::after, & .kep-footer-home::after': {
      height: 'clamp(50px, 9.5cqw, 143px)',
      borderTop: '1px solid var(--kep-line)',
      borderBottom: '0',
    },
  },
  {
    '&.kep-footer.kep-footer-home .kep-footer-content, & .kep-footer.kep-footer-home .kep-footer-content':
      {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2.9fr) repeat(3, minmax(0, 1fr))',
        alignItems: 'stretch',
        gap: '0',
        width: '100%',
        maxWidth: 'none',
        padding: '0',
      },
  },
  {
    '&.kep-footer-home .kep-footer-brand, & .kep-footer-home .kep-footer-brand': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '34px var(--kep-content-inset)',
      minWidth: '0',
    },
  },
  {
    '&.kep-footer-home .kep-footer-brand > p, & .kep-footer-home .kep-footer-brand > p': {
      maxWidth: '400px',
      fontSize: '15px',
      margin: '14px 0 40px',
    },
  },
  {
    '&.kep-footer-brand-bottom, & .kep-footer-brand-bottom': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      width: '100%',
      marginTop: 'auto',
    },
  },
  {
    '&.kep-footer-home .kep-footer-brand small, & .kep-footer-home .kep-footer-brand small': {
      fontSize: '13px',
    },
  },
  {
    '&.kep-footer-socials, & .kep-footer-socials': {
      display: 'flex',
      gap: '10px',
    },
  },
  {
    '&.kep-footer-home .kep-footer-socials a, & .kep-footer-home .kep-footer-socials a': {
      display: 'grid',
      placeItems: 'center',
      width: '40px',
      height: '40px',
      border: '1px solid var(--kep-line)',
      borderRadius: '50%',
      color: 'var(--kep-text)',
      fontSize: '19px',
      transition:
        'color 220ms ease, border-color 220ms ease, background 220ms ease, transform 220ms ease, box-shadow 220ms ease',
    },
  },
  {
    '&.kep-footer-home .kep-footer-socials a:hover, & .kep-footer-home .kep-footer-socials a:hover, &.kep-footer-home .kep-footer-socials a:focus-visible, & .kep-footer-home .kep-footer-socials a:focus-visible':
      {
        color: 'var(--kep-accent-ink)',
        background: 'linear-gradient(120deg, var(--kep-sand), var(--kep-ice))',
        borderColor: 'var(--kep-ice)',
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 24px color-mix(in srgb, var(--kep-logo-ice) 15%, transparent)',
      },
  },
  {
    '&.kep-footer-home a:focus-visible, & .kep-footer-home a:focus-visible': {
      outline: '2px solid var(--kep-ice)',
      outlineOffset: '5px',
    },
  },
  {
    '&.kep-footer.kep-footer-home nav, & .kep-footer.kep-footer-home nav': {
      maxWidth: 'none',
      padding: '36px 24px',
      borderLeft: '1px solid var(--kep-line)',
      gap: '16px',
    },
  },
  {
    '&.kep-footer-home nav h2, & .kep-footer-home nav h2': {
      fontSize: '17px',
      marginBottom: '16px',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.kep-footer-home nav a, & .kep-footer-home nav a': {
      display: 'flex',
      alignItems: 'baseline',
      gap: '7px',
      fontSize: '13px',
      lineHeight: '1.5',
    },
  },
  {
    '&.kep-footer-link-star, & .kep-footer-link-star': {
      display: 'inline-block',
      flexShrink: '0',
      transition: 'transform 350ms ease, color 250ms ease',
    },
  },
  {
    '&.kep-footer-home nav a:hover .kep-footer-link-star, & .kep-footer-home nav a:hover .kep-footer-link-star, &.kep-footer-home nav a:focus-visible .kep-footer-link-star, & .kep-footer-home nav a:focus-visible .kep-footer-link-star':
      {
        transform: 'rotate(90deg)',
        color: 'var(--kep-ice)',
      },
  },
  {
    '&.kep-footer-signature, & .kep-footer-signature': {
      borderTop: '1px solid var(--kep-line)',
      aspectRatio: '1180 / 300',
    },
  },
  {
    '&.kep-footer-home .kep-footer-wordmark, & .kep-footer-home .kep-footer-wordmark': {
      display: 'block',
      width: '100%',
      height: 'auto',
      overflow: 'hidden',
      fontFamily: "'Alpha Lyrae', 'Open Sans', sans-serif",
      fontWeight: '500',
      fontSize: '340px',
      letterSpacing: '0',
      opacity: '1',
      margin: '0',
      padding: '0',
      pointerEvents: 'auto',
    },
  },
  {
    '&.kep-footer-gradient-start, & .kep-footer-gradient-start': {
      stopColor: 'var(--kep-logo-sand)',
    },
  },
  {
    '&.kep-footer-gradient-mid, & .kep-footer-gradient-mid': {
      stopColor: 'var(--kep-logo-mid)',
    },
  },
  {
    '&.kep-footer-gradient-end, & .kep-footer-gradient-end': {
      stopColor: 'var(--kep-logo-ice)',
    },
  },
  {
    '&.kep-footer-gradient-mid, & .kep-footer-gradient-mid': {
      animation: 'kep-footer-shimmer 8s ease-in-out infinite alternate',
    },
  },
  {
    '&.kep-footer-pixel-letter, & .kep-footer-pixel-letter': {
      fontFeatureSettings: "'ss01' 1",
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.kep-footer-wordmark > text, & .kep-footer-wordmark > text': {
      animation: 'kep-footer-float 3.8s ease-in-out infinite',
    },
  },
  {
    '@keyframes kep-footer-float': {
      '0%,\n  100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-32px)',
      },
    },
  },
  {
    '@keyframes kep-footer-shimmer': {
      to: {
        stopColor: 'var(--kep-logo-ice)',
      },
    },
  },
  {
    '&.kep-footer-dot-field, & .kep-footer-dot-field': {
      display: 'flex',
      height: 'clamp(28px, 2.1vw, 40px)',
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-page-width)',
      marginInline: 'auto',
      pointerEvents: 'none',
      overflow: 'hidden',
    },
  },
  {
    '&.kep-footer-dot-field::before, & .kep-footer-dot-field::before, &.kep-footer-dot-field::after, & .kep-footer-dot-field::after':
      {
        content: "''",
        flex: '1',
        background: 'var(--kep-logo-ice)',
        maskImage: "url('/assets/theme/footer-dot-pattern.png')",
        maskMode: 'luminance',
        maskSize: '100% auto',
        maskPosition: 'center 46%',
        maskRepeat: 'no-repeat',
      },
  },
  {
    '&.kep-footer-dot-field::after, & .kep-footer-dot-field::after': {
      background: 'var(--kep-logo-sand)',
    },
  },
  {
    '@media (max-width: 1100px)': {
      '&.kep-footer.kep-footer-home .kep-footer-content, & .kep-footer.kep-footer-home .kep-footer-content':
        {
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        },
    },
  },
  {
    '@media (max-width: 1100px)': {
      '&.kep-footer-home .kep-footer-brand, & .kep-footer-home .kep-footer-brand': {
        gridColumn: '1 / -1',
        borderBottom: '1px solid var(--kep-line)',
      },
    },
  },
  {
    '@media (max-width: 1100px)': {
      '&.kep-footer-home .kep-footer-brand > p, & .kep-footer-home .kep-footer-brand > p': {
        marginBottom: '24px',
      },
    },
  },
  {
    '@media (max-width: 1100px)': {
      '&.kep-footer-home nav:first-of-type, & .kep-footer-home nav:first-of-type': {
        borderLeft: '0',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-footer.kep-footer-home nav, & .kep-footer.kep-footer-home nav': {
        padding: '24px 12px',
        gap: '14px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-footer-home nav h2, & .kep-footer-home nav h2': {
        fontSize: '13px',
        marginBottom: '10px',
        fontFamily: 'var(--kep-display-font)',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-footer-home nav a, & .kep-footer-home nav a': {
        fontSize: '11px',
        gap: '4px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-footer-home .kep-footer-brand, & .kep-footer-home .kep-footer-brand': {
        paddingBlock: '26px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-footer-home .kep-footer-brand > p, & .kep-footer-home .kep-footer-brand > p': {
        fontSize: '14px',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.kep-footer-wordmark > text, & .kep-footer-wordmark > text, &.kep-footer-gradient-mid, & .kep-footer-gradient-mid, &.kep-footer-pixel-letter, & .kep-footer-pixel-letter':
        {
          animation: 'none',
        },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.kep-footer-home .kep-footer-socials a, & .kep-footer-home .kep-footer-socials a, &.kep-footer-link-star, & .kep-footer-link-star':
        {
          transition: 'none',
        },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.kep-footer-home .kep-footer-socials a:hover, & .kep-footer-home .kep-footer-socials a:hover, &.kep-footer-home .kep-footer-socials a:focus-visible, & .kep-footer-home .kep-footer-socials a:focus-visible, &.kep-footer-home nav a:hover .kep-footer-link-star, & .kep-footer-home nav a:hover .kep-footer-link-star, &.kep-footer-home nav a:focus-visible .kep-footer-link-star, & .kep-footer-home nav a:focus-visible .kep-footer-link-star':
        {
          transform: 'none',
        },
    },
  },
];
