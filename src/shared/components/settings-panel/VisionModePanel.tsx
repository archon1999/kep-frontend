import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { VisionMode, useVisionMode } from 'app/providers/VisionModeProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';

interface VisionOption {
  value: VisionMode;
  label: string;
  description: string;
}

const VisionModePanel = () => {
  const { t } = useTranslation();
  const { mode, setMode } = useVisionMode();
  const { isDark } = useResolvedThemeMode();
  const visionOptions: VisionOption[] = [
    {
      value: 'normal',
      label: t('settings.customizer.visionModes.normal.label'),
      description: t('settings.customizer.visionModes.normal.description'),
    },
    {
      value: 'protanopia',
      label: t('settings.customizer.visionModes.protanopia.label'),
      description: t('settings.customizer.visionModes.protanopia.description'),
    },
    {
      value: 'deuteranopia',
      label: t('settings.customizer.visionModes.deuteranopia.label'),
      description: t('settings.customizer.visionModes.deuteranopia.description'),
    },
    {
      value: 'tritanopia',
      label: t('settings.customizer.visionModes.tritanopia.label'),
      description: t('settings.customizer.visionModes.tritanopia.description'),
    },
    {
      value: 'achromatopsia',
      label: t('settings.customizer.visionModes.achromatopsia.label'),
      description: t('settings.customizer.visionModes.achromatopsia.description'),
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as VisionMode);
  };

  return (
    <RadioGroup name="vision-mode" value={mode} onChange={handleChange}>
      <Stack direction="column" sx={{ gap: 0.5 }}>
        {visionOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            data-theme-mode={isDark ? 'dark' : 'light'}
            control={
              <Radio
                checkedIcon={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 28,
                      height: 28,
                    }}
                  >
                    <IconifyIcon
                      icon="material-symbols-light:check-circle"
                      sx={{ color: 'primary.main', fontSize: '22px !important' }}
                    />
                  </Box>
                }
                sx={{
                  p: 0.5,
                  width: 28,
                  height: 28,
                  ...(mode !== option.value && {
                    '& svg': {
                      width: 16,
                      height: 16,
                    },
                  }),
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              />
            }
            label={
              <Stack direction="column" sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: mode === option.value ? 600 : 400,
                    color: mode === option.value ? 'primary.main' : 'text.primary',
                  }}
                >
                  {option.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {option.description}
                </Typography>
              </Stack>
            }
            disableTypography
            sx={{
              margin: 0,
              width: '100%',
              p: 1,
              borderRadius: 2,
              alignItems: 'flex-start',
              border: (theme) =>
                `1px solid ${alpha(
                  mode === option.value ? theme.palette.primary.main : theme.palette.divider,
                  mode === option.value ? (isDark ? 0.4 : 0.22) : isDark ? 0.36 : 0.72,
                )}`,
              bgcolor: (theme) =>
                mode === option.value
                  ? alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08)
                  : theme.vars.palette.background.menuElevation1,
              backgroundImage: (theme) =>
                isDark
                  ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.045)} 0%, transparent 100%)`
                  : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.82)} 0%, transparent 100%)`,
              boxShadow: (theme) =>
                mode === option.value
                  ? `0 14px 28px -24px ${alpha(theme.palette.primary.main, isDark ? 0.82 : 0.45)}, inset 0 1px 0 ${alpha(theme.palette.common.white, isDark ? 0.06 : 0.72)}`
                  : isDark
                    ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.04)}`
                    : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.72)}`,
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, isDark ? 0.12 : 0.05),
              },
              '& .MuiFormControlLabel-label': {
                flex: 1,
                ml: 1,
                width: '100%',
              },
            }}
          />
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default VisionModePanel;
