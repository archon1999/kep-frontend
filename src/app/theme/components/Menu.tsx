import { Theme, listItemIconClasses } from '@mui/material';
import { Components } from '@mui/material/styles';
import { overlayOptionStyles, overlayPaperStyles } from 'app/theme/styles/overlays';

export const Menu: Components<Omit<Theme, 'components'>>['MuiMenu'] = {
  styleOverrides: {
    paper: ({ theme }) => (theme.preset === 'default' ? overlayPaperStyles(theme) : {}),
    list: ({ theme }) => (theme.preset === 'default' ? { paddingBlock: 6 } : {}),
  },
};

export const MenuItem: Components<Omit<Theme, 'components'>>['MuiMenuItem'] = {
  defaultProps: { dense: true },
  styleOverrides: {
    root: ({ theme }) => ({
      '&:hover': {
        backgroundColor: theme.vars.palette.background.menuElevation1,
      },
      padding: '8px 16px',
      [`& .${listItemIconClasses.root}`]: {
        minWidth: 24,
        '& svg': {
          fontSize: 16,
        },
      },
      ...(theme.preset === 'default' ? overlayOptionStyles(theme) : {}),
    }),
    dense: ({ theme }) => ({ padding: theme.preset === 'default' ? '8px 16px' : '6px 16px' }),
  },
};
