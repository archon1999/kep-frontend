import { ChangeEvent } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { BackgroundPattern, backgroundPatterns } from 'app/config.ts';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useTranslation } from 'react-i18next';
import SettingsItem from '../SettingsItem';
import SettingsPanelRadioGroup from '../SettingsPanelRadioGroup';
import SurfacePreview from './SurfacePreview';

const LABEL_KEYS: Record<BackgroundPattern, string> = {
  none: 'settings.customizer.labels.none',
  grid: 'settings.customizer.labels.grid',
  dots: 'settings.customizer.labels.dots',
  diagonal: 'settings.customizer.labels.diagonal',
  mesh: 'settings.customizer.labels.mesh',
};

const BackgroundPatternPanel = () => {
  const { t } = useTranslation();
  const {
    config: { backgroundPattern },
    setConfig,
  } = useSettingsContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig({
      backgroundPattern: (event.target as HTMLInputElement).value as BackgroundPattern,
    });
  };

  return (
    <SettingsPanelRadioGroup
      name="background-pattern"
      value={backgroundPattern}
      onChange={handleChange}
    >
      {backgroundPatterns.map((pattern) => (
        <FormControlLabel
          key={pattern}
          value={pattern}
          control={<Radio />}
          label={
            <SettingsItem
              label={t(LABEL_KEYS[pattern])}
              image={<SurfacePreview pattern={pattern} />}
              active={backgroundPattern === pattern}
            />
          }
        />
      ))}
    </SettingsPanelRadioGroup>
  );
};

export default BackgroundPatternPanel;
