import { Box } from '@mui/material';
import { useHackathonProjectsPage } from 'modules/hackathons/application/hooks/useHackathonProjectsPage';
import { HackathonDetailLayout, HackathonProjectsSection } from 'modules/hackathons/ui/shared';

const HackathonProjectsPage = () => {
  const { id, hackathon, isHackathonLoading, hackathonError, projects, isLoading, error } =
    useHackathonProjectsPage();

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Box>
        <HackathonProjectsSection
          hackathonId={id ?? ''}
          projects={projects}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </HackathonDetailLayout>
  );
};

export default HackathonProjectsPage;
