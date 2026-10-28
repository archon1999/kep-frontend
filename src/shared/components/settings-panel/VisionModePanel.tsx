import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
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
              p: 1.25,
              borderRadius: 0,
              alignItems: 'flex-start',
              border: '1px solid',
              borderColor: mode === option.value ? 'primary.main' : 'divider',
              bgcolor: mode === option.value ? 'action.selected' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
              '&:focus-within': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
              '& .MuiFormControlLabel-label': { flex: 1, ml: 1, minWidth: 0 },
            }}
          />
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default VisionModePanel;
