import { useTranslation } from 'react-i18next';
import { Box, Slider, Stack, Typography } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';

const FontSizePanel = () => {
  const { t } = useTranslation();
  const {
    config: { fontSize },
    setConfig,
  } = useSettingsContext();

  const handleChange = (_: Event, newValue: number | number[]) => {
    setConfig({ fontSize: Array.isArray(newValue) ? newValue[0] : newValue });
  };

  return (
    <Box sx={{ width: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="subtitle2"
          color="text.secondary"
          fontWeight={600}
          sx={{ minWidth: 100, mb: 1 }}
        >
          {t('settings.customizer.labels.fontSize')}
        </Typography>
        <Typography variant="pixel" sx={{ fontSize: 18 }}>
          {fontSize}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            px
          </Typography>
        </Typography>
      </Stack>
      <Slider
        aria-label={t('settings.customizer.labels.fontSize')}
        value={fontSize}
        onChange={handleChange}
        getAriaValueText={(value) => `${value}px`}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}px`}
        shiftStep={1}
        step={1}
        min={12}
        max={20}
        marks
        sx={{ width: 'calc(100% - 16px)', mx: 1 }}
      />
    </Box>
  );
};

export default FontSizePanel;
