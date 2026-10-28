import type { CSSObject } from '@mui/material/styles';

/** Component-scoped layout and decoration; shared controls use the MUI theme. */
export const foundationStyles: CSSObject[] = [
  {
    '.kep-landing-rails': {
      position: 'absolute',
      inset: '0',
      marginInline: 'auto',
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-page-width)',
      borderInline: '1px solid var(--kep-line)',
      pointerEvents: 'none',
      zIndex: '3',
    },
  },
  {
    '.kep-landing-rails:before,\n.kep-landing-rails:after': {
      content: "''",
      position: 'absolute',
      insetBlock: '0',
      width: '11px',
      background:
        'repeating-linear-gradient(to bottom, var(--kep-line) 0 1px, transparent 1px 16px)',
      opacity: '0.65',
    },
  },
  {
    '.kep-landing-rails:before': {
      left: '-20px',
    },
  },
  {
    '.kep-landing-rails:after': {
      right: '-20px',
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-landing-rails:before,\n  .kep-landing-rails:after': {
        width: '5px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-landing-rails:before': {
        left: '-11px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-landing-rails:after': {
        right: '-11px',
      },
    },
  },
  {
    '.kep-scramble': {
      display: 'inline-grid',
      whiteSpace: 'nowrap',
      verticalAlign: 'bottom',
      position: 'relative',
    },
  },
  {
    '.kep-scramble-size,\n.kep-scramble-visual': {
      gridArea: '1/1',
    },
  },
  {
    '.kep-scramble-size': {
      color: 'transparent',
      userSelect: 'none',
    },
  },
  {
    '.kep-scramble-visual': {
      position: 'absolute',
      inset: '0',
      color: 'inherit',
    },
  },
  {
    '.kep-reveal': {
      opacity: '1',
      transform: 'translateY(0)',
      transition:
        'opacity 0.65s ease var(--reveal-delay, 0ms), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms)',
    },
  },
  {
    '.kep-reveal-pending': {
      opacity: '0',
      transform: 'translateY(24px)',
    },
  },
  {
    '.kep-spotlight': {
      position: 'relative',
      isolation: 'isolate',
      transition: 'border-color 0.25s ease, transform 0.3s ease, box-shadow 0.3s ease',
    },
  },
  {
    '.kep-spotlight:before': {
      content: "''",
      position: 'absolute',
      inset: '0',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      background:
        'radial-gradient( 380px circle at var(--pointer-x, 50%) var(--pointer-y, 30%), color-mix(in srgb, var(--kep-logo-ice) 9%, transparent), transparent 72% )',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      zIndex: '-1',
    },
  },
  {
    '.kep-spotlight:hover:before,\n.kep-spotlight:focus-within:before': {
      opacity: '1',
    },
  },
  {
    '.kep-spotlight:hover': {
      borderColor: 'color-mix(in srgb, var(--kep-logo-ice) 40%, transparent)',
    },
  },
  {
    '.kep-pixel-cross,\n.kep-nav-item:before': {
      width: '16px',
      height: '16px',
      flexShrink: '0',
      display: 'inline-block',
      backgroundColor: 'currentColor',
      mask: "url('/assets/theme/pixel-cross.svg') center / contain no-repeat",
      verticalAlign: '-0.15em',
    },
  },
  {
    '.kep-nav-item:before': {
      content: "''",
      display: 'inline-block',
      fontSize: '17px',
      marginRight: '8px',
      color: 'var(--kep-muted)',
      transition: 'transform 0.3s ease, color 0.3s ease',
    },
  },
  {
    '.kep-nav-item:hover:before,\n.kep-nav-item:focus-visible:before': {
      transform: 'rotate(90deg)',
      color: 'var(--kep-ice)',
    },
  },
  {
    '.kep-nav-item,\n.kep-nav-item:hover,\n.kep-nav-item.active,\n.kep-nav-item.Mui-focusVisible': {
      background: 'transparent',
      boxShadow: 'none',
    },
  },
  {
    '.kep-nav-item.Mui-focusVisible': {
      outline: '1px solid var(--kep-logo-ice)',
      outlineOffset: '-2px',
    },
  },
  {
    '.kep-cta': {
      position: 'relative',
      isolation: 'isolate',
    },
  },
  {
    '.kep-cta:after': {
      content: "''",
      position: 'absolute',
      inset: '0',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      background: 'linear-gradient(110deg, transparent 35%, #fff8 50%, transparent 65%)',
      backgroundSize: '300% 100%',
      backgroundPosition: '100% 0',
      opacity: '0',
      transition: 'background-position 0.65s ease, opacity 0.2s ease',
    },
  },
  {
    '.kep-cta:hover:after,\n.kep-cta:focus-visible:after': {
      backgroundPosition: '0 0',
      opacity: '1',
    },
  },
  {
    '.kep-cta .MuiButton-endIcon': {
      transition: 'transform 0.25s ease',
    },
  },
  {
    '.kep-cta:hover .MuiButton-endIcon': {
      transform: 'translateX(4px)',
    },
  },
  {
    '@keyframes kep-float': {
      '0%,\n  100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-12px)',
      },
    },
  },
  {
    '.kep-footer': {
      borderTop: '1px solid var(--kep-line)',
      background: 'var(--kep-bg)',
      color: 'var(--kep-text)',
      overflow: 'hidden',
    },
  },
  {
    '.kep-footer-content': {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '40px',
    },
  },
  {
    '.kep-footer-brand > p': {
      fontSize: '13px',
      color: 'var(--kep-muted)',
      maxWidth: '270px',
      lineHeight: '1.7',
      margin: '15px 0',
    },
  },
  {
    '.kep-footer-brand small': {
      fontSize: '11px',
      color: 'var(--kep-muted)',
    },
  },
  {
    '.kep-footer-home .kep-footer-content': {
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-page-width)',
      alignItems: 'flex-start',
      paddingTop: '65px',
      paddingBottom: '55px',
      paddingInline: 'var(--kep-content-inset)',
    },
  },
  {
    '.kep-footer nav': {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      minWidth: '0',
      maxWidth: '200px',
    },
  },
  {
    '.kep-footer nav h2': {
      fontSize: '14px',
      fontWeight: '500',
      margin: '0 0 6px',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '.kep-footer a': {
      color: 'var(--kep-muted)',
      textDecoration: 'none',
      fontSize: '12px',
    },
  },
  {
    '.kep-footer a:hover': {
      color: 'var(--kep-text)',
    },
  },
  {
    '.kep-footer nav .kep-scramble': {
      whiteSpace: 'normal',
    },
  },
  {
    '.kep-footer-wordmark': {
      fontVariant: 'normal',
      fontFamily: "'Alpha Lyrae', 'Open Sans', sans-serif",
      fontSize: 'clamp(100px, 24vw, 380px)',
      lineHeight: '1',
      letterSpacing: '-0.07em',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      color: 'var(--kep-text)',
      opacity: '0.08',
      margin: '0 0 -3vw',
      pointerEvents: 'none',
    },
  },
  {
    '.kep-footer-compact-links': {
      display: 'flex',
      gap: '22px',
      flexWrap: 'wrap',
    },
  },
  {
    '.kep-footer:not(.kep-footer-home) .kep-footer-brand > p': {
      display: 'none',
    },
  },
  {
    '.kep-footer:not(.kep-footer-home) .kep-footer-content': {
      height: '56px',
      padding: '8px 24px',
      gap: '20px',
    },
  },
  {
    '.kep-footer:not(.kep-footer-home) .kep-footer-brand': {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
  },
  {
    '.kep-header-login': {
      background: 'var(--kep-text)',
      color: 'var(--kep-bg)',
      borderRadius: '999px',
      boxShadow: 'none',
    },
  },
  {
    '.kep-header-login:hover': {
      background: 'var(--aurora-palette-text-secondary)',
      boxShadow: '0 0 20px #93d7e220',
    },
  },
  {
    '.kep-topnav': {
      overflowY: 'auto',
      scrollbarGutter: 'stable',
    },
  },
  {
    '.kep-topnav-inner': {
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-page-width)',
      marginInline: 'auto',
      paddingInline: 'var(--kep-content-inset)',
      borderInline: '1px solid var(--kep-line)',
    },
  },
  {
    '.kep-topnav-inner .nav-items': {
      marginInlineStart: '20px',
      gap: '12px',
    },
  },
  {
    '.kep-topnav-inner .kep-nav-item': {
      paddingInline: '10px',
    },
  },
  {
    '.action-items': {
      gap: '10px',
    },
  },
  {
    '.action-items > *': {
      marginInline: '0',
    },
  },
  {
    '.action-items > .MuiButton-root,\n.action-items .search-box-button': {
      height: '40px',
      minWidth: '40px',
      padding: '8px',
      borderRadius: '999px',
      border: '0',
      background: 'color-mix(in srgb, var(--kep-text) 7%, var(--kep-bg))',
      color: 'var(--kep-text)',
      boxShadow: 'none',
    },
  },
  {
    '.action-items > :has(> .search-box-button)': {
      padding: '0',
      width: '40px',
    },
  },
  {
    ".action-items .MuiButton-root[shape='circle']": {
      width: '40px',
    },
  },
  {
    '.action-items > .MuiButton-root:hover,\n.action-items .search-box-button:hover': {
      background: 'color-mix(in srgb, var(--kep-text) 12%, var(--kep-bg))',
      boxShadow: 'none',
    },
  },
  {
    '.action-items > :is(.kepcoin-menu-trigger, .daily-tasks-menu-trigger)': {
      paddingInline: '12px',
      fontVariantNumeric: 'tabular-nums',
    },
  },
  {
    '.action-items :is(.kepcoin-menu-trigger, .daily-tasks-menu-trigger) .MuiTypography-root': {
      fontFeatureSettings: "'ss01' 1",
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '.action-items > .MuiButton-root:has(.MuiAvatar-root)': {
      padding: '0',
      background: 'transparent',
      border: '0',
      boxShadow: 'none',
    },
  },
  {
    '@media (max-width: 599px)': {
      '.action-items': {
        gap: '6px',
      },
    },
  },
  {
    '@media (max-width: 599px)': {
      '.action-items > .MuiButton-root': {
        height: '36px',
        minWidth: '36px',
        padding: '6px',
      },
    },
  },
  {
    '@media (max-width: 599px)': {
      ".action-items .MuiButton-root[shape='circle']": {
        width: '36px',
      },
    },
  },
  {
    '@media (max-width: 599px)': {
      '.action-items > :is(.kepcoin-menu-trigger, .daily-tasks-menu-trigger)': {
        paddingInline: '0',
      },
    },
  },
  {
    '@media (max-width: 380px)': {
      '.kep-topnav .kep-topnav-inner': { paddingInline: '8px' },
      '.action-items': { gap: '2px' },
      '.action-items > .MuiButton-root': { height: '32px', minWidth: '32px', padding: '4px' },
      ".action-items .MuiButton-root[shape='circle'], .action-items > :is(.kepcoin-menu-trigger, .daily-tasks-menu-trigger)":
        { width: '32px', minWidth: '32px' },
      '.action-items .MuiAvatar-root': { width: '32px', height: '32px' },
    },
  },
  {
    '@media (max-width: 800px)': {
      '.kep-footer-home .kep-footer-content': {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '30px',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '.kep-footer-home .kep-footer-brand': {
        gridColumn: '1/-1',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '.kep-footer nav': {
        maxWidth: 'none',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-footer-home .kep-footer-content': {
        gridTemplateColumns: '1fr 1fr',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-footer-brand': {
        gridColumn: '1/-1',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-footer-compact-links': {
        justifyContent: 'center',
        gap: '15px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-footer:not(.kep-footer-home) .kep-footer-brand > a': {
        display: 'none',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-footer:not(.kep-footer-home) .kep-footer-content': {
        paddingInline: '16px',
        gap: '12px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-footer-compact-links': {
        gap: '10px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '.kep-footer-compact-links a': {
        fontSize: '11px',
      },
    },
  },
  {
    '@keyframes kep-turn': {
      to: {
        transform: 'rotate(360deg)',
      },
    },
  },
  {
    '@keyframes kep-flow': {
      to: {
        transform: 'translateX(-50%)',
      },
    },
  },
  {
    '@keyframes kep-pulse': {
      '0%,\n  100%': {
        opacity: '0.3',
      },
      '50%': {
        opacity: '1',
      },
    },
  },
  {
    '@keyframes kep-pixel': {
      '0%,\n  94%,\n  100%': {
        filter: 'none',
        transform: 'none',
      },
      '95%': {
        filter: 'drop-shadow(2px 0 var(--kep-logo-ice))',
        transform: 'translateX(-1px)',
      },
      '96%': {
        filter: 'drop-shadow(-2px 0 var(--kep-logo-sand))',
        transform: 'translateX(1px)',
      },
      '97%': {
        filter: 'none',
        transform: 'none',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '.kep-reveal': {
        opacity: '1 !important',
        transform: 'none !important',
        transition: 'none !important',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '.kep-spotlight,\n  .kep-spotlight:before,\n  .kep-cta:after,\n  .kep-nav-item:before': {
        transition: 'none !important',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '.kep-home *,\n  .kep-home *:before,\n  .kep-home *:after': {
        animation: 'none !important',
        scrollBehavior: 'auto !important',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '.kep-cta:hover,\n  .kep-spotlight:hover': {
        transform: 'none !important',
      },
    },
  },
];
