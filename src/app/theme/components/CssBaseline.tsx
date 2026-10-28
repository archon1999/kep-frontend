import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import keyFrames from 'app/theme/styles/keyFrames';
import popper from 'app/theme/styles/popper';
import simplebar from 'app/theme/styles/simplebar';
import vibrantNav from 'app/theme/styles/vibrantNav';
import { fontFaces } from '../fonts';
import { toastStyles } from '../styles/feedback';
import { foundationStyles } from '../styles/foundations';
import { designTokens, themeCssVariables } from '../tokens';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: (theme) => [
    ...fontFaces.map((face) => ({ '@font-face': face })),
    foundationStyles,
    {
      'body:has(.kep-landing-main)': { overflow: 'hidden' },
      '*': {
        scrollbarWidth: 'thin',
      },
      ...(theme.preset === 'default' && {
        'input.MuiInputBase-input:-webkit-autofill, input.MuiInputBase-input:-webkit-autofill:hover, input.MuiInputBase-input:-webkit-autofill:focus':
          {
            WebkitBoxShadow: `0 0 0 1000px ${theme.vars.palette.background.default} inset !important`,
            WebkitTextFillColor: `${theme.vars.palette.text.primary} !important`,
            caretColor: theme.vars.palette.text.primary,
          },
      }),
      '::-webkit-scrollbar': { width: 6, height: 6 },
      '::-webkit-scrollbar-track': { background: theme.vars.palette.background.default },
      '::-webkit-scrollbar-thumb': {
        border: `1px solid ${theme.vars.palette.background.default}`,
        borderRadius: 8,
        background: theme.vars.palette.background.elevation4,
      },
      '::-webkit-scrollbar-thumb:hover': { background: theme.vars.palette.text.disabled },
      html: {
        ...themeCssVariables(theme),
        fontSize: theme.typography.fontSize,
        '&[data-kep-color-scheme="light"]': {
          '--kep-gold': designTokens.medal.light.gold,
          '--kep-silver': designTokens.medal.light.silver,
          '--kep-bronze': designTokens.medal.light.bronze,
          '--kep-logo-mid':
            theme.preset === 'default' ? '#4f7162' : theme.vars.palette.primary.light,
        },
      },
      '@media (max-width: 1100px)': { html: { '--kep-page-gutter': '32px' } },
      '@media (max-width: 800px)': {
        html: {
          '--kep-page-gutter': '24px',
          '--kep-content-inset': '24px',
          '--kep-header-height': '80px',
        },
      },
      '@media (max-width: 540px)': {
        html: { '--kep-page-gutter': '16px', '--kep-content-inset': '16px' },
      },
      '@media (max-width: 380px)': {
        html: { '--kep-page-gutter': '12px', '--kep-content-inset': '12px' },
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
      ...toastStyles(theme),
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
    },
  ],
};

export default CssBaseline;
