import { Box, Slider, Typography } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useTranslation } from 'react-i18next';

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
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ minWidth: 100, mb: 1 }}>
        {t('settings.customizer.labels.fontSize')}
      </Typography>
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
      />
    </Box>
  );
};

export default FontSizePanel;
