import { BREAKPOINT } from '@angular/flex-layout';

export const BS_BREAKPOINTS = [
  { alias: 'xs', overlapping: false, mediaQuery: '(max-width: 575.98px)' },
  { alias: 'sm', overlapping: false, mediaQuery: '(min-width: 576px) and (max-width: 767.98px)', priority: 1001 },
  { alias: 'md', overlapping: false, mediaQuery: '(min-width: 768px) and (max-width: 991.98px)', priority: 1001 },
  { alias: 'lg', overlapping: false, mediaQuery: '(min-width: 992px) and (max-width: 1199.98px)', priority: 1001 },
  { alias: 'xl', overlapping: false, mediaQuery: '(min-width: 1200px)', priority: 1001 },

  { alias: 'gt-sm', overlapping: false, mediaQuery: '(min-width: 576px)', priority: 1001 },
  { alias: 'gt-md', overlapping: false, mediaQuery: '(min-width: 768px)', priority: 1001 },
  { alias: 'gt-lg', overlapping: false, mediaQuery: '(min-width: 992px)', priority: 1001 },
  { alias: 'gt-xl', overlapping: false, mediaQuery: '(min-width: 1200px)', priority: 1001 },

  { alias: 'lt-sm', overlapping: false, mediaQuery: '(max-width: 575.98px)', priority: 1001 },
  { alias: 'lt-md', overlapping: false, mediaQuery: '(max-width: 767.98px)', priority: 1001 },
  { alias: 'lt-lg', overlapping: false, mediaQuery: '(max-width: 991.98px)', priority: 1001 },
  { alias: 'lt-xl', overlapping: false, mediaQuery: '(max-width: 1199.98px)', priority: 1001 }
];

export const CustomBreakPointsProvider = {
  provide: BREAKPOINT,
  useValue: BS_BREAKPOINTS,
  multi: true
};
