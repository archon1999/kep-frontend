import { ChangeEvent } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { CardBackground, cardBackgrounds } from 'app/config.ts';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useTranslation } from 'react-i18next';
import SettingsItem from '../SettingsItem';
import SettingsPanelRadioGroup from '../SettingsPanelRadioGroup';
import SurfacePreview from './SurfacePreview';

const LABEL_KEYS: Record<CardBackground, string> = {
  default: 'settings.customizer.labels.default',
  tint: 'settings.customizer.labels.tint',
  gradient: 'settings.customizer.labels.gradient',
  glass: 'settings.customizer.labels.glass',
};

const CardBackgroundPanel = () => {
  const { t } = useTranslation();
  const {
    config: { cardBackground },
    setConfig,
  } = useSettingsContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig({
      cardBackground: (event.target as HTMLInputElement).value as CardBackground,
    });
  };

  return (
    <SettingsPanelRadioGroup
      name="card-background"
      value={cardBackground}
      onChange={handleChange}
    >
      {cardBackgrounds.map((background) => (
        <FormControlLabel
          key={background}
          value={background}
          control={<Radio />}
          label={
            <SettingsItem
              label={t(LABEL_KEYS[background])}
              image={<SurfacePreview cardStyle="outline" cardBackground={background} />}
              active={cardBackground === background}
            />
          }
        />
      ))}
    </SettingsPanelRadioGroup>
  );
};

export default CardBackgroundPanel;
