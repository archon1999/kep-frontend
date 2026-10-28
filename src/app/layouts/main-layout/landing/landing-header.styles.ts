import type { CSSObject } from '@mui/material/styles';

/** Component-scoped layout and decoration; shared controls use the MUI theme. */
export const landingHeaderStyles: CSSObject[] = [
  {
    '&.kep-landing-header, & .kep-landing-header': {
      position: 'fixed',
      inset: '0 0 auto',
      zIndex: '1100',
      height: 'var(--kep-header-height)',
      color: 'var(--kep-text)',
      background: 'color-mix(in srgb, var(--kep-bg) 92%, transparent)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--kep-line)',
    },
  },
  {
    '&.kep-landing-header-inner, & .kep-landing-header-inner': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      height: '100%',
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-page-width)',
      margin: '0 auto',
      padding: '0 var(--kep-content-inset)',
      borderInline: '1px solid var(--kep-line)',
    },
  },
  {
    '&.kep-landing-brand, & .kep-landing-brand': {
      flexShrink: '0',
    },
  },
  {
    '&.kep-landing-nav, & .kep-landing-nav': {
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      justifyContent: 'center',
      flex: '1',
    },
  },
  {
    '&.kep-landing-nav-link, & .kep-landing-nav-link': {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      minHeight: '44px',
      color: 'var(--kep-muted)',
      textDecoration: 'none',
      font: '400 14px/1.5 var(--kep-font-family)',
      whiteSpace: 'nowrap',
      position: 'relative',
      transition: 'color 0.2s ease',
      padding: '0 22px',
    },
  },
  {
    '&.kep-landing-nav-link + .kep-landing-nav-link:after, & .kep-landing-nav-link + .kep-landing-nav-link:after':
      {
        content: "''",
        position: 'absolute',
        left: '0',
        top: '50%',
        height: '20px',
        width: '1px',
        background: 'var(--kep-line)',
        transform: 'translateY(-50%)',
      },
  },
  {
    '&.kep-landing-nav-link > span:first-of-type, & .kep-landing-nav-link > span:first-of-type': {
      color: 'var(--kep-logo-ice)',
      transition: 'transform 0.4s ease',
      fontSize: '13px',
    },
  },
  {
    '&.kep-landing-nav-link:hover, & .kep-landing-nav-link:hover, &.kep-landing-nav-link:focus-visible, & .kep-landing-nav-link:focus-visible':
      {
        color: 'var(--kep-text)',
      },
  },
  {
    '&.kep-landing-nav-link:hover > span:first-of-type, & .kep-landing-nav-link:hover > span:first-of-type':
      {
        transform: 'rotate(90deg)',
      },
  },
  {
    '&.kep-landing-nav-link:focus-visible, & .kep-landing-nav-link:focus-visible': {
      outline: '2px solid var(--kep-logo-ice)',
      outlineOffset: '5px',
      borderRadius: '3px',
    },
  },
  {
    '&.kep-landing-header-actions, & .kep-landing-header-actions': {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      flexShrink: '0',
    },
  },
  {
    '&.kep-landing-header-actions .MuiButton-root, & .kep-landing-header-actions .MuiButton-root': {
      minWidth: '40px',
      height: '44px',
    },
  },
  {
    '&.kep-landing-header-actions .kep-landing-login, & .kep-landing-header-actions .kep-landing-login':
      {
        padding: '0 24px',
        marginLeft: '10px',
        fontSize: '14px',
      },
  },
  {
    '&.kep-landing-header-actions .kep-landing-menu-toggle, & .kep-landing-header-actions .kep-landing-menu-toggle':
      {
        display: 'none',
        width: '40px',
        height: '40px',
      },
  },
  {
    '&.kep-landing-main, & .kep-landing-main': {
      position: 'fixed',
      inset: 'var(--kep-header-height) 0 0',
      overflow: 'hidden',
      overscrollBehaviorY: 'contain',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--aurora-palette-background-elevation4) var(--kep-bg)',
      scrollPaddingTop: '24px',
    },
  },
  {
    '&.kep-landing-main .simplebar-content-wrapper, & .kep-landing-main .simplebar-content-wrapper':
      {
        scrollPaddingTop: '24px',
      },
  },
  {
    '&.kep-landing-main .simplebar-track.simplebar-vertical, & .kep-landing-main .simplebar-track.simplebar-vertical':
      {
        width: '6px',
        right: '2px',
      },
  },
  {
    '&.kep-landing-main .simplebar-scrollbar:before, & .kep-landing-main .simplebar-scrollbar:before':
      {
        insetInline: '0',
        borderRadius: '6px',
        background: 'var(--aurora-palette-background-elevation4)',
      },
  },
  {
    '&.kep-landing-main .simplebar-scrollbar.simplebar-visible:before, & .kep-landing-main .simplebar-scrollbar.simplebar-visible:before':
      {
        opacity: '0.8',
      },
  },
  {
    '&.kep-landing-skip, & .kep-landing-skip': {
      position: 'fixed',
      left: '16px',
      top: '8px',
      zIndex: '1600',
      padding: '12px 20px',
      background: 'var(--kep-panel)',
      color: 'var(--kep-text)',
      transform: 'translateY(-160%)',
    },
  },
  {
    '&.kep-landing-skip:focus, & .kep-landing-skip:focus': {
      transform: 'translateY(0)',
    },
  },
  {
    '&.kep-landing-menu-paper, & .kep-landing-menu-paper': {
      padding: '20px 24px 28px',
      background: 'var(--kep-panel)',
      borderBottom: '1px solid var(--kep-line)',
    },
  },
  {
    '&.kep-landing-menu-top, & .kep-landing-menu-top': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
    },
  },
  {
    '&.kep-landing-menu-paper nav, & .kep-landing-menu-paper nav': {
      marginBottom: '28px',
    },
  },
  {
    '&.kep-landing-menu-paper .kep-landing-nav-link, & .kep-landing-menu-paper .kep-landing-nav-link':
      {
        padding: '16px 0',
        borderBottom: '1px solid var(--kep-line)',
        fontSize: '18px',
        gap: '12px',
      },
  },
  {
    '&.kep-landing-menu-paper .kep-landing-nav-link:after, & .kep-landing-menu-paper .kep-landing-nav-link:after':
      {
        display: 'none',
      },
  },
  {
    '&.kep-landing-menu-arrow, & .kep-landing-menu-arrow': {
      marginLeft: 'auto',
      color: 'var(--kep-muted)',
    },
  },
  {
    '@media (max-width: 1150px)': {
      '&.kep-landing-nav, & .kep-landing-nav': {
        display: 'none',
      },
    },
  },
  {
    '@media (max-width: 1150px)': {
      '&.kep-landing-header-actions .kep-landing-menu-toggle, & .kep-landing-header-actions .kep-landing-menu-toggle':
        {
          display: 'inline-flex',
        },
    },
  },
  {
    '@media (max-width: 1150px)': {
      '&.kep-landing-header-inner, & .kep-landing-header-inner': {
        gap: '12px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-landing-header, & .kep-landing-header, &.kep-landing-header-inner, & .kep-landing-header-inner':
        {
          height: 'var(--kep-header-height)',
        },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-landing-header-inner, & .kep-landing-header-inner': {
        padding: '0 12px',
        gap: '8px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-landing-brand .MuiTypography-root, & .kep-landing-brand .MuiTypography-root': {
        fontSize: '28px',
        margin: '0 0 0 6px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-landing-brand .MuiSvgIcon-root, & .kep-landing-brand .MuiSvgIcon-root': {
        width: '26px',
        height: '26px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-landing-header-actions, & .kep-landing-header-actions': {
        gap: '0',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-landing-header-actions .kep-landing-login, & .kep-landing-header-actions .kep-landing-login':
        {
          padding: '0 12px',
          marginLeft: '2px',
        },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-landing-login .MuiButton-endIcon, & .kep-landing-login .MuiButton-endIcon': {
        display: 'none',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.kep-landing-nav-link, & .kep-landing-nav-link, &.kep-landing-nav-link > span:first-of-type, & .kep-landing-nav-link > span:first-of-type':
        {
          transition: 'none',
        },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.kep-landing-nav-link:hover > span:first-of-type, & .kep-landing-nav-link:hover > span:first-of-type':
        {
          transform: 'none',
        },
    },
  },
];
