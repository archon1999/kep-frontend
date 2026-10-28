import type { CSSObject } from '@mui/material/styles';

/** Component-scoped layout and decoration; shared controls use the MUI theme. */
export const navMenuStyles: CSSObject[] = [
  {
    '&.MuiPaper-root.kep-nav-menu, & .MuiPaper-root.kep-nav-menu': {
      width: '264px',
      maxWidth: 'calc(100vw - 32px)',
      marginTop: '8px',
    },
  },
  {
    '&.kep-nav-menu::before, & .kep-nav-menu::before': {
      content: "''",
      position: 'absolute',
      inset: '0 0 auto',
      height: '2px',
      background: 'linear-gradient(90deg, var(--kep-logo-sand), var(--kep-logo-ice))',
    },
  },
  {
    '&.kep-nav-menu .MuiList-root, & .kep-nav-menu .MuiList-root': {
      padding: '0',
    },
  },
  {
    '&.kep-nav-menu .kep-nav-menu-heading, & .kep-nav-menu .kep-nav-menu-heading': {
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '18px 20px',
      color: 'var(--kep-muted)',
      font: '500 10px/1.4 var(--kep-font-family)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      fontFeatureSettings: "'ss01' 1",
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.kep-nav-menu-heading .kep-pixel-cross, & .kep-nav-menu-heading .kep-pixel-cross': {
      color: 'var(--kep-logo-ice)',
    },
  },
  {
    '&.kep-nav-menu .kep-nav-menu-item, & .kep-nav-menu .kep-nav-menu-item': {
      position: 'relative',
      minHeight: '50px',
      padding: '14px 20px',
      borderTop: '1px solid var(--kep-line)',
      borderRadius: '0',
      color: 'var(--kep-text)',
      font: '500 15px/1.4 var(--kep-font-family)',
      background: 'transparent',
    },
  },
  {
    '&.kep-nav-menu .kep-nav-menu-item:hover, & .kep-nav-menu .kep-nav-menu-item:hover, &.kep-nav-menu .kep-nav-menu-item.Mui-selected, & .kep-nav-menu .kep-nav-menu-item.Mui-selected, &.kep-nav-menu .kep-nav-menu-item.Mui-selected:hover, & .kep-nav-menu .kep-nav-menu-item.Mui-selected:hover, &.kep-nav-menu .kep-nav-menu-item.Mui-focusVisible, & .kep-nav-menu .kep-nav-menu-item.Mui-focusVisible':
      {
        background: 'transparent',
        color: 'var(--kep-logo-ice)',
      },
  },
  {
    '&.MuiPaper-root.kep-nav-menu-rich, & .MuiPaper-root.kep-nav-menu-rich': {
      width: '420px',
    },
  },
  {
    '&.kep-nav-menu-kicker, & .kep-nav-menu-kicker': {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
    },
  },
  {
    '&.kep-nav-menu-rich .kep-nav-menu-heading, & .kep-nav-menu-rich .kep-nav-menu-heading': {
      position: 'relative',
      isolation: 'isolate',
      overflow: 'hidden',
      minHeight: '138px',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '20px 24px',
    },
  },
  {
    '&.kep-nav-menu-intro, & .kep-nav-menu-intro': {
      minWidth: '0',
    },
  },
  {
    '&.kep-nav-menu-intro p, & .kep-nav-menu-intro p': {
      margin: '14px 0 0',
      maxWidth: '220px',
      font: '500 20px/1.25 var(--kep-font-family)',
      fontFeatureSettings: 'normal',
      color: 'var(--kep-text)',
      letterSpacing: '-0.025em',
      textTransform: 'none',
    },
  },
  {
    '&.kep-nav-illustration, & .kep-nav-illustration': {
      width: '144px',
      height: '90px',
      flexShrink: '0',
    },
  },
  {
    '&.kep-nav-menu-rich .kep-nav-menu-item, & .kep-nav-menu-rich .kep-nav-menu-item': {
      gap: '14px',
      padding: '16px 24px',
      minHeight: '80px',
      whiteSpace: 'normal',
    },
  },
  {
    '&.kep-nav-menu-icon, & .kep-nav-menu-icon': {
      display: 'grid',
      placeItems: 'center',
      width: '38px',
      height: '38px',
      flexShrink: '0',
      border: '1px solid var(--kep-line)',
      color: 'var(--kep-logo-ice)',
      fontSize: '21px',
    },
  },
  {
    '&.kep-nav-menu--battles .kep-nav-menu-icon, & .kep-nav-menu--battles .kep-nav-menu-icon': {
      color: 'var(--kep-logo-sand)',
    },
  },
  {
    '&.kep-nav-menu--competitions .kep-nav-menu-item:nth-of-type(odd) .kep-nav-menu-icon, & .kep-nav-menu--competitions .kep-nav-menu-item:nth-of-type(odd) .kep-nav-menu-icon':
      {
        color: 'var(--kep-logo-sand)',
      },
  },
  {
    '&.kep-nav-menu-copy, & .kep-nav-menu-copy': {
      display: 'grid',
      gap: '5px',
      minWidth: '0',
    },
  },
  {
    '&.kep-nav-menu-description, & .kep-nav-menu-description': {
      color: 'var(--kep-muted)',
      fontSize: '12px',
      lineHeight: '1.5',
      fontFeatureSettings: 'normal',
    },
  },
  {
    '&.kep-nav-menu-item::before, & .kep-nav-menu-item::before': {
      content: "''",
      position: 'absolute',
      inset: '12px auto 12px 0',
      width: '2px',
      background: 'linear-gradient(var(--kep-logo-sand), var(--kep-logo-ice))',
      opacity: '0',
    },
  },
  {
    '&.kep-nav-menu-item.Mui-selected::before, & .kep-nav-menu-item.Mui-selected::before, &.kep-nav-menu-item.Mui-focusVisible::before, & .kep-nav-menu-item.Mui-focusVisible::before':
      {
        opacity: '1',
      },
  },
  {
    '&.kep-nav-menu .kep-nav-menu-item.Mui-focusVisible, & .kep-nav-menu .kep-nav-menu-item.Mui-focusVisible':
      {
        outline: '1px solid var(--kep-logo-ice)',
        outlineOffset: '-4px',
      },
  },
];
