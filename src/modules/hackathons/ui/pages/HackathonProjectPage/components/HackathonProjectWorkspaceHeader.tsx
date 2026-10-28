import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import type { Hackathon, HackathonProject } from 'modules/hackathons/domain';
import { HackathonStatusChip } from 'modules/hackathons/ui/shared';
import ProjectWorkspaceHeader from 'modules/projects/ui/shared/components/ProjectWorkspaceHeader';

interface HackathonProjectWorkspaceHeaderProps {
  hackathon?: Hackathon;
  hackathonProject?: HackathonProject;
  hackathonId?: string;
}

const HackathonProjectWorkspaceHeader = ({
  hackathon,
  hackathonProject,
  hackathonId,
}: HackathonProjectWorkspaceHeaderProps) => {
  const { t } = useTranslation();
  const id = hackathon?.id ?? hackathonId;
  return (
    <ProjectWorkspaceHeader
      project={hackathonProject?.project}
      title={
        hackathonProject
          ? `${hackathonProject.symbol}. ${hackathonProject.project.title}`
          : undefined
      }
      backTo={id ? getResourceById(resources.HackathonProjects, id) : resources.Hackathons}
      backLabel={t('hackathons.backToProjects')}
      context={
        hackathon ? (
          <>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 280 }}>
              {hackathon.title}
            </Typography>
            <HackathonStatusChip hackathon={hackathon} />
          </>
        ) : undefined
      }
    />
  );
};

export default HackathonProjectWorkspaceHeader;
