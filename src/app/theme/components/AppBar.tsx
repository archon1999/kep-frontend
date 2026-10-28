import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

const AppBar: Components<Omit<Theme, 'components'>>['MuiAppBar'] = {
  defaultProps: {
    color: 'inherit',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      boxShadow: 'none',
      ...(theme.preset === 'default' && {
        background: theme.vars.palette.background.default,
        backgroundImage: 'none',
        color: theme.vars.palette.text.primary,
      }),
    }),
  },
};

export default AppBar;
