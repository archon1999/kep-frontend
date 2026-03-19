import { ChangeEvent } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_SIDENAV_SHAPE } from 'app/reducers/SettingsReducer';
import { SidenavType } from 'app/config.ts';
import { useTranslation } from 'react-i18next';
import SettingsItem from './SettingsItem';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';
import { SidenavDefaultIllustration } from './panel-illustrations/SidenavDefaultIllustration';
import { SlimIllustration } from './panel-illustrations/SlimIllustration';

const SidenavShapePanel = () => {
  const { t } = useTranslation();
  const {
    config: { sidenavType },
    configDispatch,
  } = useSettingsContext();

  const {
    settingsPanelConfig: { disableSidenavShapeSection },
  } = useSettingsPanelContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as SidenavType;

    configDispatch({
      type: SET_SIDENAV_SHAPE,
      payload: value,
    });
  };

  return (
    <SettingsPanelRadioGroup name="sidenav-shape" value={sidenavType} onChange={handleChange}>
      <FormControlLabel
        value="default"
        control={<Radio />}
        label={
          <SettingsItem
            label={t('settings.customizer.labels.default')}
            image={
              <SidenavDefaultIllustration
                active={!disableSidenavShapeSection && sidenavType === 'default'}
              />
            }
            active={!disableSidenavShapeSection && sidenavType === 'default'}
          />
        }
      />
      <FormControlLabel
        value="slim"
        control={<Radio />}
        label={
          <SettingsItem
            label={t('settings.customizer.labels.slim')}
            image={<SlimIllustration active={!disableSidenavShapeSection && sidenavType === 'slim'} />}
            active={!disableSidenavShapeSection && sidenavType === 'slim'}
          />
        }
      />
    </SettingsPanelRadioGroup>
  );
};

export default SidenavShapePanel;
