import { Components, Theme } from '@mui/material/styles';
import { getSurfaceStyles } from 'app/theme/styles/surfaceTreatments';

const Card: Components<Omit<Theme, 'components'>>['MuiCard'] = {
  defaultProps: {
    background: 1,
  },
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      outline: 'none',
      border: 'none',
      borderRadius: 3,
      ...getSurfaceStyles(theme, Number(ownerState.elevation ?? 3)),
    }),
  },
};

export default Card;
