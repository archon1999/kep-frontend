import type { AdminResource } from 'modules/admin/domain';
import { resources } from './resources';

export const adminLegacyAliases = [
  { path: 'problems/attempts', key: 'backend.attempt' },
  { path: 'problems/chapters', key: 'backend.chapter' },
  { path: 'problems/tags', key: 'backend.tag' },
  { path: 'contests/questions', key: 'contests.contestquestion' },
  { path: 'contests/types', key: 'contests.contesttype' },
  { path: 'contests/filters', key: 'contests.filter' },
  { path: 'users/teams', key: 'backend.team' },
];

export const adminResourcePath = (key: string, catalog: AdminResource[]) =>
  catalog.find((resource) => resource.key === key)?.path ??
  `${resources.AdminManage}/${key.replace('.', '/')}`;
