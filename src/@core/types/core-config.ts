export interface CoreConfig {
  app: {
    appName: string;
    appTitle: string;
    appLogoImage: string;
    appLanguage: 'en' | 'ru' | 'uz';
    appLanguages: {
      [key: string]: {
        flag: string,
        title: string,
      }
    }
  };
  layout: {
    skin: 'default' | 'bordered' | 'dark' | 'semi-dark';
    type: 'vertical' | 'horizontal';
    animation: 'fadeInLeft' | 'zoomIn' | 'fadeIn' | 'none';
    enableAnimation: boolean;
    menu: {
      hidden: boolean;
      collapsed: boolean;
    };
    navbar: {
      hidden: boolean;
      type: 'navbar-static-top' | 'fixed-top' | 'floating-nav' | 'd-none';
      background: 'navbar-dark' | 'navbar-light';
    };
    footer: {
      hidden: boolean;
      type: 'footer-static' | 'footer-sticky' | 'd-none';
      background: 'footer-dark' | 'footer-light';
    };
    enableLocalStorage: boolean;
    customizer: boolean;
    scrollTop: boolean;
    buyNow: boolean;
  };
}
