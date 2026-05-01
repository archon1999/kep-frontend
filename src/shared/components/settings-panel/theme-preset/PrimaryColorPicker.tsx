import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_PRIMARY_COLOR } from 'app/reducers/SettingsReducer';
import { COLOR_GROUPS } from 'app/theme/primaryColorOverride';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';

interface PrimaryColorPickerProps {
  variant?: 'default' | 'menu';
}

const PrimaryColorPicker = ({ variant = 'default' }: PrimaryColorPickerProps) => {
  const { t } = useTranslation();
  const { config, configDispatch } = useSettingsContext();
  const theme = useTheme();
  const { isDark } = useResolvedThemeMode();

  const primarySwatches = useMemo(
    () => Array.from(new Set(COLOR_GROUPS.map((group) => group.main))),
    [],
  );

  const handlePrimaryPick = useCallback(
    (color: string) => {
      configDispatch({ type: SET_PRIMARY_COLOR, payload: color });
    },
    [configDispatch],
  );

  return (
    <Stack
      direction="column"
      spacing={variant === 'menu' ? 1 : 2}
      sx={{
        justifyContent: 'space-between',
        p: variant === 'menu' ? 2 : 0,
        pb: variant === 'menu' ? 1 : 0,
        mt: variant === 'menu' ? 0 : 3,
      }}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={600}
        sx={{ minWidth: 100 }}
      >
        {t('settings.customizer.labels.primaryColor')}
      </Typography>
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: '5px',
          p: 1.25,
          borderRadius: 2.5,
          border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.36 : 0.72)}`,
          bgcolor: theme.vars.palette.background.menuElevation1,
          backgroundImage: isDark
            ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.045)} 0%, transparent 100%)`
            : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.82)} 0%, transparent 100%)`,
          boxShadow: isDark
            ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.04)}`
            : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.72)}`,
        })}
      >
        {primarySwatches.map((color) => {
          const isSelected = config.primaryColor === color;

          return (
            <Box
              key={color}
              onClick={() => handlePrimaryPick(color)}
              sx={{
                position: 'relative',
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: color,
                border: `1px solid ${alpha(
                  isSelected ? theme.palette.primary.main : theme.palette.divider,
                  isSelected ? (isDark ? 0.55 : 0.26) : isDark ? 0.36 : 0.64,
                )}`,
                boxShadow: isSelected
                  ? `0 0 0 2px ${alpha(theme.palette.primary.main, isDark ? 0.22 : 0.12)}, 0 12px 22px -18px ${alpha(theme.palette.primary.main, isDark ? 0.78 : 0.32)}`
                  : isDark
                    ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`
                    : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSelected && (
                <IconifyIcon
                  icon="material-symbols:check"
                  sx={{
                    fontSize: 14,
                    color: theme.palette.getContrastText(color),
                    filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.1))',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
};

export default PrimaryColorPicker;
