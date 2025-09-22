import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./calendar.component').then(c => c.CalendarComponent),
    title: 'Calendar.Calendar',
    data: { title: 'Calendar.Calendar' }
  },
] satisfies Routes;
