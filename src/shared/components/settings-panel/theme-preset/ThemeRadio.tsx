import {
  Radio,
  buttonBaseClasses,
  listItemButtonClasses,
  listItemIconClasses,
  listItemSecondaryActionClasses,
} from '@mui/material';
import { alpha, SxProps, Theme } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';

export const themeListRowSx = (
  variant: 'default' | 'menu' = 'default',
  isNested: boolean = false,
  isDark: boolean = false,
): SxProps<Theme> => (theme) => ({
  minHeight: 40,
  py: 0.25,
  pl: variant === 'menu' && isNested ? 4 : 2,
  borderRadius: 2.5,
  border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.38 : 0.72)}`,
  bgcolor:
    variant === 'menu'
      ? theme.vars.palette.background.menu
      : theme.vars.palette.background.menuElevation1,
  backgroundImage:
    isDark
      ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.04)} 0%, transparent 100%)`
      : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.84)} 0%, transparent 100%)`,
  transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  boxShadow:
    isDark
      ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.04)}`
      : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.78)}`,
  [`&.${listItemButtonClasses.selected}`]: {
    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.1),
    borderColor: alpha(theme.palette.primary.main, isDark ? 0.4 : 0.22),
    boxShadow: `0 14px 28px -24px ${alpha(theme.palette.primary.main, isDark ? 0.82 : 0.45)}, inset 0 1px 0 ${alpha(theme.palette.common.white, isDark ? 0.06 : 0.72)}`,
  },
  '&:hover': {
    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.05),
    borderColor: alpha(theme.palette.primary.main, isDark ? 0.24 : 0.14),
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: 36,
    [`& .${buttonBaseClasses.root}`]: {
      width: 22,
      height: 22,
      '& input': {
        width: 22,
        height: 22,
      },
    },
  },
  [`& .${listItemSecondaryActionClasses.root}`]: {
    top: '50%',
    transform: 'translateY(-50%)',
  },
});

interface ThemeRadioProps {
  checked: boolean;
}

export const ThemeRadio = ({ checked }: ThemeRadioProps) => {
  const { isDark } = useResolvedThemeMode();

  return (
    <Radio
      checked={checked}
      disableRipple
      sx={{
        p: 0,
        color: isDark ? 'text.secondary' : 'text.primary',
        '& svg': { fontSize: 22 },
      }}
      checkedIcon={
        <IconifyIcon
          icon="material-symbols-light:check-circle"
          sx={{ fontSize: 20, color: 'primary.main' }}
        />
      }
    />
  );
};
