import { Box } from '@mui/material';
import { useCompetitionEvent } from 'modules/contests/application/hooks/useCompetitionEvent';
import {
  EventNavigation,
  EventPageFrame,
} from 'modules/contests/ui/shared/components/competition-events/EventPageFrame';
import { EventPrizes } from 'modules/contests/ui/shared/components/competition-events/EventPrizes';
import { EventRules } from 'modules/contests/ui/shared/components/competition-events/EventRules';
import { EventSchedule } from 'modules/contests/ui/shared/components/competition-events/EventSchedule';
import { Revo2026Hero } from './components/Revo2026Hero';

const sections = ['schedule', 'prizes', 'nominations', 'rules'];

const RevoCup2026Page = () => {
  const model = useCompetitionEvent('revo2026');
  return (
    <EventPageFrame model={model}>
      <Revo2026Hero model={model} />
      <Box className="event-rule-strip" aria-hidden="true" />
      <EventNavigation model={model} sections={sections} />
      <EventSchedule model={model} />
      <EventPrizes model={model} />
      <EventRules model={model} />
    </EventPageFrame>
  );
};

export default RevoCup2026Page;
