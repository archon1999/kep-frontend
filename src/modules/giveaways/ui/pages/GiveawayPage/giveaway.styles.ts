import type { CSSObject } from '@mui/material/styles';

/** Component-scoped layout and decoration; shared controls use the MUI theme. */
export const giveawayStyles: CSSObject[] = [
  {
    '&.giveaway-page, & .giveaway-page': {
      minHeight: '100%',
      backgroundImage:
        'radial-gradient( ellipse at 70% 0%, rgb(var(--aurora-palette-primary-mainChannel) / 0.06), transparent 55% )',
    },
  },
  {
    '&.giveaway-panel, & .giveaway-panel': {
      borderBottom: '1px solid var(--aurora-palette-divider)',
      borderRadius: 0,
      background: 'transparent',
    },
  },
  {
    '&.giveaway-stage, & .giveaway-stage': {
      position: 'relative',
      overflow: 'hidden',
      backgroundImage:
        'radial-gradient( ellipse at 50% 20%, rgb(var(--aurora-palette-primary-mainChannel) / 0.08), transparent 65% )',
    },
  },
  {
    '&.giveaway-eyebrow, & .giveaway-eyebrow': {
      fontSize: '11px !important',
      fontWeight: '800 !important',
      letterSpacing: '0.17em !important',
      textTransform: 'uppercase',
    },
  },
  {
    '&.giveaway-orb, & .giveaway-orb': {
      position: 'absolute',
      width: '350px',
      height: '350px',
      border: '1px solid rgb(var(--aurora-palette-primary-mainChannel) / 0.085)',
      borderRadius: '50%',
      top: '-160px',
      left: 'calc(50% - 175px)',
      boxShadow:
        '0 0 0 45px rgb(var(--aurora-palette-primary-mainChannel) / 0.025), 0 0 0 95px rgb(var(--aurora-palette-primary-mainChannel) / 0.016)',
    },
  },
  {
    '&.giveaway-prize-icon, & .giveaway-prize-icon': {
      width: '112px',
      height: '112px',
      margin: '24px auto 20px',
      display: 'grid',
      placeItems: 'center',
      borderRadius: 0,
      color: 'var(--aurora-palette-primary-main)',
      background:
        'linear-gradient( 135deg, rgb(var(--aurora-palette-primary-mainChannel) / 0.16), rgb(var(--aurora-palette-primary-mainChannel) / 0.035) )',
      border: '1px solid rgb(var(--aurora-palette-primary-mainChannel) / 0.25)',
      boxShadow: '0 16px 60px rgb(var(--aurora-palette-primary-mainChannel) / 0.1)',
    },
  },
  {
    '&.giveaway-countdown, & .giveaway-countdown': {
      fontSize: 'clamp(30px, 6vw, 52px)',
      fontWeight: '500',
      fontFamily: 'var(--kep-display-font)',
      fontFeatureSettings: '"ss01" 1',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '0.04em',
      padding: '12px 0 0',
    },
  },
  {
    '&.giveaway-countdown b, & .giveaway-countdown b': {
      opacity: '0.25',
      padding: '0 12px',
      fontWeight: '400',
    },
  },
  {
    '&.giveaway-wheel-stage, & .giveaway-wheel-stage': {
      padding: '20px 20px 8px',
    },
  },
  {
    '&.giveaway-wheel, & .giveaway-wheel': {
      position: 'relative',
      width: 'min(100%, 530px)',
      aspectRatio: '1',
      margin: '0 auto',
      borderRadius: '50%',
      background: 'var(--aurora-palette-background-elevation1)',
      boxShadow: '0 16px 48px #0002, 0 0 0 1px var(--kep-line)',
    },
  },
  {
    '&.giveaway-wheel-rim, & .giveaway-wheel-rim, &.giveaway-wheel-rotor, & .giveaway-wheel-rotor':
      {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
      },
  },
  {
    '&.giveaway-wheel-rotor, & .giveaway-wheel-rotor': {
      transformOrigin: '50% 50%',
      willChange: 'transform',
    },
  },
  {
    '&.giveaway-wheel-rotor svg, & .giveaway-wheel-rotor svg': {
      display: 'block',
      width: '100%',
      height: '100%',
      fontFamily: 'inherit',
    },
  },
  {
    '&.giveaway-wheel-pointer, & .giveaway-wheel-pointer': {
      zIndex: '3',
      position: 'absolute',
      left: 'calc(50% - 15px)',
      top: '-5px',
      width: '30px',
      height: '40px',
      background: 'linear-gradient(135deg, var(--kep-sand), var(--kep-ice))',
      clipPath: 'polygon(15% 0, 85% 0, 100% 35%, 50% 100%, 0 35%)',
      filter: 'drop-shadow(0 3px 3px #0005)',
    },
  },
  {
    '&.giveaway-wheel-hub, & .giveaway-wheel-hub': {
      position: 'absolute',
      inset: '41%',
      display: 'grid',
      placeItems: 'center',
      borderRadius: '50%',
      color: 'var(--kep-logo-sand)',
      background: 'var(--kep-bg)',
      border: '3px solid var(--kep-logo-ice)',
      boxShadow: '0 4px 18px #0003, inset 0 0 0 5px var(--kep-line)',
    },
  },
  {
    '&.giveaway-wheel-empty, & .giveaway-wheel-empty': {
      position: 'absolute',
      inset: '12%',
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.giveaway-result, & .giveaway-result': {
      position: 'relative',
      textAlign: 'center',
      padding: '40px 24px 24px',
    },
  },
  {
    '&.giveaway-confetti, & .giveaway-confetti': {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
    },
  },
  {
    '&.giveaway-confetti i, & .giveaway-confetti i': {
      position: 'absolute',
      top: '-15px',
      width: '7px',
      height: '12px',
      borderRadius: '2px',
      animation: 'giveaway-fall 2.8s ease-out both',
    },
  },
  {
    '@keyframes giveaway-fall': {
      from: {
        translate: '0 -15px',
        opacity: '1',
      },
      to: {
        translate: '30px 350px',
        rotate: '380deg',
        opacity: '0',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.giveaway-confetti, & .giveaway-confetti': {
        display: 'none',
      },
    },
  },
];
