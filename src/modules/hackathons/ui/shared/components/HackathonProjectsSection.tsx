import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Link, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type HackathonProject } from 'modules/hackathons/domain';
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
    <Stack component="section" direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="baseline">
          <Typography component="h2" variant="subtitle1" fontWeight={700}>
            {t('hackathons.projects')}
          </Typography>
          {projects ? (
            <Typography variant="body2" color="text.secondary">
              {projects.length}
            </Typography>
          ) : null}
        </Stack>
        {showAllLink ? (
          <Link
            component={RouterLink}
            to={getResourceById(resources.HackathonProjects, hackathonId)}
            variant="body2"
            underline="hover"
          >
            {t('hackathons.viewProjects')}
          </Link>
        ) : null}
      </Stack>
      <HackathonAsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={!projects?.length}
        emptyTitle={t('hackathons.noProjectsTitle')}
        emptyMessage={t('hackathons.noProjectsMessage')}
        loadingHeight={140}
      />
      {projects?.length ? (
        <Stack direction="column" spacing={1}>
          {projects.map((project) => (
            <HackathonProjectCard key={project.id} hackathonId={hackathonId} project={project} />
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
};

export default HackathonProjectsSection;
