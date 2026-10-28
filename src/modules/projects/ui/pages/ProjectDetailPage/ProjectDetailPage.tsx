import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { useProjectDetailPage } from 'modules/projects/application/hooks/useProjectDetailPage';
import ProjectWorkspaceHeader from 'modules/projects/ui/shared/components/ProjectWorkspaceHeader';
import ProjectWorkspaceLayout from 'modules/projects/ui/shared/components/ProjectWorkspaceLayout';
import ProjectWorkspacePanel from 'modules/projects/ui/shared/components/ProjectWorkspacePanel';
import ProjectSidebar from './components/ProjectSidebar';

const ProjectDetailPage = () => {
  const { project, isLoading, hasError, activeTab, onTabChange, onRetry, onSubmitted } =
    useProjectDetailPage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const descriptionContent = (
    <ProjectWorkspacePanel
      project={project}
      isLoading={isLoading}
      hasError={hasError}
      activeTab={activeTab === 1 ? 1 : 0}
      onTabChange={onTabChange}
      hideTabs={isMobile}
      onRetry={onRetry}
    />
  );
  const submissionContent = project ? (
    <ProjectSidebar key={project.slug} project={project} onSubmitted={onSubmitted} />
  ) : isLoading ? (
    <Box sx={{ p: 3 }}>
      <Skeleton height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={140} />
    </Box>
  ) : null;

  return (
    <ProjectWorkspaceLayout
      header={<ProjectWorkspaceHeader project={project} />}
      description={descriptionContent}
      solution={submissionContent}
      activeTab={activeTab}
      onTabChange={onTabChange}
      isLoading={isLoading}
    />
  );
};

export default ProjectDetailPage;
