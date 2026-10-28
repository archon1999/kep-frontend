import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';
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
        mt: variant === 'menu' ? 0 : 1,
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
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${primarySwatches.length}, minmax(0, 1fr))`,
          gap: 0.75,
        }}
      >
        {primarySwatches.map((color) => {
          const isSelected = config.primaryColor === color;

          return (
            <ButtonBase
              key={color}
              aria-label={`${t('settings.customizer.labels.primaryColor')} ${color}`}
              aria-pressed={isSelected}
              onClick={() => handlePrimaryPick(color)}
              sx={{
                position: 'relative',
                width: '100%',
                height: 28,
                borderRadius: 0,
                bgcolor: color,
                border: `1px solid ${alpha(
                  isSelected ? theme.palette.primary.main : theme.palette.divider,
                  isSelected ? (isDark ? 0.55 : 0.26) : isDark ? 0.36 : 0.64,
                )}`,
                outline: isSelected ? '2px solid' : 'none',
                outlineColor: 'text.primary',
                outlineOffset: 2,
                '&.Mui-focusVisible': {
                  outline: '2px solid',
                  outlineColor: 'text.primary',
                  outlineOffset: 2,
                },
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
            </ButtonBase>
          );
        })}
      </Box>
    </Stack>
  );
};

export default PrimaryColorPicker;
