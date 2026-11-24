import type { SxProps, Theme } from '@mui/material/styles';
import { uiTypography } from '../typography';

export const statisticsInset = { xs: 2, sm: 2.5 };
export const statisticsChartHeight = 232;
export const statisticsMetricMinHeight = 120;

export const statisticsTableSx = {
  fontVariantNumeric: 'tabular-nums',
  '& th': {
    fontSize: '.75rem',
    fontWeight: 600,
    color: 'text.secondary',
    lineHeight: 1.4,
    py: 1,
    px: 1,
    whiteSpace: 'normal',
  },
  '& td': { ...uiTypography.smallText, py: 1, px: 1, borderColor: 'divider' },
  '& tbody tr:last-child td': { borderBottom: 0 },
} satisfies SxProps<Theme>;

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
  ...uiTypography.cardTitle,
  overflowWrap: 'anywhere',
} satisfies SxProps<Theme>;
