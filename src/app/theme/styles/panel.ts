import type { CSSObject, Theme } from '@mui/material/styles';
import { motion } from './transitions';

/** Flat content within an existing page frame; only the closing divider is drawn. */
export const sectionStyles = (theme: Theme): CSSObject => ({
  minWidth: 0,
  border: 0,
  borderBottom: `1px solid ${theme.vars.palette.divider}`,
  borderRadius: 0,
  outline: 'none',
  boxShadow: 'none',
  background: 'transparent',
  color: theme.vars.palette.text.primary,
});

/** Square, connected surfaces used by the reference list and reusable on other pages. */
export const panelStyles = (theme: Theme): CSSObject => ({
  position: 'relative',
  minWidth: 0,
  border: `1px solid ${theme.vars.palette.divider}`,
  borderRadius: 0,
  outline: 'none',
  boxShadow: 'none',
  background: theme.vars.palette.background.default,
  color: theme.vars.palette.text.primary,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-3px',
    zIndex: 2,
    pointerEvents: 'none',
    background: ['left top', 'right top', 'left bottom', 'right bottom']
      .map(
        (position) => `linear-gradient(currentColor, currentColor) ${position} / 5px 5px no-repeat`,
      )
      .join(', '),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 3,
    padding: '1px',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    background: 'linear-gradient(90deg, var(--kep-logo-ice), var(--kep-logo-sand))',
    opacity: 0,
    backgroundSize: '200% 100%',
    transition: `opacity 220ms ease, background-position 480ms ${motion.easing}`,
    pointerEvents: 'none',
  },
  '&:hover::after, &:focus-within::after, &[data-expanded="true"]::after': {
    opacity: 1,
    backgroundPosition: '100% 0',
  },
  [motion.reduced]: { '&::after': { transition: 'none' } },
});
