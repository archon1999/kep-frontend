import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useParams } from 'react-router';
import {
  Box,
  Card,
  LinearProgress,
  Skeleton,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { PanelHandle } from 'modules/problems/ui/shared/components/problem-detail/PanelHandles';
import { useProjectDetails } from 'modules/projects/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import ProjectSidebar from './components/ProjectSidebar';
import ProjectWorkspaceHeader from './components/ProjectWorkspaceHeader';
import ProjectWorkspacePanel from './components/ProjectWorkspacePanel';

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const { state, setField } = useRouteQueryState({
    defaults: { activeTab: 0 },
    schema: { activeTab: { ...numberParam({ min: 0, max: 2 }), param: 'tab' } },
    historyByKey: { activeTab: 'push' },
  });
  const {
    data: project,
    isLoading,
    error,
    mutate,
  } = useProjectDetails(slug, currentUser?.username);
  useDocumentTitle(
    project ? 'pageTitles.project' : undefined,
    project ? { projectTitle: project.title ?? '' } : undefined,
  );

  const descriptionContent = (
    <ProjectWorkspacePanel
      project={project}
      isLoading={isLoading}
      hasError={Boolean(error)}
      activeTab={state.activeTab === 1 ? 1 : 0}
      onTabChange={(value) => setField('activeTab', value)}
      hideTabs={isMobile}
      onRetry={() => void mutate()}
    />
  );
  const submissionContent = project ? (
    <ProjectSidebar
      key={project.slug}
      project={project}
      onSubmitted={() => {
        setField('activeTab', 1);
        void mutate();
      }}
    />
  ) : isLoading ? (
    <Box sx={{ p: 3 }}>
      <Skeleton height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={140} />
    </Box>
  ) : null;

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        minWidth: 0,
        flexDirection: 'column',
        bgcolor: 'background.elevation1',
        overflow: 'hidden',
      }}
    >
      <ProjectWorkspaceHeader project={project} />
      <Card
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: 0,
          border: { xs: 0, md: undefined },
          borderRadius: { xs: 0, md: undefined },
          boxShadow: { xs: 'none', md: undefined },
        }}
        aria-busy={isLoading}
      >
        {isLoading && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        )}
        {isMobile ? (
          <>
            <Tabs
              value={state.activeTab}
              onChange={(_, value) => setField('activeTab', value)}
              variant="fullWidth"
              aria-label={t('projects.detailTabs')}
              sx={{
                flexShrink: 0,
                bgcolor: 'background.paper',
                '& .MuiTab-root': {
                  minHeight: 58,
                  minWidth: 0,
                  px: 0.25,
                  fontSize: { xs: 10, sm: 11 },
                  fontWeight: 500,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '& .MuiTab-iconWrapper': { mb: 0.25 },
                },
                '& .MuiTab-root.Mui-selected': { fontWeight: 700 },
              }}
            >
              <Tab
                value={0}
                label={t('projects.projectTab')}
                icon={<IconifyIcon icon="mdi:book-open-page-variant" sx={{ fontSize: 19 }} />}
                iconPosition="top"
              />
              <Tab
                value={2}
                label={t('projects.solution')}
                icon={<IconifyIcon icon="mdi:file-upload-outline" sx={{ fontSize: 19 }} />}
                iconPosition="top"
              />
              <Tab
                value={1}
                label={t('projects.attempts')}
                icon={<IconifyIcon icon="mdi:history" sx={{ fontSize: 19 }} />}
                iconPosition="top"
              />
            </Tabs>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <Box sx={{ height: 1, display: state.activeTab === 2 ? 'none' : 'block' }}>
                {descriptionContent}
              </Box>
              <Box sx={{ height: 1, display: state.activeTab === 2 ? 'block' : 'none' }}>
                {submissionContent}
              </Box>
            </Box>
          </>
        ) : (
          <PanelGroup
            direction="horizontal"
            autoSaveId="project-workspace"
            style={{ flex: 1, minHeight: 0 }}
          >
            <Panel defaultSize={67} minSize={45}>
              {descriptionContent}
            </Panel>
            <PanelHandle orientation="horizontal" />
            <Panel defaultSize={33} minSize={25}>
              {submissionContent}
            </Panel>
          </PanelGroup>
        )}
      </Card>
    </Box>
  );
};

export default ProjectDetailPage;
