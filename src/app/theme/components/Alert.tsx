import { Theme, alertClasses } from '@mui/material';
import { Components } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { feedbackSurfaceStyles } from '../styles/feedback';

declare module '@mui/material/Alert' {
  interface AlertPropsColorOverrides {
    neutral: true;
    primary: true;
  }
}

const Alert: Components<Omit<Theme, 'components'>>['MuiAlert'] = {
  defaultProps: {
    iconMapping: {
      error: <IconifyIcon icon="material-symbols:error-outline-rounded" />,
      success: <IconifyIcon icon="material-symbols:check-circle-outline-rounded" />,
      warning: <IconifyIcon icon="material-symbols:warning-outline-rounded" />,
      info: <IconifyIcon icon="material-symbols:info-outline-rounded" />,
      primary: <IconifyIcon icon="material-symbols:notifications-outline-rounded" />,
      neutral: <IconifyIcon icon="material-symbols:help-outline-rounded" />,
    },
  },
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      const color = theme.vars.palette[ownerState.color ?? ownerState.severity ?? 'success'];
      const filled = ownerState.variant === 'filled';
      const outlined = ownerState.variant === 'outlined';
      const tone = ownerState.color ?? ownerState.severity ?? 'success';
      return {
        minWidth: 0,
        flexWrap: 'wrap',
        borderRadius: theme.preset === 'default' ? 0 : (theme.shape.borderRadius as number) * 2,
        backgroundColor: filled ? color.main : outlined ? 'transparent' : color.lighter,
        color: filled ? color.contrastText : color.darker,
        ...(outlined && { borderColor: color.main }),
        ...(theme.preset === 'default' && {
          ...feedbackSurfaceStyles(theme, tone),
          padding: '10px 16px',
          ...(outlined && { backgroundColor: 'transparent' }),
          ...(filled && {
            backgroundColor: color.main,
            color: color.contrastText,
            borderColor: color.main,
          }),
        }),
        [`& .${alertClasses.icon}`]: {
          color: filled ? color.contrastText : color.main,
        },
      };
    },
    message: ({ theme }) => ({
      ...theme.typography.body2,
      flex: '1 1 0',
      minWidth: 0,
      lineHeight: 1.65,
      overflowWrap: 'anywhere',
      '& .MuiAlertTitle-root': { fontWeight: 600, lineHeight: 1.5 },
    }),
    icon: { flexShrink: 0, fontSize: 20, alignItems: 'flex-start', paddingBlock: 9 },
    action: ({ theme }) => ({
      flexShrink: 0,
      alignItems: 'center',
      paddingTop: 0,
      [theme.breakpoints.down('sm')]: {
        flexBasis: '100%',
        justifyContent: 'flex-end',
        paddingLeft: 0,
        '&:has(> .MuiIconButton-root:only-child)': {
          flexBasis: 'auto',
          paddingLeft: 8,
        },
      },
    }),
  },
};

export default Alert;
