import type { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles';
import { type StaticTimePickerProps } from '@mui/x-date-pickers';
import ActionBar from 'shared/components/pickers/ActionBar';
import TimePickersToolbar from 'shared/components/pickers/TimePickersToolbar';

declare module '@mui/material/styles' {
  interface ComponentsPropsList {
    MuiStaticTimePicker: Partial<StaticTimePickerProps>;
  }

  interface Components {
    MuiStaticTimePicker?: {
      defaultProps?: StaticTimePickerProps;
    };
  }
}

const StaticTimePicker: Components<Omit<Theme, 'components'>>['MuiStaticTimePicker'] = {
  defaultProps: {
    slots: {
      toolbar: TimePickersToolbar,
      actionBar: ActionBar,
    },
  },
};

export default StaticTimePicker;
