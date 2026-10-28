import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import { overlayFormStyles } from 'app/theme/styles/overlays';

const Dialog: Components<Omit<Theme, 'components'>>['MuiDialog'] = {
  styleOverrides: {
    root: ({ theme }) =>
      theme.preset === 'default'
        ? {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(5px)',
              ...theme.applyStyles('dark', { backgroundColor: 'rgba(0, 0, 0, 0.65)' }),
            },
          }
        : {},
    paper: ({ theme }) =>
      theme.preset === 'default'
        ? {
            borderRadius: 0,
            border: `1px solid ${theme.vars.palette.divider}`,
            background: theme.vars.palette.background.default,
            boxShadow: '0 24px 80px #0005',
            backgroundImage: 'linear-gradient(90deg, var(--kep-logo-sand), var(--kep-logo-ice))',
            backgroundSize: '100% 2px',
            backgroundRepeat: 'no-repeat',
            maxHeight: 'calc(100dvh - 32px)',
            margin: 16,
            '&.MuiDialog-paperFullScreen': {
              margin: 0,
              maxHeight: '100dvh',
              border: 0,
            },
            '& .MuiDialogTitle-root': {
              padding: '20px 24px',
              borderBottom: `1px solid ${theme.vars.palette.divider}`,
              fontFamily: 'var(--kep-display-font)',
              fontSize: '1.5rem',
              fontWeight: 500,
              lineHeight: 1.3,
            },
            '& .MuiDialogContent-root': { padding: '24px' },
            '& .MuiDialogTitle-root + .MuiDialogContent-root': { paddingTop: '24px' },
            '& .MuiDialogContent-dividers': { border: 0 },
            '& .MuiDialogActions-root': {
              padding: '16px 24px',
              borderTop: `1px solid ${theme.vars.palette.divider}`,
              flexWrap: 'wrap',
              gap: 8,
              '& > :not(style) ~ :not(style)': { marginLeft: 0 },
            },
            [theme.breakpoints.down('sm')]: {
              '& .MuiDialogTitle-root': { padding: '18px 20px' },
              '& .MuiDialogContent-root': { padding: '20px' },
              '& .MuiDialogActions-root': { padding: '16px 20px' },
            },
            ...overlayFormStyles(theme),
          }
        : {},
  },
  defaultProps: {
    slotProps: {
      paper: {
        variant: 'elevation',
        elevation: 6,
      },
    },
  },
};

export default Dialog;
