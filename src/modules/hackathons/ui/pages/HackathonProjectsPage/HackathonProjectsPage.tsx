import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonProjects } from 'modules/hackathons/application';
import {
  HackathonCountdownCard,
  HackathonDetailLayout,
  HackathonProjectsSection,
} from 'modules/hackathons/ui/shared';

const HackathonProjectsPage = () => {
  const { id } = useParams();
  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);
  const { data: projects, isLoading, error } = useHackathonProjects(id);
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonProjects' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <HackathonProjectsSection
            hackathonId={id ?? ''}
            projects={projects}
            isLoading={isLoading}
            error={error}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <HackathonCountdownCard hackathon={hackathon} />
        </Grid>
      </Grid>
    </HackathonDetailLayout>
  );
};

export default HackathonProjectsPage;
