import type { Theme } from '@mui/material/styles';
import { motion } from './transitions';

/** Shared surface for anchored menus, pickers and popovers. */
export const overlayPaperStyles = (theme: Theme) => ({
  borderRadius: 0,
  border: `1px solid ${theme.vars.palette.divider}`,
  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.background.default,
  backgroundImage: 'linear-gradient(90deg, var(--kep-logo-sand), var(--kep-logo-ice))',
  backgroundSize: '100% 2px',
  backgroundRepeat: 'no-repeat',
  boxShadow: '0 12px 32px #0002',
  maxWidth: 'calc(100vw - 32px)',
});

export const overlayOptionStyles = (theme: Theme) => ({
  ...theme.typography.body2,
  minHeight: 40,
  padding: '10px 16px',
  borderRadius: 0,
  whiteSpace: 'normal' as const,
  overflowWrap: 'anywhere' as const,
  color: theme.vars.palette.text.primary,
  '&:hover, &.Mui-focusVisible, &.Mui-focused': {
    color: theme.vars.palette.primary.main,
    backgroundColor: theme.vars.palette.action.hover,
  },
  transition: motion.interaction,
  [motion.reduced]: { transition: 'none' },
  '&.Mui-selected, &[aria-selected="true"]': {
    color: theme.vars.palette.primary.main,
    backgroundColor: theme.vars.palette.action.selected,
    '&:hover, &.Mui-focused': { backgroundColor: theme.vars.palette.action.selected },
  },
});

/** Shared form treatment for anchored filters and dialogs. */
export const overlayFormStyles = (theme: Theme) => ({
  '& .MuiInputBase-root': {
    borderRadius: 0,
    backgroundColor: theme.vars.palette.background.default,
  },
  '& .MuiFilledInput-root': { border: `1px solid ${theme.vars.palette.divider}` },
  '& .MuiFilledInput-root::before, & .MuiFilledInput-root::after': { display: 'none' },
  '& .MuiInputLabel-root': { color: theme.vars.palette.text.secondary },
  '& .MuiToggleButtonGroup-root': {
    borderRadius: 0,
    background: 'transparent',
    padding: 0,
    gap: '6px',
  },
  '& .MuiToggleButtonGroup-root .MuiToggleButton-root': {
    borderRadius: 0,
    margin: 0,
    boxShadow: `inset 0 0 0 1px ${theme.vars.palette.divider}`,
    flex: '1 1 0',
    minWidth: 0,
    width: 'auto',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    lineHeight: 1.4,
    fontSize: 11,
    minHeight: 38,
    paddingInline: '8px',
  },
});

export const filterPopoverStyles = (theme: Theme) => ({
  width: 380,
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  maxWidth: 'calc(100vw - 32px)',
  maxHeight: 'calc(100dvh - 32px)',
  mt: 1,
  borderTop: 0,
  '&::before': {
    content: '""',
    display: 'block',
    height: 2,
    flexShrink: 0,
    background: 'linear-gradient(90deg, var(--kep-logo-sand), var(--kep-logo-ice))',
  },
  ...overlayFormStyles(theme),
});
