import { PaperProps, Theme, paperClasses } from '@mui/material';
import { Components } from '@mui/material/styles';
import { blue, grey } from 'app/theme/palette/colors';
import { panelStyles, sectionStyles } from 'app/theme/styles/panel';
import { coreSurfacePaperClassName, getSurfaceStyles } from 'app/theme/styles/surfaceTreatments';

declare module '@mui/material' {
  interface PaperPropsVariantOverrides {
    default: true;
    framed: true;
    panel: true;
    section: true;
  }

  interface PaperOwnProps {
    background?: 0 | 1 | 2 | 3 | 4 | 5;
  }
}

const backgrounds: { [key: number]: { [key: string]: string } } = {
  0: { light: 'white', dark: 'black' },
  1: { light: grey[50], dark: grey[900] },
  2: { light: grey[100], dark: grey[800] },
  3: { light: grey[200], dark: grey[700] },
  4: { light: grey[300], dark: grey[600] },
  5: { light: blue[50], dark: blue[950] },
};

const backgroundVariants = [0, ...Object.keys(backgrounds).map(Number)].map((background) => ({
  props: { background: background as PaperProps['background'] },
  style: ({ theme }: { theme: Theme }) =>
    theme.preset === 'default'
      ? {
          backgroundColor: [
            theme.vars.palette.background.default,
            theme.vars.palette.background.paper,
            theme.vars.palette.background.elevation1,
            theme.vars.palette.background.elevation2,
            theme.vars.palette.background.elevation3,
            theme.vars.palette.primary.lighter,
          ][background],
        }
      : [
          theme.applyStyles('light', {
            [`&.${paperClasses.root}`]: {
              backgroundColor: backgrounds[Number(background)].light,
            },
          }),
          theme.applyStyles('dark', {
            [`&.${paperClasses.root}`]: {
              backgroundColor: backgrounds[Number(background)].dark,
            },
          }),
        ],
}));

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  variants: [
    { props: { variant: 'panel' }, style: ({ theme }) => panelStyles(theme) },
    {
      props: { variant: 'framed' },
      style: ({ theme }) => ({
        background: theme.vars.palette.background.default,
        backgroundImage: 'none',
        color: theme.vars.palette.text.primary,
        border: `1px solid ${theme.vars.palette.divider}`,
        borderRadius: 0,
        outline: 'none',
        boxShadow: '0 16px 40px #0002',
      }),
    },
    {
      props: { variant: 'default' },
      style: ({ theme }) => ({
        border: 'none',
        outline: `1px solid ${theme.vars.palette.divider}`,
        borderRadius: 0,
      }),
    },
    ...backgroundVariants,
    { props: { variant: 'section' }, style: ({ theme }) => sectionStyles(theme) },
  ],
  defaultProps: {
    variant: 'default',
    elevation: 3,
  },
  styleOverrides: {
    elevation: ({ theme }) => ({
      backgroundColor: theme.vars.palette.background.menu,
      backgroundImage: 'none',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: theme.vars.palette.menuDivider,
      ...theme.applyStyles('dark', {
        borderWidth: 1,
      }),
    }),
    rounded: ({ theme }) => ({ borderRadius: theme.preset === 'default' ? 0 : 8 }),
    root: ({ theme, ownerState }) => {
      if (theme.preset === 'default') {
        return {
          backgroundImage: 'none',
          borderRadius: 0,
          ...getSurfaceStyles(theme, Number(ownerState.elevation ?? 3)),
          ...(ownerState.variant === 'default' && {
            outline: `1px solid ${theme.vars.palette.divider}`,
            boxShadow: 'none',
          }),
        };
      }
      const isCoreSurface =
        ownerState.background !== undefined ||
        (typeof ownerState.className === 'string' &&
          ownerState.className.includes(coreSurfacePaperClassName));

      if (!isCoreSurface) {
        return {};
      }

      return getSurfaceStyles(theme, Number(ownerState.elevation ?? 3));
    },
  },
};

export default Paper;
