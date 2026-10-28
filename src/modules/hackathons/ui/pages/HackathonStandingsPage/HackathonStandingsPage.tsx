import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { useHackathonStandingsPage } from 'modules/hackathons/application/hooks/useHackathonStandingsPage';
import { HackathonAsyncState, HackathonDetailLayout } from 'modules/hackathons/ui/shared';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import HackathonStandingsTable from './components/HackathonStandingsTable';

const HackathonStandingsPage = () => {
  const {
    hackathon,
    isHackathonLoading,
    hackathonError,
    isLoading,
    error,
    projects,
    isProjectsLoading,
    projectsError,
    rankedStandings,
  } = useHackathonStandingsPage();

  const { t } = useTranslation();

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Box component="section">
        <SectionHeader
          title={t('hackathons.standings')}
          description={t('hackathons.standingsLead')}
          action={
            <Stack direction="row" gap={2} flexWrap="wrap" color="text.secondary">
              <Typography variant="caption">
                {t('hackathons.participantsCount', { count: rankedStandings.length })}
              </Typography>
              <Typography variant="caption">
                {t('hackathons.projectsCount', { count: projects?.length ?? 0 })}
              </Typography>
            </Stack>
          }
        />
        {isLoading || isProjectsLoading || error || projectsError || !rankedStandings.length ? (
          <HackathonAsyncState
            isLoading={isLoading || isProjectsLoading}
            error={error || projectsError}
            isEmpty={!rankedStandings.length}
            emptyTitle={t('hackathons.standingsEmptyTitle')}
            emptyMessage={t('hackathons.standingsEmptyMessage')}
          />
        ) : (
          <HackathonStandingsTable standings={rankedStandings} projects={projects ?? []} />
        )}
      </Box>
    </HackathonDetailLayout>
  );
};

export default HackathonStandingsPage;
