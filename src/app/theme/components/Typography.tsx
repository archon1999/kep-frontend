import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';

const Typography: Components<Omit<Theme, 'components'>>['MuiTypography'] = {
  defaultProps: {
    variantMapping: {
      subtitle2: 'p',
      pixel: 'span',
      metric: 'span',
      label: 'span',
    },
  },
};

export default Typography;
