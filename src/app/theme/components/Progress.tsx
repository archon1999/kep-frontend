import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import { motion } from '../styles/transitions';

export const LinearProgress: Components<Omit<Theme, 'components'>>['MuiLinearProgress'] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.preset === 'default' ? 0 : 2,
      '@media (prefers-reduced-motion: reduce)': {
        '& .MuiLinearProgress-bar': { animation: 'none', transition: 'none' },
      },
    }),
    bar: ({ theme }) => ({ borderRadius: theme.preset === 'default' ? 0 : 2 }),
    bar1Determinate: { transition: `transform 480ms ${motion.easing}` },
  },
};

export const CircularProgress: Components<Omit<Theme, 'components'>>['MuiCircularProgress'] = {
  defaultProps: {},
  styleOverrides: {
    root: { '@media (prefers-reduced-motion: reduce)': { animation: 'none' } },
    circle: {
      strokeLinecap: 'round',
      '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  },
};
