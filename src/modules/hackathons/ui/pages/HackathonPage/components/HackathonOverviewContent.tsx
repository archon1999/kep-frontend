import { Stack } from '@mui/material';
import {
  type Hackathon,
  type HackathonProject,
  type HackathonStanding,
} from 'modules/hackathons/domain';
import { HackathonProjectsSection } from 'modules/hackathons/ui/shared';
import HackathonSummaryCard from './HackathonSummaryCard';

interface HackathonOverviewContentProps {
  hackathon: Hackathon;
  projects?: HackathonProject[];
  isProjectsLoading: boolean;
  projectsError?: unknown;
  standings?: HackathonStanding[];
  isStandingsLoading: boolean;
  standingsError?: unknown;
}

const HackathonOverviewContent = ({
  hackathon,
  projects,
  isProjectsLoading,
  projectsError,
  standings,
  isStandingsLoading,
  standingsError,
}: HackathonOverviewContentProps) => (
  <Stack direction="column" spacing={3}>
    <HackathonSummaryCard
      hackathon={hackathon}
      standings={standings}
      isStandingsLoading={isStandingsLoading}
      standingsError={standingsError}
    />
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
