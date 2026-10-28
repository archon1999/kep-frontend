import { Components, Theme } from '@mui/material/styles';
import { panelStyles, sectionStyles } from 'app/theme/styles/panel';
import { getSurfaceStyles } from 'app/theme/styles/surfaceTreatments';

const Card: Components<Omit<Theme, 'components'>>['MuiCard'] = {
  variants: [
    { props: { variant: 'section' }, style: ({ theme }) => sectionStyles(theme) },
    {
      props: { variant: 'panel' },
      style: ({ theme }) => ({ ...panelStyles(theme), overflow: 'visible' }),
    },
  ],
  defaultProps: {
    background: 1,
  },
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      outline: 'none',
      border: 'none',
      borderRadius: 3,
      ...getSurfaceStyles(theme, Number(ownerState.elevation ?? 3)),
      ...(theme.preset === 'default' && {
        borderRadius: 0,
        border: `1px solid ${theme.vars.palette.divider}`,
        boxShadow: 'none',
        backgroundImage: 'none',
      }),
    }),
  },
};

export default Card;
