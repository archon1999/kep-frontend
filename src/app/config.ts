import { mainDrawerWidth } from 'shared/lib/constants.ts';
import type { LoginPayload } from 'modules/authentication/domain/entities/auth.entity';

export type ThemeMode = 'light' | 'dark' | 'system';
export type NavigationMenuType = 'sidenav' | 'topnav';
export type SidenavType = 'default' | 'slim';
export type TopnavType = 'default' | 'stacked' | 'slim';
export type NavColor = 'default' | 'vibrant';
export type SupportedLocales = 'en-US' | 'ru-RU' | 'uz-UZ';

export interface Config {
  assetsDir: string;
  navigationMenuType: NavigationMenuType;
  sidenavType: SidenavType;
  sidenavCollapsed: boolean;
  topnavType: TopnavType;
  navColor: NavColor;
  openNavbarDrawer: boolean;
  drawerWidth: number;
  locale: SupportedLocales;
}

export const initialConfig: Config = {
  assetsDir: import.meta.env.VITE_ASSET_BASE_URL ?? '',
  navigationMenuType: 'topnav',
  sidenavType: 'default',
  sidenavCollapsed: false,
  topnavType: 'default',
  navColor: 'vibrant',
  openNavbarDrawer: false,
  drawerWidth: mainDrawerWidth.full,
  locale: 'en-US',
};

export const defaultAuthCredentials: LoginPayload | null = null;
