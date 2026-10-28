import { Theme, svgIconClasses } from '@mui/material';
import { Components } from '@mui/material/styles';
import { motion } from '../styles/transitions';

export const Tab: Components<Omit<Theme, 'components'>>['MuiTab'] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      padding: '8px',
      minHeight: '36px',
      minWidth: '36px',
      ...(theme.preset === 'default' && {
        minHeight: 44,
        fontWeight: 500,
        textTransform: 'none',
        transition: motion.interaction,
        '&:hover:not(.Mui-disabled)': { color: theme.vars.palette.primary.main },
        '&.Mui-focusVisible': {
          outline: `2px solid ${theme.vars.palette.primary.main}`,
          outlineOffset: -3,
        },
        [motion.reduced]: { transition: 'none' },
      }),
      [`.${svgIconClasses.root}`]: {
        fontSize: 20,
      },
    }),
  },
};

export const Tabs: Components<Omit<Theme, 'components'>>['MuiTabs'] = {
  defaultProps: {},
  styleOverrides: {
    root: {
      minHeight: '36px',
    },
    list: {
      gap: '8px',
    },
    indicator: {
      transition: `left 240ms ${motion.easing}, width 240ms ${motion.easing}`,
      [motion.reduced]: { transition: 'none' },
    },
  },
};
