import type { SxProps, Theme } from '@mui/material';
import { contentEntranceStyles, motion } from './transitions';

/** Flat list rows with the same feedback as the reference catalog. */
export const interactiveContentSx = {
  transition: motion.interaction,
  '&:hover, &:focus-within': { bgcolor: 'action.hover' },
  [motion.reduced]: { transition: 'none' },
} satisfies SxProps<Theme>;

/** Connected content cells share the page frame instead of nesting floating cards. */
export const contentGridSx = {
  display: 'grid',
  gap: '1px',
  bgcolor: 'background.default',
  borderBottom: 1,
  borderColor: 'divider',
  // Draw separators from occupied cells so incomplete rows keep the canvas background.
  '& > *': {
    ...contentEntranceStyles,
    minWidth: 0,
    bgcolor: 'background.default',
    boxShadow: '1px 0 0 var(--kep-line), 0 1px 0 var(--kep-line)',
    '&:nth-of-type(3n + 2)': { animationDelay: '45ms' },
    '&:nth-of-type(3n)': { animationDelay: '90ms' },
  },
} satisfies SxProps<Theme>;

export const contentInsetSx = {
  px: 'var(--kep-content-inset)',
  py: { xs: 2.5, md: 3 },
} satisfies SxProps<Theme>;

export const contentHeadingSx = {
  fontFamily: 'var(--kep-display-font)',
  fontSize: { xs: 20, md: 24 },
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-.02em',
  overflowWrap: 'anywhere',
} satisfies SxProps<Theme>;
