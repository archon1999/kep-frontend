import {
  Dispatch,
  PropsWithChildren,
  createContext,
  use,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Config, initialConfig } from 'app/config.ts';
import { toBackendLanguage, toI18nLanguage } from 'app/locales/locale';
import {
  ACTIONTYPE,
  COLLAPSE_NAVBAR,
  EXPAND_NAVBAR,
  SET_CONFIG,
  settingsReducer,
} from 'app/reducers/SettingsReducer';
import { loadReadingFont } from 'app/theme/fontLoading';
import { normalizeFontFamily } from 'app/theme/fonts';
import { normalizeThemePreset, resolveInitialMode } from 'app/theme/presets';
import { COLOR_GROUPS } from 'app/theme/primaryColorOverride';
import { preferencesApiClient } from 'shared/api/preferences.client';
import { getItemFromStore, setItemToStore } from 'shared/lib/utils';
import { useSWRConfig } from 'swr';

interface SettingsContextInterFace {
  config: Config;
  configDispatch: Dispatch<ACTIONTYPE>;
  setConfig: (payload: Partial<Config>) => void;
  handleDrawerToggle: () => void;
  toggleNavbarCollapse: () => void;
}

export const SettingsContext = createContext({} as SettingsContextInterFace);

const SettingsProvider = ({ children }: PropsWithChildren) => {
  const storedPrimaryColor = getItemFromStore('primaryColor', undefined);
  let primaryColor: string | null | undefined =
    typeof storedPrimaryColor === 'string' ? storedPrimaryColor : null;

  const storedThemePreset = getItemFromStore('themePreset', initialConfig.themePreset);
  const themePreset = normalizeThemePreset(storedThemePreset);

  if (!primaryColor && themePreset) {
    const colorGroup = COLOR_GROUPS.find((group) => group.key === themePreset);
    if (colorGroup) {
      primaryColor = colorGroup.main;
    }
  }

  const configState: Config = {
    ...initialConfig,
    sidenavCollapsed: getItemFromStore('sidenavCollapsed', initialConfig.sidenavCollapsed),
    sidenavType: getItemFromStore('sidenavType', initialConfig.sidenavType),
    topnavType: getItemFromStore('topnavType', initialConfig.topnavType),
    navigationMenuType: getItemFromStore('navigationMenuType', initialConfig.navigationMenuType),
    navColor: getItemFromStore('navColor', initialConfig.navColor),
    locale: getItemFromStore('locale', initialConfig.locale),
    themePreset,
    primaryColor,
    fontFamily: normalizeFontFamily(getItemFromStore('fontFamily', initialConfig.fontFamily)),
    fontSize: Number(getItemFromStore('fontSize', initialConfig.fontSize)),
    backgroundPattern: getItemFromStore(
      'backgroundPattern',
      initialConfig.backgroundPattern,
    ) as Config['backgroundPattern'],
    cardStyle: getItemFromStore('cardStyle', initialConfig.cardStyle) as Config['cardStyle'],
    cardBackground: getItemFromStore(
      'cardBackground',
      initialConfig.cardBackground,
    ) as Config['cardBackground'],
  };
  const [config, configDispatch] = useReducer(settingsReducer, configState);
  useEffect(() => {
    loadReadingFont(config.fontFamily, document);
  }, [config.fontFamily]);
  useEffect(() => {
    // Migrate storage once. Subsequent user selections are persisted by the settings reducer.
    const savedFont = getItemFromStore('fontFamily', initialConfig.fontFamily);
    const readingFont = normalizeFontFamily(savedFont);
    if (savedFont !== readingFont) setItemToStore('fontFamily', readingFont);
    const savedPreset = getItemFromStore('themePreset', initialConfig.themePreset);
    if (getItemFromStore('kep-mode', null) === null) {
      setItemToStore('kep-mode', resolveInitialMode(savedPreset, null));
    }
    const canonicalPreset = normalizeThemePreset(savedPreset);
    if (savedPreset !== canonicalPreset) {
      setItemToStore('themePreset', canonicalPreset);
    }
  }, []);
  const { i18n } = useTranslation();
  const { mutate } = useSWRConfig();

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
    const nextLocale = config.locale;
    const nextLanguage = toBackendLanguage(nextLocale);
    const nextI18nLanguage = toI18nLanguage(nextLocale);

    const syncLanguage = async () => {
      await i18n.changeLanguage(nextI18nLanguage);

      if (prevLocaleRef.current === nextLocale) {
        return;
      }

      prevLocaleRef.current = nextLocale;

      try {
        await preferencesApiClient.setLanguage(nextLanguage);
      } catch (error) {
        console.error('Failed to update language preference', error);
      }

      await mutate(() => true, undefined, { revalidate: true });
    };

    void syncLanguage();
  }, [config.locale, i18n, mutate]);

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
