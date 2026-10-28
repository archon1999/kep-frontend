import { Components, Theme } from '@mui/material/styles';

const Skeleton: Components<Omit<Theme, 'components'>>['MuiSkeleton'] = {
  defaultProps: { animation: 'wave' },
  styleOverrides: {
    root: ({ theme }) => ({
      ...(theme.preset === 'default' && {
        backgroundColor: theme.vars.palette.action.hover,
        '&.MuiSkeleton-rounded, &.MuiSkeleton-rectangular': {
          borderRadius: 0,
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0 23px, ${theme.vars.palette.divider} 23px 24px)`,
        },
        '&::after': {
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--kep-logo-ice) 8%, transparent), transparent)',
        },
      }),
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        '&::after': { animation: 'none' },
      },
    }),
  },
};

export default Skeleton;
