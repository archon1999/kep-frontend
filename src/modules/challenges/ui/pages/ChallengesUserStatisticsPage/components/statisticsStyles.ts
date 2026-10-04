import type { Theme } from '@mui/material/styles';

// Aurora Analytics: contiguous Paper cells with a shared one-pixel divider.
export const statisticsPanelSx = (theme: Theme) => ({
  height: 1,
  minWidth: 0,
  borderRadius: 0,
  outline: `1px solid ${theme.vars.palette.divider}`,
  border: 0,
  boxShadow: 'none',
  bgcolor: 'background.paper',
  backgroundImage: 'none',
});

export const statisticsInset = { xs: 3, md: 5 };
