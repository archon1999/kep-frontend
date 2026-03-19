import { Box, Button, Stack, Typography } from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_NAV_COLOR } from 'app/reducers/SettingsReducer';
import { NavColor } from 'app/config';
import { useTranslation } from 'react-i18next';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';

interface ItemProps {
  label: string;
  previewSx: (theme: Theme) => SystemStyleObject<Theme>;
  active?: boolean;
  isDark: boolean;
  onClick: () => void;
}

const Item = ({ label, previewSx, active, isDark, onClick }: ItemProps) => {
  return (
    <Button
      sx={(theme) => ({
        p: 2,
        gap: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: `1px solid ${alpha(
          active ? theme.palette.primary.main : theme.palette.divider,
          active
            ? isDark
              ? 0.4
              : 0.22
            : isDark
              ? 0.36
              : 0.72,
        )}`,
        bgcolor: active
          ? alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08)
          : theme.vars.palette.background.menuElevation1,
        backgroundImage:
          isDark
            ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.045)} 0%, transparent 100%)`
            : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.82)} 0%, transparent 100%)`,
        boxShadow: active
          ? `0 14px 28px -24px ${alpha(theme.palette.primary.main, isDark ? 0.82 : 0.45)}, inset 0 1px 0 ${alpha(theme.palette.common.white, isDark ? 0.06 : 0.72)}`
          : isDark
            ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.04)}`
            : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.72)}`,
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.05),
        },
      })}
      onClick={onClick}
    >
      <Box
        sx={(theme) => ({
          height: 40,
          width: 40,
          borderRadius: '50%',
          ...previewSx(theme),
        })}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: active ? 500 : 400,
          color: active ? 'primary.main' : 'text.secondary',
        }}
      >
        {label}
      </Typography>
    </Button>
  );
};

const NavColorPanel = () => {
  const { t } = useTranslation();
  const {
    config: { navColor },
    configDispatch,
  } = useSettingsContext();
  const { isDark } = useResolvedThemeMode();

  const handleClick = (value: NavColor) => {
    configDispatch({
      type: SET_NAV_COLOR,
      payload: value,
    });
  };

  return (
    <Stack
      direction="row"
      sx={{
        gap: 2,
      }}
    >
      <Item
        label={t('settings.customizer.labels.default')}
        previewSx={() => ({
          bgcolor: 'background.default',
          border: 2,
          borderColor: 'divider',
        })}
        active={navColor === 'default'}
        isDark={isDark}
        onClick={() => handleClick('default')}
      />
      <Item
        label={t('settings.customizer.labels.vibrant')}
        previewSx={(theme) => ({
          background: `linear-gradient(163.93deg, ${theme.palette.primary.light} 3.83%, ${theme.palette.success.main} 132.96%)`,
        })}
        active={navColor === 'vibrant'}
        isDark={isDark}
        onClick={() => handleClick('vibrant')}
      />
    </Stack>
  );
};

export default NavColorPanel;
