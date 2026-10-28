import {
  ComponentsVariants,
  Theme,
  ToggleButtonGroupProps,
  ToggleButtonProps,
  toggleButtonClasses,
} from '@mui/material';
import { Components } from '@mui/material/styles';
import { PaletteColorKey } from 'app/theme/palette';
import { cssVarRgba } from 'shared/lib/utils';
import { motion } from '../styles/transitions';

const toggleBtnColors: PaletteColorKey[] = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
];

const toggleBtnCustomVariants: ComponentsVariants['MuiToggleButton'] = toggleBtnColors.map(
  (color) => ({
    props: { color: color as ToggleButtonProps['color'] },
    style: (style) => {
      const theme = style.theme as Theme;
      if (theme.preset === 'default') return {};
      const paletteColor = theme.vars.palette[color];
      return {
        backgroundColor: 'transparent',
        color: paletteColor.dark,
        '&:hover': {
          backgroundColor: cssVarRgba(paletteColor.mainChannel, 0.15),
        },
        '&.Mui-selected': {
          color: paletteColor.dark,
        },
      };
    },
  }),
);

const toggleBtnGroupCustomVariants: ComponentsVariants['MuiToggleButtonGroup'] =
  toggleBtnColors.map((color) => ({
    props: { color: color as ToggleButtonGroupProps['color'] },
    style: (style) => {
      const theme = style.theme as Theme;
      if (theme.preset === 'default') return {};
      const paletteColor = theme.vars.palette[color];
      return {
        [`& .${toggleButtonClasses.root}`]: {
          color: paletteColor.light,
          '&.Mui-selected': {
            color: paletteColor.dark,
            backgroundColor: cssVarRgba(paletteColor.mainChannel, 0.15),
            '&:hover': {
              color: paletteColor.light,
            },
          },
        },
      };
    },
  }));

const ToggleButton: Components<Omit<Theme, 'components'>>['MuiToggleButton'] = {
  variants: [
    ...toggleBtnCustomVariants,
    {
      props: { color: 'standard' },
      style: (style) => {
        const theme = style.theme as Theme;
        if (theme.preset === 'default') return {};
        return {
          backgroundColor: 'transparent',
          color: theme.vars.palette.neutral.dark,
          '&:hover': {
            backgroundColor: theme.vars.palette.background.elevation2,
          },
          '&.Mui-selected': {
            backgroundColor: theme.vars.palette.background.elevation2,
            '&:hover': {
              backgroundColor: theme.vars.palette.background.elevation2,
            },
          },
        };
      },
    },
  ],
  defaultProps: {},
  styleOverrides: {
    root: ({ theme, ownerState }) => ({
      border: 'none',
      '&.Mui-disabled': {
        border: 'none',
      },
      '&.Mui-selected': {
        '&.Mui-disabled': {
          border: 'none',
          backgroundColor: 'transparent',
          color: theme.vars.palette.text.disabled,
        },
      },
      ...(theme.preset === 'default' && {
        ...theme.typography.body2,
        fontWeight: 600,
        lineHeight: 1.4,
        minHeight: 36,
        minWidth: 36,
        border: `1px solid ${theme.vars.palette.divider}`,
        color: theme.vars.palette.text.secondary,
        transition: motion.interaction,
        '&:hover': {
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.action.hover,
        },
        '&.Mui-selected': {
          color:
            theme.vars.palette[
              ownerState.color === 'standard' || !ownerState.color ? 'primary' : ownerState.color
            ].main,
          backgroundColor:
            theme.vars.palette[
              ownerState.color === 'standard' || !ownerState.color ? 'primary' : ownerState.color
            ].lighter,
          borderColor:
            theme.vars.palette[
              ownerState.color === 'standard' || !ownerState.color ? 'primary' : ownerState.color
            ].main,
          '&:hover': { filter: 'brightness(.98)' },
        },
        '&.Mui-focusVisible': {
          outline: `2px solid ${theme.vars.palette.primary.main}`,
          outlineOffset: 2,
        },
        '&.Mui-disabled, &.Mui-selected.Mui-disabled': {
          border: `1px solid ${theme.vars.palette.divider}`,
          color: theme.vars.palette.text.disabled,
          backgroundColor: 'transparent',
        },
        [motion.reduced]: { transition: 'none' },
      }),
    }),
    sizeSmall: ({ theme }) => ({
      padding: theme.spacing(0.75),
      borderRadius: theme.preset === 'default' ? 0 : theme.shape.borderRadius,
      '& .iconify': {
        fontSize: 18,
      },
    }),
    sizeMedium: ({ theme }) => ({
      padding: theme.spacing(1),
      borderRadius: theme.preset === 'default' ? 0 : (theme.shape.borderRadius as number) * 1.5,
      '& .iconify': {
        fontSize: 20,
      },
    }),
    sizeLarge: ({ theme }) => ({
      padding: theme.spacing(1.125),
      borderRadius: theme.preset === 'default' ? 0 : (theme.shape.borderRadius as number) * 2,
      '& .iconify': {
        fontSize: 24,
      },
    }),
  },
};

export const ToggleButtonGroup: Components<Omit<Theme, 'components'>>['MuiToggleButtonGroup'] = {
  variants: [
    ...toggleBtnGroupCustomVariants,
    {
      props: { color: 'standard' },
      style: (style) => {
        const theme = style.theme as Theme;
        if (theme.preset === 'default') return {};
        return {
          [`& .${toggleButtonClasses.root}`]: {
            color: theme.vars.palette.text.secondary,
            '&:hover': {
              color: theme.vars.palette.neutral.dark,
            },
            '&.Mui-selected': {
              color: theme.vars.palette.neutral.dark,
            },
            '&.Mui-disabled': {
              color: theme.vars.palette.text.disabled,
            },
          },
        };
      },
    },
  ],
  defaultProps: {
    color: 'standard',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: (theme.shape.borderRadius as number) * 2,
      padding: theme.spacing(0.5),
      gap: theme.spacing(0.25),
      width: 'max-content',
      backgroundColor: theme.vars.palette.background.elevation1,
      [`& .${toggleButtonClasses.root}`]: {
        borderRadius: theme.shape.borderRadius,
        border: 'none !important',
        marginLeft: 0,
      },
      ...(theme.preset === 'default' && {
        borderRadius: 0,
        padding: 0,
        gap: theme.spacing(0.75),
        maxWidth: '100%',
        backgroundColor: 'transparent',
        [`& .${toggleButtonClasses.root}`]: {
          borderRadius: 0,
          border: `1px solid ${theme.vars.palette.divider}`,
          margin: 0,
          '&.Mui-selected': { borderColor: 'currentColor' },
        },
      }),
    }),
  },
};

export default ToggleButton;
