import { Box, Typography } from '@mui/material';
import { useCompetitionEvent } from 'modules/contests/application/hooks/useCompetitionEvent';
import {
  EventNavigation,
  EventPageFrame,
} from 'modules/contests/ui/shared/components/competition-events/EventPageFrame';
import { EventPrizes } from 'modules/contests/ui/shared/components/competition-events/EventPrizes';
import { EventResults } from 'modules/contests/ui/shared/components/competition-events/EventResults';
import { EventRules } from 'modules/contests/ui/shared/components/competition-events/EventRules';
import { EventSchedule } from 'modules/contests/ui/shared/components/competition-events/EventSchedule';
import { JuniorHero } from './components/JuniorHero';

const sections = ['schedule', 'prizes', 'nominations', 'results', 'rules'];

const KepJuniorAlgorithmics2024Page = () => {
  const model = useCompetitionEvent('junior2024');
  const { event, copy, common, formatters } = model;
  return (
    <EventPageFrame model={model}>
      <JuniorHero model={model} />
      <Box className="event-rule-strip" aria-hidden="true" />
      <div className="event-facts">
        {[
          {
            value: formatters.number.format(event.fund),
            label: copy('fundLabel'),
            currency: true,
          },
          { value: event.finalists, label: copy('finalistsLabel') },
          { value: '03', label: common('rounds') },
          { value: 'ACM', label: common('scoring') },
        ].map((fact) => (
          <div key={fact.label}>
            <Typography className="event-kicker">{fact.label}</Typography>
            <Typography component="strong" className="event-metric">
              {fact.value}
            </Typography>
            {'currency' in fact && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {common('currency')}
              </Typography>
            )}
          </div>
        ))}
      </div>
      <EventNavigation model={model} sections={sections} />
      <EventSchedule model={model} />
      <EventPrizes model={model} />
      <EventResults model={model} />
      <EventRules model={model} />
    </EventPageFrame>
  );
};

export default KepJuniorAlgorithmics2024Page;
