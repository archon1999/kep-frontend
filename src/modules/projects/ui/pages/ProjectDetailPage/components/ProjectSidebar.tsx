import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import type { Project } from 'modules/projects/domain/entities/project.entity';
import ProjectSubmissionForm from 'modules/projects/ui/shared/components/ProjectSubmissionForm';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';

interface ProjectSidebarProps {
  project: Project;
  onSubmitted?: () => void;
  hackathonId?: number;
  projectSymbol?: string;
}

const ProjectSidebar = (props: ProjectSidebarProps) => {
  const { t } = useTranslation();
  return (
    <WorkspacePane>
      <WorkspaceToolbar>
        <IconifyIcon icon="mdi:file-upload-outline" sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2">{t('projects.solution')}</Typography>
      </WorkspaceToolbar>
      <ProjectSubmissionForm key={props.project.slug} {...props} />
    </WorkspacePane>
  );
};
export default ProjectSidebar;
