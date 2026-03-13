import { Dispatch, PropsWithChildren, createContext, use, useEffect, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ACTIONTYPE,
  COLLAPSE_NAVBAR,
  EXPAND_NAVBAR,
  SET_CONFIG,
  settingsReducer,
} from 'app/reducers/SettingsReducer';
import { Config, initialConfig } from 'app/config.ts';
import { getItemFromStore } from 'shared/lib/utils';
import { preferencesApiClient } from 'shared/api/preferences.client';

interface SettingsContextInterFace {
  config: Config;
  configDispatch: Dispatch<ACTIONTYPE>;
  setConfig: (payload: Partial<Config>) => void;
  handleDrawerToggle: () => void;
  toggleNavbarCollapse: () => void;
}

export const SettingsContext = createContext({} as SettingsContextInterFace);

const SettingsProvider = ({ children }: PropsWithChildren) => {
  const configState: Config = {
    ...initialConfig,
    sidenavCollapsed: getItemFromStore('sidenavCollapsed', initialConfig.sidenavCollapsed),
    sidenavType: getItemFromStore('sidenavType', initialConfig.sidenavType),
    topnavType: getItemFromStore('topnavType', initialConfig.topnavType),
    navigationMenuType: getItemFromStore('navigationMenuType', initialConfig.navigationMenuType),
    navColor: getItemFromStore('navColor', initialConfig.navColor),
    locale: getItemFromStore('locale', initialConfig.locale),
  };
  const [config, configDispatch] = useReducer(settingsReducer, configState);
  const { i18n } = useTranslation();

  const setConfig = (payload: Partial<Config>) => {
    configDispatch({
      type: SET_CONFIG,
      payload,
    });
  };

  const handleDrawerToggle = () => {
    setConfig({
      openNavbarDrawer: !config.openNavbarDrawer,
    });
  };

  const toggleNavbarCollapse = () => {
    if (config.sidenavCollapsed) {
      configDispatch({
        type: EXPAND_NAVBAR,
      });
    } else {
      configDispatch({
        type: COLLAPSE_NAVBAR,
      });
    }
  };

  const prevLocaleRef = useRef(config.locale);

  useEffect(() => {
    const language = config.locale.split('-')[0].toLowerCase();
    const localeCode = config.locale.split('-').join('');

    i18n.changeLanguage(localeCode);

    if (prevLocaleRef.current !== config.locale) {
      prevLocaleRef.current = config.locale;

      const updateLanguagePreference = async () => {
        try {
          await preferencesApiClient.setLanguage(language);
        } catch (error) {
          console.error('Failed to update language preference', error);
        }
      };

      void updateLanguagePreference();
    }
  }, [config.locale, i18n]);

  return (
    <SettingsContext
      value={{
        config,
        configDispatch,
        setConfig,
        handleDrawerToggle,
        toggleNavbarCollapse,
      }}
    >
      {children}
    </SettingsContext>
  );
};

export const useSettingsContext = () => use(SettingsContext);

export default SettingsProvider;
