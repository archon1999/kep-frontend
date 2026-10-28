import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import { overlayPaperStyles } from 'app/theme/styles/overlays';

const Popover: Components<Omit<Theme, 'components'>>['MuiPopover'] = {
  styleOverrides: {
    paper: ({ theme }) => (theme.preset === 'default' ? overlayPaperStyles(theme) : {}),
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

export default Popover;
