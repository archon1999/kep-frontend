import { Theme, paperClasses } from '@mui/material';
import { Components } from '@mui/material/styles';

const Drawer: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  defaultProps: {
    slotProps: {
      paper: {
        variant: 'elevation',
        elevation: 6,
      },
    },
  },
  styleOverrides: {
    paper: ({ theme }) =>
      theme.preset === 'default'
        ? {
            borderRadius: 0,
            backgroundColor: theme.vars.palette.background.default,
            backgroundImage: 'linear-gradient(90deg, var(--kep-logo-sand), var(--kep-logo-ice))',
            backgroundSize: '100% 2px',
            backgroundRepeat: 'no-repeat',
            border: `1px solid ${theme.vars.palette.divider}`,
            boxShadow: 'none',
          }
        : {},
    docked: {
      [`& .${paperClasses.root}`]: {
        boxShadow: 'none',
      },
    },
  },
};

export default Drawer;
