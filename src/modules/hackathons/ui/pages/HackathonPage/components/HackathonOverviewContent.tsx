import { Stack } from '@mui/material';
import { type Hackathon, type HackathonProject } from 'modules/hackathons/domain';
import { HackathonProjectsSection } from 'modules/hackathons/ui/shared';
import HackathonSummaryCard from './HackathonSummaryCard';

interface HackathonOverviewContentProps {
  hackathon: Hackathon;
  projects?: HackathonProject[];
  isProjectsLoading: boolean;
  projectsError?: unknown;
}

const HackathonOverviewContent = ({
  hackathon,
  projects,
  isProjectsLoading,
  projectsError,
}: HackathonOverviewContentProps) => (
  <Stack direction="column" spacing={0}>
    <HackathonSummaryCard hackathon={hackathon} />
    <HackathonProjectsSection
      hackathonId={hackathon.id}
      projects={projects}
      isLoading={isProjectsLoading}
      error={projectsError}
      showAllLink
    />
  </Stack>
);

export default HackathonOverviewContent;
