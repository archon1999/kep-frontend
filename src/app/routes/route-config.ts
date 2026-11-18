import { resources } from './resources';

export const rootPaths = {
  root: resources.Home,
  authRoot: '',
} as const;

export const authPaths = {
  login: resources.Login,
} as const;

export const apiEndpoints = {
  register: '/auth/register',
  login: '/api/login/',
  logout: '/api/logout/',
  profile: '/api/me',
  oauthAuthorize: '/api/oauth/authorize/',
  revoSetPassword: '/api/auth/revo/set-password/',
  getUsers: '/users',
  setLanguage: '/api/set-language/',
} as const;

export type RootPathKey = keyof typeof rootPaths;
