import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@testing/ui/pages/tests-list/tests-list.page').then(m => m.TestsListPage),
    title: 'Tests.Tests'
  },
  {
    path: 'test/:testId',
    loadComponent: () => import('@testing/ui/pages/test-detail/test-detail.page').then(m => m.TestDetailPage),
    data: {
      title: 'Tests.Test'
    }
  },
  {
    path: 'test-pass/:testPassId',
    loadComponent: () => import('./ui/pages/test-pass/test-pass.page').then(m => m.TestPassPage),
    data: {
      title: 'Tests.TestPass'
    }
  }
] satisfies Routes;
