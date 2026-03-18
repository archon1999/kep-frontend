import { ChangeEvent } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_NAVIGATION_MENU_TYPE } from 'app/reducers/SettingsReducer';
import { NavigationMenuType } from 'app/config.ts';
import SettingsItem from './SettingsItem';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';
import { SidenavIllustration } from './panel-illustrations/SidenavIllustration';
import { TopnavIllustration } from './panel-illustrations/TopnavIllustration';

const NavigationMenuPanel = () => {
  const {
    config: { navigationMenuType },
    configDispatch,
  } = useSettingsContext();

  const {
    settingsPanelConfig: { disableNavigationMenuSection },
  } = useSettingsPanelContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as NavigationMenuType;
    configDispatch({
      type: SET_NAVIGATION_MENU_TYPE,
      payload: value,
    });
  };

  return (
    <SettingsPanelRadioGroup
      name="text-direction"
      value={navigationMenuType}
      onChange={handleChange}
    >
      <FormControlLabel
        value="sidenav"
        control={<Radio />}
        label={
          <SettingsItem
            label="Sidenav"
            image={
              <SidenavIllustration
                active={!disableNavigationMenuSection && navigationMenuType === 'sidenav'}
              />
            }
            active={!disableNavigationMenuSection && navigationMenuType === 'sidenav'}
          />
        }
      />
      <FormControlLabel
        value="topnav"
        control={<Radio />}
        label={
          <SettingsItem
            label="Topnav"
            image={
              <TopnavIllustration
                active={!disableNavigationMenuSection && navigationMenuType === 'topnav'}
              />
            }
            active={!disableNavigationMenuSection && navigationMenuType === 'topnav'}
          />
        }
      />
    </SettingsPanelRadioGroup>
  );
};

export default NavigationMenuPanel;
