import type { PropsWithChildren } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Link, Tab, Tabs } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { EventSection } from './EventSection';
import { EventRoot } from './competition-event.styles';

export const EventPageFrame = ({
  model,
  children,
}: PropsWithChildren<{ model: CompetitionEventModel }>) => {
  const { event, editions, common, copy } = model;
  useDocumentTitle(`competitionEvents.events.${event.id}.title`, undefined, copy('summary'));
  return (
    <EventRoot data-event={event.id}>
      <FramedPage>
        <Box
          className="event-editions"
          sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, md: 3 }, minWidth: 0 }}
        >
          <Tabs
            value={event.id}
            variant="scrollable"
            scrollButtons="auto"
            aria-label={common('editions')}
            sx={{ minWidth: 0 }}
          >
            {editions.map((edition) => (
              <Tab
                key={edition.id}
                value={edition.id}
                component={RouterLink}
                to={edition.path}
                label={common(`editionTitles.${edition.id}`)}
              />
            ))}
          </Tabs>
        </Box>
        {children}
        {event.sources.length > 0 && (
          <EventSection id="sources" title={common('sections.sources')}>
            <Box className="event-sources">
              {event.sources.map((source) => (
                <Link key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
                  {common(`sources.${source.key}`)} ↗
                </Link>
              ))}
            </Box>
          </EventSection>
        )}
      </FramedPage>
    </EventRoot>
  );
};

export const EventNavigation = ({
  model,
  sections,
}: {
  model: CompetitionEventModel;
  sections: string[];
}) => (
  <Box component="nav" className="event-nav" aria-label={model.common('sectionsLabel')}>
    {sections.map((section) => (
      <Button variant="text" component="a" href={`#${section}`} key={section}>
        {model.common(`sections.${section}`)}
      </Button>
    ))}
  </Box>
);
