import { CoreConfig } from '@core/types';

export const coreConfig: CoreConfig = {
  app: {
    appName: 'KEP',
    appTitle: 'KEP.uz',
    appLogoImage: 'assets/images/logo/logo.svg',
    appLanguages: {
      en: {
        title: 'English',
        flag: 'us'
      },
      ru: {
        title: 'Русский язык',
        flag: 'ru'
      },
      uz: {
        title: 'O`zbek tili',
        flag: 'uz'
      }
    },
    appLanguage: 'en',
  },
  layout: {
    skin: 'dark',
    type: 'horizontal',
    animation: 'none',
    enableAnimation: window.innerWidth > 1000,
    menu: {
      hidden: false,
      collapsed: true,
    },
    navbar: {
      hidden: false,
      type: 'fixed-top',
      background: 'navbar-light',
    },
    footer: {
      hidden: false,
      type: 'footer-static',
      background: 'footer-light',
    },
    enableLocalStorage: true,
    customizer: false,
    scrollTop: false,
    buyNow: false,
  }
};
