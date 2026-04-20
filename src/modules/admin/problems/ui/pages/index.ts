import { lazy } from 'react';

export const AdminProblemAttemptFormPage = lazy(
  () => import('./AdminProblemAttemptFormPage/AdminProblemAttemptFormPage'),
);
export const AdminProblemAttemptsListPage = lazy(
  () => import('./AdminProblemAttemptsListPage/AdminProblemAttemptsListPage'),
);
export const AdminProblemChapterFormPage = lazy(
  () => import('./AdminProblemChapterFormPage/AdminProblemChapterFormPage'),
);
export const AdminProblemChaptersListPage = lazy(
  () => import('./AdminProblemChaptersListPage/AdminProblemChaptersListPage'),
);
export const AdminProblemFormPage = lazy(
  () => import('./AdminProblemFormPage/AdminProblemFormPage'),
);
export const AdminProblemsListPage = lazy(
  () => import('./AdminProblemsListPage/AdminProblemsListPage'),
);
export const AdminProblemTagFormPage = lazy(
  () => import('./AdminProblemTagFormPage/AdminProblemTagFormPage'),
);
export const AdminProblemTagsListPage = lazy(
  () => import('./AdminProblemTagsListPage/AdminProblemTagsListPage'),
);
