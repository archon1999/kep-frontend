import { Link as RouterLink } from 'react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { getRankColor } from 'app/theme/colors/medals';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { EventSection } from './EventSection';

export const EventResults = ({ model }: { model: CompetitionEventModel }) => {
  const { event, common, copy } = model;
  const awardWinners = event.nominations?.filter((nomination) => nomination.winner) ?? [];
  if (!event.results.length) return null;
  return (
    <EventSection id="results" title={common('sections.results')}>
      <Box className={event.results.length > 1 ? 'event-two-columns' : undefined}>
        {event.results.map((group) => (
          <Box className="event-result-group" key={group.key}>
            <Typography component="h3" variant="subtitle1" sx={{ mb: 2.5 }}>
              {common(`groups.${group.key}`)}
            </Typography>
            <Box className="event-podium">
              {group.usernames.map((username, index) => (
                <Box
                  className="event-podium-place"
                  key={username}
                  sx={{ '--prize-color': getRankColor(index + 1) }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Typography
                      variant="metric"
                      sx={{ color: getRankColor(index + 1), fontSize: 34 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Typography>
                    <IconifyIcon
                      icon={index === 0 ? 'mdi:trophy-outline' : 'mdi:medal-outline'}
                      sx={{ fontSize: 26, color: getRankColor(index + 1) }}
                    />
                  </Stack>
                  <UserPopover username={username}>
                    <Typography variant="subtitle1" sx={{ overflowWrap: 'anywhere' }}>
                      {username}
                    </Typography>
                  </UserPopover>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {common('place', { rank: index + 1 })}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Button
              sx={{ mt: 2 }}
              component={RouterLink}
              to={getResourceById(resources.ContestStandings, group.contestId)}
              endIcon={<IconifyIcon icon="mdi:arrow-right" />}
            >
              {common('fullStandings')}
            </Button>
          </Box>
        ))}
      </Box>
      {awardWinners.length > 0 && (
        <Box>
          <Typography component="h3" variant="h6" sx={{ mb: 3 }}>
            {common('nominationWinners')}
          </Typography>
          <Box className="event-award-results">
            {awardWinners.map((award) => (
              <Box key={award.key} className="event-award-result">
                <IconifyIcon
                  icon="mdi:star-four-points-outline"
                  sx={{ color: 'secondary.main', fontSize: 26 }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {copy(`nominations.${award.key}.title`)}
                  </Typography>
                  <UserPopover username={award.winner!}>
                    <Typography variant="subtitle1" sx={{ overflowWrap: 'anywhere' }}>
                      {award.winner}
                    </Typography>
                  </UserPopover>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </EventSection>
  );
};
