import { lazy } from 'react';

export const AdminContestFilterFormPage = lazy(
  () => import('./AdminContestFilterFormPage/AdminContestFilterFormPage'),
);
export const AdminContestFiltersListPage = lazy(
  () => import('./AdminContestFiltersListPage/AdminContestFiltersListPage'),
);
export const AdminContestFormPage = lazy(
  () => import('./AdminContestFormPage/AdminContestFormPage'),
);
export const AdminContestQuestionFormPage = lazy(
  () => import('./AdminContestQuestionFormPage/AdminContestQuestionFormPage'),
);
export const AdminContestQuestionsListPage = lazy(
  () => import('./AdminContestQuestionsListPage/AdminContestQuestionsListPage'),
);
export const AdminContestsListPage = lazy(
  () => import('./AdminContestsListPage/AdminContestsListPage'),
);
export const AdminContestTypeFormPage = lazy(
  () => import('./AdminContestTypeFormPage/AdminContestTypeFormPage'),
);
export const AdminContestTypesListPage = lazy(
  () => import('./AdminContestTypesListPage/AdminContestTypesListPage'),
);
