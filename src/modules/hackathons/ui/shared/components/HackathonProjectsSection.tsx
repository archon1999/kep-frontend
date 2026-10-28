import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Stack } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type HackathonProject } from 'modules/hackathons/domain';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import HackathonAsyncState from './HackathonAsyncState';
import HackathonProjectCard from './HackathonProjectCard';

interface HackathonProjectsSectionProps {
  hackathonId: number | string;
  projects?: HackathonProject[];
  isLoading: boolean;
  error?: unknown;
  showAllLink?: boolean;
}

const HackathonProjectsSection = ({
  hackathonId,
  projects,
  isLoading,
  error,
  showAllLink = false,
}: HackathonProjectsSectionProps) => {
  const { t } = useTranslation();

  return (
    <Box component="section">
      <SectionHeader
        title={t('hackathons.projects')}
        description={t('hackathons.projectsLead')}
        action={
          showAllLink ? (
            <Button
              component={RouterLink}
              to={getResourceById(resources.HackathonProjects, hackathonId)}
              variant="text"
              endIcon={<span aria-hidden="true">↗</span>}
            >
              {t('hackathons.viewProjects')}
            </Button>
          ) : undefined
        }
      />
      <HackathonAsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!projects?.length}
        emptyTitle={t('hackathons.noProjectsTitle')}
        emptyMessage={t('hackathons.noProjectsMessage')}
        loadingHeight={140}
      />
      {projects?.length ? (
        <Stack direction="column" spacing={0}>
          {projects.map((project) => (
            <HackathonProjectCard key={project.id} hackathonId={hackathonId} project={project} />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
};

export default HackathonProjectsSection;
