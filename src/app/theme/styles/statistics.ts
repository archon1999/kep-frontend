import type { SxProps, Theme } from '@mui/material/styles';

export const statisticsInset = 'var(--kep-content-inset)';

// Adjacent cells share a single divider inside the page frame.
export const statisticsPanelSx = {
  height: '100%',
  minWidth: 0,
  border: 0,
  borderRadius: 0,
  outline: '1px solid',
  outlineColor: 'divider',
  boxShadow: 'none',
  bgcolor: 'background.default',
  backgroundImage: 'none',
} satisfies SxProps<Theme>;

export const statisticsHeadingSx = {
  fontFamily: 'var(--kep-display-font)',
  fontSize: { xs: 18, md: 20 },
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
  overflowWrap: 'anywhere',
} satisfies SxProps<Theme>;
