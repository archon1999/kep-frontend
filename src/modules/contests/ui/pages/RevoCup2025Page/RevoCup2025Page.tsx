import { Link as RouterLink } from 'react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { useCompetitionEvent } from 'modules/contests/application/hooks/useCompetitionEvent';
import {
  EventNavigation,
  EventPageFrame,
} from 'modules/contests/ui/shared/components/competition-events/EventPageFrame';
import { EventPrizes } from 'modules/contests/ui/shared/components/competition-events/EventPrizes';
import { EventResults } from 'modules/contests/ui/shared/components/competition-events/EventResults';
import { EventRules } from 'modules/contests/ui/shared/components/competition-events/EventRules';
import { EventSchedule } from 'modules/contests/ui/shared/components/competition-events/EventSchedule';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { Revo2025Hero } from './components/Revo2025Hero';

const sections = ['tracks', 'results', 'schedule', 'prizes', 'rules'];

const RevoCup2025Page = () => {
  const model = useCompetitionEvent('revo2025');
  return (
    <EventPageFrame model={model}>
      <Revo2025Hero model={model} />
      <Box className="event-rule-strip" aria-hidden="true" />
      <Box
        component="section"
        id="tracks"
        className="event-track-grid"
        aria-label={model.common('tracksLabel')}
      >
        {[
          { key: 'cp', icon: 'mdi:code-tags', contestId: 427 },
          { key: 'ctf', icon: 'mdi:shield-lock-outline', contestId: 430 },
        ].map((track) => (
          <Box key={track.key} className="event-track">
            <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <IconifyIcon icon={track.icon} sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography component="h2" variant="h6">
                {model.common(`groups.${track.key}`)}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {model.copy(`tracks.${track.key}`)}
            </Typography>
            <Button
              component={RouterLink}
              to={getResourceById(resources.Contest, track.contestId)}
              variant="text"
              sx={{ mt: 2 }}
              endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
            >
              {model.common('openRound')}
            </Button>
          </Box>
        ))}
      </Box>
      <EventNavigation model={model} sections={sections} />
      <EventResults model={model} />
      <EventSchedule model={model} />
      <EventPrizes model={model} />
      <EventRules model={model} />
    </EventPageFrame>
  );
};

export default RevoCup2025Page;
