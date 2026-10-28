import type { Components, Theme } from '@mui/material/styles';
import { motion } from '../styles/transitions';

const IconButton: Components<Omit<Theme, 'components'>>['MuiIconButton'] = {
  styleOverrides: {
    root: ({ theme, ownerState }) =>
      theme.preset === 'default'
        ? {
            flexShrink: 0,
            transition: motion.interaction,
            ...(!ownerState.color || ownerState.color === 'default'
              ? { color: theme.vars.palette.text.secondary }
              : {}),
            '&:hover': { backgroundColor: theme.vars.palette.action.hover },
            '&.Mui-disabled': { color: theme.vars.palette.text.disabled },
            [motion.reduced]: { transition: 'none' },
          }
        : {},
    sizeSmall: ({ theme }) =>
      theme.preset === 'default' ? { width: 32, height: 32, padding: 0 } : {},
    sizeMedium: ({ theme }) =>
      theme.preset === 'default' ? { width: 40, height: 40, padding: 0 } : {},
    sizeLarge: ({ theme }) =>
      theme.preset === 'default' ? { width: 48, height: 48, padding: 0 } : {},
  },
};

export default IconButton;
