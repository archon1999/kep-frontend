import type { SxProps, Theme } from '@mui/material/styles';

export const countdownStyles = {
  panel: {
    '--countdown-accent': 'var(--kep-logo-ice)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: { xs: 2, sm: 3 },
    py: { xs: 2, sm: 2.5 },
    '&:last-child': { pb: { xs: 2, sm: 2.5 } },
  },
  clock: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: { xs: 1, sm: 1.5 },
    minWidth: 0,
  },
  unit: {
    alignItems: 'center',
    gap: 1,
    minWidth: 0,
  },
  digits: {
    minWidth: { xs: 56, sm: 72, md: 80 },
    textAlign: 'center',
    fontSize: { xs: 40, sm: 48, md: 56 },
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  seconds: {
    color: 'var(--countdown-accent)',
  },
  unitLabel: {
    color: 'text.secondary',
    fontSize: { xs: 12, sm: 13 },
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 1.4,
  },
  separator: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    pt: { xs: '16px', sm: '20px', md: '24px' },
    opacity: 0.5,
    '&::before, &::after': {
      content: '""',
      width: '3px',
      height: '3px',
      backgroundColor: 'var(--countdown-accent)',
    },
  },
  progress: {
    height: 2,
    width: '100%',
    borderRadius: 0,
    backgroundColor: 'color-mix(in srgb, var(--countdown-accent) 12%, transparent)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: 'var(--countdown-accent)',
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
} satisfies Record<string, SxProps<Theme>>;
