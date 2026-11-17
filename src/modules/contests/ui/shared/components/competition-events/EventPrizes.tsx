import { Box, Stack, Typography } from '@mui/material';
import { getRankColor } from 'app/theme/colors/medals';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { EventSection } from './EventSection';

const nominationIcons: Record<string, string> = {
  firstBlood: 'mdi:lightning-bolt-outline',
  female: 'mdi:flower-outline',
  youngest: 'mdi:sprout-outline',
  veteran: 'mdi:star-four-points-outline',
  solution: 'mdi:code-braces',
  lastMinute: 'mdi:timer-outline',
  persistent: 'mdi:flag-checkered',
  youngCoder: 'mdi:sprout-outline',
  femaleCoder: 'mdi:flower-outline',
  bestSolution: 'mdi:code-braces',
  alKhorezmiy: 'mdi:star-four-points-outline',
  sensation: 'mdi:lightning-bolt-outline',
  raffle: 'mdi:gift-outline',
};

export const EventPrizes = ({ model }: { model: CompetitionEventModel }) => {
  const { event, common, copy, formatters } = model;
  return (
    <>
      <EventSection id="prizes" title={common('sections.prizes')}>
        <Box className="event-prize-groups">
          {event.prizeGroups.map((group) => (
            <Box key={group.key}>
              <Typography component="h3" variant="subtitle1" sx={{ mb: 2.5 }}>
                {common(`groups.${group.key}`)}
              </Typography>
              <Box className="event-prize-grid">
                {group.prizes.slice(0, 3).map((prize) => (
                  <Box
                    key={prize.from}
                    className="event-prize"
                    sx={{ '--prize-color': getRankColor(prize.from) }}
                  >
                    <Stack
                      direction="row"
                      className="event-prize-heading"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                    >
                      <Typography
                        variant="metric"
                        sx={{ color: getRankColor(prize.from), fontSize: 24 }}
                      >
                        {String(prize.from).padStart(2, '0')}
                      </Typography>
                      <IconifyIcon
                        icon="mdi:trophy-outline"
                        sx={{ color: getRankColor(prize.from), fontSize: 30 }}
                      />
                    </Stack>
                    <Typography component="strong" variant="metric" className="event-prize-value">
                      {formatters.number.format(prize.amount)}
                    </Typography>
                    <Typography variant="body2" className="event-prize-currency" sx={{ mt: 1 }}>
                      {common('currency')}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="event-prize-place"
                      color="text.secondary"
                      sx={{ mt: 3, display: 'block' }}
                    >
                      {common('place', { rank: prize.from })}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {group.prizes.length > 3 && (
                <Box className="event-prize-ranges">
                  {group.prizes.slice(3).map((prize) => (
                    <Box className="event-prize-range" key={prize.from}>
                      <Typography variant="body2" color="text.secondary">
                        {common('places', { from: prize.from, to: prize.to })}
                      </Typography>
                      <Typography variant="metric" sx={{ fontSize: 30, mt: 1 }}>
                        {formatters.number.format(prize.amount)}{' '}
                        <Typography component="span" variant="body2">
                          {common('currency')} / {common('each')}
                        </Typography>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </EventSection>
      {event.nominations && (
        <EventSection id="nominations" title={common('sections.nominations')}>
          <Box className="event-nominations">
            {event.nominations.map((nomination) => (
              <Box className="event-nomination" key={nomination.key}>
                <IconifyIcon icon={nominationIcons[nomination.key]} className="event-award-icon" />
                <Box sx={{ minWidth: 0 }}>
                  <Typography component="h3" variant="subtitle1">
                    {copy(`nominations.${nomination.key}.title`)}
                  </Typography>
                  {event.id !== 'junior2024' && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, lineHeight: 1.8 }}
                    >
                      {copy(`nominations.${nomination.key}.body`)}
                    </Typography>
                  )}
                  <Typography
                    variant="metric"
                    sx={{ color: 'secondary.main', fontSize: 28, mt: 2, display: 'block' }}
                  >
                    {formatters.number.format(nomination.amount)}{' '}
                    <Typography component="span" variant="body2">
                      {common('currency')}
                      {nomination.quantity ? ` × ${nomination.quantity}` : ''}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </EventSection>
      )}
    </>
  );
};
