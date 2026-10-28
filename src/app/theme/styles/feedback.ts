import type { Theme } from '@mui/material/styles';
import { motion } from './transitions';

export type FeedbackTone = 'primary' | 'neutral' | 'success' | 'info' | 'warning' | 'error';

/** Status uses the accent; the message stays on the same surface as the rest of the UI. */
export const feedbackSurfaceStyles = (theme: Theme, tone: FeedbackTone = 'primary') => ({
  borderRadius: theme.preset === 'default' ? 0 : theme.shape.borderRadius,
  border: `1px solid ${theme.vars.palette.divider}`,
  borderInlineStart: `3px solid ${theme.vars.palette[tone].main}`,
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette[tone].main} 4%, ${theme.vars.palette.background.paper})`,
  backgroundImage: 'none',
  color: theme.vars.palette.text.primary,
  boxShadow: 'none',
});

export const toastStyles = (theme: Theme) => ({
  '[data-sonner-toaster].kep-toaster': {
    fontFamily: theme.typography.fontFamily,
    zIndex: theme.zIndex.tooltip + 2,
    '--width': 'min(380px, calc(100vw - 32px))',
    '--normal-bg': theme.vars.palette.background.paper,
    '--normal-border': theme.vars.palette.divider,
    '--normal-text': theme.vars.palette.text.primary,
  },
  '[data-sonner-toaster].kep-toaster [data-sonner-toast][data-styled="true"]': {
    ...feedbackSurfaceStyles(theme),
    '--kep-feedback-color': theme.vars.palette.primary.main,
    borderInlineStartColor: 'var(--kep-feedback-color)',
    backgroundColor: `color-mix(in srgb, var(--kep-feedback-color) 4%, ${theme.vars.palette.background.paper})`,
    ...theme.typography.body2,
    minHeight: 64,
    padding: '14px 40px 14px 14px',
    gap: 12,
    flexWrap: 'wrap' as const,
    maxWidth: 'calc(100vw - 32px)',
    boxShadow: '0 8px 24px #0002',
    ...Object.fromEntries(
      (['success', 'info', 'warning', 'error'] as const).map((tone) => [
        `&[data-type="${tone}"]`,
        { '--kep-feedback-color': theme.vars.palette[tone].main },
      ]),
    ),
    '& [data-icon]': {
      width: 32,
      height: 32,
      margin: 0,
      color: 'var(--kep-feedback-color)',
      backgroundColor: 'color-mix(in srgb, var(--kep-feedback-color) 12%, transparent)',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      '& svg': { width: 20, height: 20, margin: 0 },
    },
    '& [data-content]': { flex: '1 1 160px', minWidth: 0, gap: 4 },
    '& [data-title]': { fontWeight: 600, lineHeight: 1.5 },
    '& [data-description]': {
      ...theme.typography.caption,
      color: theme.vars.palette.text.secondary,
      lineHeight: 1.5,
    },
    '& [data-close-button]': {
      insetInlineStart: 'auto',
      insetInlineEnd: 6,
      top: 6,
      transform: 'none',
      width: 28,
      height: 28,
      border: 0,
      borderRadius: 0,
      color: theme.vars.palette.text.secondary,
      background: 'transparent',
      '&:hover': {
        background: theme.vars.palette.action.hover,
        color: theme.vars.palette.text.primary,
      },
    },
    '& [data-button]': {
      fontFamily: 'inherit',
      fontSize: theme.typography.caption.fontSize,
      fontWeight: 600,
      lineHeight: 1.5,
      minHeight: 30,
      height: 'auto',
      padding: '5px 12px',
      margin: 0,
      marginInlineStart: 44,
      borderRadius: 999,
      background: theme.vars.palette.primary.main,
      color: theme.vars.palette.primary.contrastText,
      '&:hover': { opacity: 0.85 },
    },
    '& [data-cancel]': {
      background: 'transparent',
      border: `1px solid ${theme.vars.palette.divider}`,
      color: theme.vars.palette.text.secondary,
    },
    '&:focus-visible, & [data-close-button]:focus-visible, & [data-button]:focus-visible': {
      outline: `2px solid ${theme.vars.palette.primary.main}`,
      outlineOffset: 2,
      boxShadow: 'none',
    },
    [motion.reduced]: {
      transition: 'none',
      '&, & *': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
    },
  },
});
