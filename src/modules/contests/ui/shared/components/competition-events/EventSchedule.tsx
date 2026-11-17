import { Link as RouterLink } from 'react-router';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { EventSection } from './EventSection';

export const EventSchedule = ({ model }: { model: CompetitionEventModel }) => {
  const { event, common, copy, formatters } = model;
  return (
    <EventSection id="schedule" title={common('sections.schedule')}>
      <Box className={event.finalDay ? 'event-schedule-layout' : undefined}>
        <Box className={`event-rounds event-rounds-${event.stages.length}`}>
          {event.stages.map((stage, index) => (
            <Box
              className={`event-round${stage.mode === 'offline' ? ' event-round-final' : ''}`}
              key={stage.key}
            >
              <Stack
                className="event-round-meta"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
              >
                <Typography className="event-kicker">
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Chip
                  size="small"
                  variant="soft"
                  color={stage.mode === 'online' ? 'primary' : 'secondary'}
                  label={common(stage.mode)}
                />
              </Stack>
              <Stack
                className="event-round-date"
                component="time"
                dateTime={stage.start}
                aria-label={formatters.date.format(new Date(stage.start))}
                direction="row"
                gap={1.5}
                alignItems="center"
                sx={{ mt: 3, mb: 2 }}
              >
                <Typography variant="metric" sx={{ fontSize: 48, lineHeight: 1 }}>
                  {formatters.day.format(new Date(stage.start))}
                </Typography>
                <Box>
                  <Typography className="event-kicker" sx={{ color: 'primary.main', fontSize: 13 }}>
                    {formatters.month.format(new Date(stage.start))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.year}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                className="event-round-title"
                component="h3"
                variant="subtitle1"
                sx={{ minHeight: 28 }}
              >
                {common(`stages.${stage.key}`)}
              </Typography>
              <Typography
                className="event-round-time"
                variant="body2"
                sx={{ mt: 1.5, fontVariantNumeric: 'tabular-nums' }}
              >
                {formatters.time.format(new Date(stage.start))}–
                {formatters.time.format(new Date(stage.end))}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
                flexWrap="wrap"
                sx={{ mt: 'auto', pt: 3 }}
                className="event-round-footer"
              >
                {stage.problems > 1 && (
                  <Typography variant="caption" color="text.secondary">
                    {common('problemCount', { count: stage.problems })}
                  </Typography>
                )}
                {stage.contestId && (
                  <Button
                    component={RouterLink}
                    to={getResourceById(resources.Contest, stage.contestId)}
                    size="small"
                    variant="text"
                    endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
                  >
                    {common('openRound')}
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
        {event.finalDay && (
          <Box className="event-day-program">
            <Typography component="h3" variant="h6">
              {common('finalDay')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              {formatters.date.format(new Date(event.stages[event.stages.length - 1].start))}
            </Typography>
            <Box component="ol" className="event-timeline">
              {event.finalDay.map((entry) => (
                <Box component="li" className="event-timeline-row" key={entry.key}>
                  <Typography className="event-timeline-time">{entry.time}</Typography>
                  <Box className="event-timeline-copy">
                    <Typography variant="subtitle2">{copy(`day.${entry.key}.title`)}</Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}
                    >
                      <IconifyIcon icon="mdi:map-marker-outline" sx={{ fontSize: 14 }} />
                      {copy(`day.${entry.key}.place`)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </EventSection>
  );
};
