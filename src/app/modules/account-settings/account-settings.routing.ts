import { Route } from '@angular/router';
import { AuthGuard } from '@auth';

export default [
  {
    path: '',
    loadComponent: () => import('./account-settings.component').then(c => c.AccountSettingsComponent),
    title: 'Users.AccountSettings',
    data: { title: 'Users.AccountSettings' },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./general-settings/general-settings.component').then(c => c.GeneralSettingsComponent),
      },
      {
        path: 'change-password',
        loadComponent: () => import('./change-password/change-password.component').then(c => c.ChangePasswordComponent),
      },
      {
        path: 'information',
        loadComponent: () => import('./information/information.component').then(c => c.InformationComponent),
      },
      {
        path: 'social',
        loadComponent: () => import('./social/social.component').then(c => c.SocialComponent),
      },
      {
        path: 'skills',
        loadComponent: () => import('./skills/skills.component').then(c => c.SkillsComponent),
      },
      {
        path: 'career',
        loadComponent: () => import('./career/career.component').then(c => c.CareerComponent),
      },
      {
        path: 'teams',
        loadComponent: () => import('./teams/teams.component').then(c => c.TeamsComponent),
      },
      {
        path: 'system',
        loadComponent: () => import('./system/system.component').then(c => c.SystemComponent),
      },
    ]
  },
] satisfies Route[];
