import { Theme, checkboxClasses, formControlLabelClasses, radioClasses } from '@mui/material';
import { Components } from '@mui/material/styles';

const FormControlLabel: Components<Omit<Theme, 'components'>>['MuiFormControlLabel'] = {
  styleOverrides: {
    root: {
      marginLeft: -9,
      [`& .${radioClasses.root}, & .${formControlLabelClasses.label}`]: {
        alignSelf: 'center',
      },
    },
    label: {
      fontSize: 14,
    },
  },
};

export default FormControlLabel;
