import { Box } from '@mui/material';
import { useHackathonPage } from 'modules/hackathons/application/hooks/useHackathonPage';
import { HackathonDetailLayout, getHackathonProjectPoints } from 'modules/hackathons/ui/shared';
import HackathonOverviewAside from './components/HackathonOverviewAside';
import HackathonOverviewContent from './components/HackathonOverviewContent';

const HackathonPage = () => {
  const {
    hackathon,
    isLoading,
    error,
    projects,
    isProjectsLoading,
    projectsError,
    standings,
    isStandingsLoading,
    standingsError,
    isRegistering,
    isUnregistering,
    handleRegistration,
    registrationError,
  } = useHackathonPage();

  return (
    <HackathonDetailLayout hackathon={hackathon} isLoading={isLoading} error={error}>
      {hackathon ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 1fr) 320px',
              xl: 'minmax(0, 1fr) 360px',
            },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <HackathonOverviewContent
              hackathon={hackathon}
              projects={projects}
              isProjectsLoading={isProjectsLoading}
              projectsError={projectsError}
            />
          </Box>
          <Box
            component="aside"
            sx={{
              minWidth: 0,
              borderLeft: { md: 1 },
              borderTop: { xs: 1, md: 0 },
              borderColor: { xs: 'divider', md: 'divider' },
            }}
          >
            <HackathonOverviewAside
              hackathon={hackathon}
              standings={standings}
              isStandingsLoading={isStandingsLoading}
              standingsError={standingsError}
              totalPoints={projects?.reduce(
                (sum, project) => sum + getHackathonProjectPoints(project),
                0,
              )}
              isProjectsLoading={isProjectsLoading}
              onRegistration={handleRegistration}
              isMutating={isRegistering || isUnregistering}
              registrationError={registrationError}
            />
          </Box>
        </Box>
      ) : null}
    </HackathonDetailLayout>
  );
};

export default HackathonPage;
