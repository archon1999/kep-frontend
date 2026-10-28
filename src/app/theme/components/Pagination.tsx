import { ComponentsVariants, PaginationProps, Theme, paginationItemClasses } from '@mui/material';
import { Components, PaletteColor, PaletteColorChannel } from '@mui/material/styles';
import { PaletteColorKey } from 'app/theme/palette';
import { controlMotionStyles } from 'app/theme/styles/transitions';
import { designTokens } from 'app/theme/tokens';
import { VariantStyleProps } from 'app/types/mui';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { cssVarRgba } from 'shared/lib/utils';

declare module '@mui/material/Pagination' {
  interface PaginationPropsVariantOverrides {
    solid: true;
  }
  interface PaginationPropsColorOverrides {
    neutral: true;
    warning: true;
    info: true;
    error: true;
    success: true;
  }
}
declare module '@mui/material/PaginationItem' {
  interface PaginationItemPropsVariantOverrides {
    solid: true;
  }
  interface PaginationItemPropsColorOverrides {
    neutral: true;
    warning: true;
    info: true;
    error: true;
    success: true;
  }
}

const paginationSolidColors: PaletteColorKey[] = [
  'neutral',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
];

const FirstIcon = () => (
  <IconifyIcon icon="material-symbols:keyboard-double-arrow-left-rounded" fontSize={20} />
);
const LastIcon = () => (
  <IconifyIcon icon="material-symbols:keyboard-double-arrow-right-rounded" fontSize={20} />
);
const NextIcon = () => <IconifyIcon icon="material-symbols:chevron-right-rounded" fontSize={20} />;
const previousIcon = () => (
  <IconifyIcon icon="material-symbols:chevron-left-rounded" fontSize={20} />
);

const paginationCustomVariants: ComponentsVariants['MuiPaginationItem'] = paginationSolidColors.map(
  (color) => ({
    props: { variant: 'solid', color: color as PaginationProps['color'] },
    style: ({ theme }: { theme: Omit<Theme, 'components'> }) => {
      const paletteColor = theme.vars.palette[color];
      return {
        [`&.${paginationItemClasses.selected}, &.${paginationItemClasses.selected}:hover`]: {
          backgroundColor: paletteColor.dark,
          color: paletteColor.contrastText,
        },
        [`&.${paginationItemClasses.colorPrimary}`]: {
          [`&.${paginationItemClasses.selected}`]: {
            color: theme.vars.palette.common.white,
            backgroundColor: theme.vars.palette.primary.main,
          },
        },
      };
    },
  }),
);

const Pagination: Components<Omit<Theme, 'components'>>['MuiPagination'] = {
  defaultProps: {
    shape: 'rounded',
  },
  styleOverrides: {
    ul: ({ theme }) =>
      theme.preset === 'default' ? { gap: 6, rowGap: 8, justifyContent: 'center' } : {},
  },
};

export const PaginationItem: Components<Omit<Theme, 'components'>>['MuiPaginationItem'] = {
  variants: [...paginationCustomVariants],
  defaultProps: {
    slots: {
      next: NextIcon,
      previous: previousIcon,
      first: FirstIcon,
      last: LastIcon,
    },
  },
  styleOverrides: {
    root: ({ theme }) => {
      if (theme.preset === 'default')
        return {
          ...theme.typography.metric,
          fontSize: '1rem',
          minWidth: 40,
          height: 40,
          margin: 0,
          paddingInline: 8,
          border: `1px solid ${theme.vars.palette.divider}`,
          borderRadius: 0,
          backgroundColor: 'transparent',
          color: theme.vars.palette.text.secondary,
          ...controlMotionStyles,
          '&:hover': {
            backgroundColor: theme.vars.palette.action.hover,
            borderColor: theme.vars.palette.primary.main,
            color: theme.vars.palette.text.primary,
          },
          [`&.${paginationItemClasses.selected}, &.${paginationItemClasses.selected}:hover`]: {
            background: designTokens.gradient,
            borderColor: 'transparent',
            color: 'var(--kep-accent-ink)',
          },
          [`&.${paginationItemClasses.focusVisible}`]: {
            outline: `2px solid ${theme.vars.palette.primary.main}`,
            outlineOffset: 3,
          },
          [`&.${paginationItemClasses.disabled}`]: {
            opacity: 0.3,
            borderColor: 'transparent',
          },
          [`&.${paginationItemClasses.ellipsis}`]: {
            display: 'grid',
            placeItems: 'center',
            borderColor: 'transparent',
          },
        };

      return {
        variants: [
          {
            props: ({ color }) => {
              return color !== 'standard';
            },
            style: (props: VariantStyleProps<PaginationProps>) => {
              const { theme, color } = props;
              const colorKey = color as keyof typeof theme.vars.palette;
              const paletteColor = theme.vars.palette[colorKey] as PaletteColor &
                PaletteColorChannel;
              return {
                [`&.${paginationItemClasses.selected}, &.${paginationItemClasses.selected}:hover`]:
                  {
                    backgroundColor: cssVarRgba(paletteColor.mainChannel, 0.36),
                    color: paletteColor.main,
                  },
              };
            },
          },
        ],
        borderRadius: 8,
        '&:hover': {
          backgroundColor: theme.vars.palette.neutral.lighter,
        },
        [`&.${paginationItemClasses.selected}, &.${paginationItemClasses.selected}:hover`]: {
          backgroundColor: theme.vars.palette.action.focus,
          color: theme.vars.palette.text.primary,
        },
      };
    },
    sizeSmall: ({ theme }) => ({
      height: theme.preset === 'default' ? 32 : 24,
      minWidth: theme.preset === 'default' ? 32 : 24,
      borderRadius: theme.preset === 'default' ? 0 : 6,
    }),
  },
};
export default Pagination;
