import { useState } from 'react';
import { useParams } from 'react-router';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import {
  useHackathon,
  useHackathonProjects,
  useHackathonStandings,
  useRegisterHackathon,
  useUnregisterHackathon,
} from 'modules/hackathons/application';
import { HackathonStatus } from 'modules/hackathons/domain';

export const useHackathonPage = () => {
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
  return {
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
  };
};
