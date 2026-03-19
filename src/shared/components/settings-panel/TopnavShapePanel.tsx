import { ChangeEvent } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { TopnavType } from 'app/config.ts';
import { useTranslation } from 'react-i18next';
import SettingsItem from './SettingsItem';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';
import { TopnavDefaultIllustration } from './panel-illustrations/TopnavDefaultIllustration';
import { TopnavSlimIllustration } from './panel-illustrations/TopnavSlimIllustration';
import { TopnavStackedIllustration } from './panel-illustrations/TopnavStackedIllustration';

const TopnavShapePanel = () => {
  const { t } = useTranslation();
  const {
    config: { topnavType },
    setConfig,
  } = useSettingsContext();
  const {
    settingsPanelConfig: { disableTopShapeSection },
  } = useSettingsPanelContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as TopnavType;
    setConfig({
      topnavType: value,
    });
  };

  return (
    <SettingsPanelRadioGroup name="sidenav-shape" value={topnavType} onChange={handleChange}>
      <FormControlLabel
        value="default"
        control={<Radio />}
        label={
          <SettingsItem
            label={t('settings.customizer.labels.default')}
            image={<TopnavDefaultIllustration active={!disableTopShapeSection && topnavType === 'default'} />}
            active={!disableTopShapeSection && topnavType === 'default'}
          />
        }
      />
      <FormControlLabel
        value="slim"
        control={<Radio />}
        label={
          <SettingsItem
            label={t('settings.customizer.labels.slim')}
            image={<TopnavSlimIllustration active={!disableTopShapeSection && topnavType === 'slim'} />}
            active={!disableTopShapeSection && topnavType === 'slim'}
          />
        }
      />
      <FormControlLabel
        value="stacked"
        control={<Radio />}
        label={
          <SettingsItem
            label={t('settings.customizer.labels.stacked')}
            image={
              <TopnavStackedIllustration active={!disableTopShapeSection && topnavType === 'stacked'} />
            }
            active={!disableTopShapeSection && topnavType === 'stacked'}
          />
        }
      />
    </SettingsPanelRadioGroup>
  );
};

export default TopnavShapePanel;
