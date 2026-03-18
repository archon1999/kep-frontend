import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import keyFrames from 'app/theme/styles/keyFrames';
import popper from 'app/theme/styles/popper';
import simplebar from 'app/theme/styles/simplebar';
import vibrantNav from 'app/theme/styles/vibrantNav';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: (theme) => ({
    '*': {
      scrollbarWidth: 'thin',
    },
    html: {
      fontSize: theme.typography.fontSize,
    },
    body: {
      scrollbarColor: `${theme.vars.palette.background.elevation4} transparent`,
      [`h1, h2, h3, h4, h5, h6`]: {
        margin: 0,
      },
      fontVariantLigatures: 'none',
      [`[id]`]: {
        scrollMarginTop: 82,
      },
    },
    ...simplebar(theme),
    ...keyFrames(),
    ...popper(theme),
    ...vibrantNav(theme),
    'html[data-vision="protanopia"]': {
      filter: 'url("#protanopia-filter")',
    },
    'html[data-vision="deuteranopia"]': {
      filter: 'url("#deuteranopia-filter")',
    },
    'html[data-vision="tritanopia"]': {
      filter: 'url("#tritanopia-filter")',
    },
    'html[data-vision="achromatopsia"]': {
      filter: 'url("#achromatopsia-filter")',
    },
  }),
};

export default CssBaseline;
