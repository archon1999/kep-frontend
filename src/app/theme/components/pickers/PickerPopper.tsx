import type { Components, ComponentsOverrides, Theme } from '@mui/material/styles';
import { overlayPaperStyles } from 'app/theme/styles/overlays';

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MuiPickerPopper: 'root' | 'paper';
  }
  interface Components {
    MuiPickerPopper?: {
      styleOverrides?: Partial<ComponentsOverrides<Theme>['MuiPickerPopper']>;
    };
  }
}

const PickerPopper: Components<Omit<Theme, 'components'>>['MuiPickerPopper'] = {
  styleOverrides: {
    paper: ({ theme }) => (theme.preset === 'default' ? overlayPaperStyles(theme) : {}),
  },
};

export default PickerPopper;
