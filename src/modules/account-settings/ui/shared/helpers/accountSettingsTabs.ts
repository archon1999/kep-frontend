import type { ReactNode } from 'react';
import { resources } from 'app/routes/resources';

export interface AccountSettingsTab {
  id: number;
  value: string;
  label: string;
  icon: string;
  panelIcon?: string;
  description?: string;
  render: ReactNode;
}

export const accountSettingsTabRoutes = {
  general: resources.Settings,
  password: resources.SettingsChangePassword,
  information: resources.SettingsInformation,
  social: resources.SettingsSocial,
  skills: resources.SettingsSkills,
  career: resources.SettingsCareer,
  teams: resources.SettingsTeams,
  system: resources.SettingsSystem,
} as const;

export type AccountSettingsTabValue = keyof typeof accountSettingsTabRoutes;

const normalizePathname = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

export const getAccountSettingsTabValue = (pathname: string): AccountSettingsTabValue => {
  const normalizedPathname = normalizePathname(pathname);

  const matchedEntry = (Object.entries(accountSettingsTabRoutes) as Array<
    [AccountSettingsTabValue, string]
  >).find(([, route]) => normalizePathname(route) === normalizedPathname);

  return matchedEntry?.[0] ?? 'general';
};
