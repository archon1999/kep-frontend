import type { SxProps, Theme } from '@mui/material';

export const calendarStyles: SxProps<Theme> = (theme) => ({
  '--fc-border-color': theme.vars.palette.divider,
  '--fc-page-bg-color': theme.vars.palette.background.default,
  '--fc-neutral-bg-color': theme.vars.palette.action.hover,
  '--fc-neutral-text-color': theme.vars.palette.text.secondary,
  '--fc-today-bg-color': `color-mix(in srgb, ${theme.vars.palette.primary.main} 7%, transparent)`,
  '--fc-highlight-color': `color-mix(in srgb, ${theme.vars.palette.primary.main} 12%, transparent)`,
  '& .fc': { fontFamily: theme.typography.fontFamily, fontSize: 13 },
  '& .fc .fc-col-header-cell': {
    bgcolor: 'background.default',
    color: 'text.secondary',
    borderColor: 'divider',
  },
  '& .fc .fc-col-header-cell-cushion': {
    py: 1.5,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '.06em',
  },
  '& .fc a': { color: 'inherit', textDecoration: 'none' },
  '& .fc .fc-scrollgrid': { borderTop: 0, borderLeft: 0 },
  '& .fc .fc-daygrid-day-frame': { minHeight: { xs: 72, sm: 104 } },
  '& .fc .fc-daygrid-day-number': {
    p: 1,
    fontFamily: 'var(--kep-display-font)',
    fontFeatureSettings: '"ss01" 1',
    fontSize: { xs: 16, sm: 20 },
    fontVariantNumeric: 'tabular-nums',
  },
  '& .fc .fc-day-today .fc-daygrid-day-number': {
    color: 'primary.main',
    boxShadow: 'inset 0 -2px var(--kep-logo-ice)',
  },
  '& .fc .fc-daygrid-event': {
    borderRadius: 0,
    px: 0.5,
    py: 0.5,
    fontSize: 11,
    borderWidth: '0 0 0 2px',
  },
  '& .fc .fc-event-title': { fontWeight: 500 },
  '& .fc .fc-popover': {
    bgcolor: 'background.default',
    borderColor: 'divider',
    boxShadow: theme.shadows[3],
  },
  '& .fc .fc-timegrid-slot': { height: 40 },
});
