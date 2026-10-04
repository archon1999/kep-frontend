import { useState } from 'react';
import { useParams } from 'react-router';
import { Grid } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import {
  useHackathon,
  useHackathonProjects,
  useHackathonStandings,
  useRegisterHackathon,
  useUnregisterHackathon,
} from 'modules/hackathons/application';
import { HackathonStatus } from 'modules/hackathons/domain';
import { HackathonDetailLayout, getHackathonProjectPoints } from 'modules/hackathons/ui/shared';
import HackathonOverviewAside from './components/HackathonOverviewAside';
import HackathonOverviewContent from './components/HackathonOverviewContent';

const HackathonPage = () => {
  const { id } = useParams();
  const [registrationError, setRegistrationError] = useState(false);
  const { data: hackathon, isLoading, error, mutate } = useHackathon(id);
  const {
    data: projects,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useHackathonProjects(id);
  const {
    data: standings,
    isLoading: isStandingsLoading,
    error: standingsError,
  } = useHackathonStandings(
    hackathon && hackathon.status !== HackathonStatus.NOT_STARTED ? id : undefined,
    { refreshInterval: hackathon?.status === HackathonStatus.FINISHED ? 0 : 30000 },
  );
  const { trigger: registerHackathon, isMutating: isRegistering } = useRegisterHackathon();
  const { trigger: unregisterHackathon, isMutating: isUnregistering } = useUnregisterHackathon();
  const canChangeRegistration = hackathon?.status === HackathonStatus.ALREADY;
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathon' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );

  const handleRegistration = async () => {
    if (!id || !canChangeRegistration) return;
    setRegistrationError(false);
    try {
      if (hackathon?.isRegistered) await unregisterHackathon(id);
      else await registerHackathon(id);
      await mutate();
    } catch {
      setRegistrationError(true);
    }
  };

  return (
    <HackathonDetailLayout hackathon={hackathon} isLoading={isLoading} error={error}>
      {hackathon ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
            <HackathonOverviewContent
              hackathon={hackathon}
              projects={projects}
              isProjectsLoading={isProjectsLoading}
              projectsError={projectsError}
              standings={standings}
              isStandingsLoading={isStandingsLoading}
              standingsError={standingsError}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
            <HackathonOverviewAside
              hackathon={hackathon}
              totalPoints={projects?.reduce(
                (sum, project) => sum + getHackathonProjectPoints(project),
                0,
              )}
              isProjectsLoading={isProjectsLoading}
              onRegistration={handleRegistration}
              isMutating={isRegistering || isUnregistering}
              registrationError={registrationError}
            />
          </Grid>
        </Grid>
      ) : null}
    </HackathonDetailLayout>
  );
};

export default HackathonPage;
