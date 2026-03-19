import { mainDrawerWidth } from 'shared/lib/constants.ts';
import type { LoginPayload } from 'modules/authentication/domain/entities/auth.entity';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePreset =
  | 'default-light'
  | 'default-dark'
  | 'luxury'
  | 'retro'
  | 'arctic'
  | 'nature'
  | 'ember'
  | 'dracula'
  | 'midnight';
export type NavigationMenuType = 'sidenav' | 'topnav';
export type SidenavType = 'default' | 'slim';
export type TopnavType = 'default' | 'stacked' | 'slim';
export type NavColor = 'default' | 'vibrant';
export type SupportedLocales = 'en-US' | 'ru-RU' | 'uz-UZ';
export const fontFamilies = ['Plus Jakarta Sans', 'Inter', 'Roboto', 'DM Sans'] as const;
export type FontFamily = (typeof fontFamilies)[number];
export const backgroundPatterns = ['none', 'grid', 'dots', 'diagonal', 'mesh'] as const;
export type BackgroundPattern = (typeof backgroundPatterns)[number];
export const cardStyles = ['default', 'outline', 'corners', 'glow'] as const;
export type CardStyle = (typeof cardStyles)[number];
export const cardBackgrounds = ['default', 'tint', 'gradient', 'glass'] as const;
export type CardBackground = (typeof cardBackgrounds)[number];

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
  themePreset: ThemePreset;
  primaryColor?: string | null;
  fontFamily: FontFamily;
  fontSize: number;
  backgroundPattern: BackgroundPattern;
  cardStyle: CardStyle;
  cardBackground: CardBackground;
}

export const initialConfig: Config = {
  assetsDir: '',
  navigationMenuType: 'topnav',
  sidenavType: 'default',
  sidenavCollapsed: false,
  topnavType: 'default',
  navColor: 'vibrant',
  openNavbarDrawer: false,
  drawerWidth: mainDrawerWidth.full,
  locale: 'en-US',
  themePreset: 'default-light',
  primaryColor: null,
  fontFamily: fontFamilies[0],
  fontSize: 16,
  backgroundPattern: 'none',
  cardStyle: 'default',
  cardBackground: 'default',
};

export const defaultAuthCredentials: LoginPayload | null = null;
