import { ChangeEvent } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { CardStyle, cardStyles } from 'app/config.ts';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { useTranslation } from 'react-i18next';
import SettingsItem from '../SettingsItem';
import SettingsPanelRadioGroup from '../SettingsPanelRadioGroup';
import SurfacePreview from './SurfacePreview';

const LABEL_KEYS: Record<CardStyle, string> = {
  default: 'settings.customizer.labels.default',
  outline: 'settings.customizer.labels.outline',
  corners: 'settings.customizer.labels.corners',
  glow: 'settings.customizer.labels.glow',
};

const CardStylePanel = () => {
  const { t } = useTranslation();
  const {
    config: { cardStyle },
    setConfig,
  } = useSettingsContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfig({
      cardStyle: (event.target as HTMLInputElement).value as CardStyle,
    });
  };

  return (
    <SettingsPanelRadioGroup name="card-style" value={cardStyle} onChange={handleChange}>
      {cardStyles.map((style) => (
        <FormControlLabel
          key={style}
          value={style}
          control={<Radio />}
          label={
            <SettingsItem
              label={t(LABEL_KEYS[style])}
              image={<SurfacePreview cardStyle={style} cardBackground="gradient" />}
              active={cardStyle === style}
            />
          }
        />
      ))}
    </SettingsPanelRadioGroup>
  );
};

export default CardStylePanel;
