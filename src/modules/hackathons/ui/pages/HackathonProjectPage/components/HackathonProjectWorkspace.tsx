import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { type Hackathon, type HackathonProject } from 'modules/hackathons/domain';
import { getHackathonProjectPoints } from 'modules/hackathons/ui/shared';
import { PanelHandle } from 'modules/problems/ui/shared/components/problem-detail/PanelHandles';
import ProjectAttempts from 'modules/projects/ui/pages/ProjectDetailPage/components/ProjectAttempts';
import { resolveProjectFileAccept } from 'modules/projects/ui/shared/lib/upload';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam } from 'shared/lib/queryParams';
import HackathonProjectDescription from './HackathonProjectDescription';
import HackathonProjectSidebar from './HackathonProjectSidebar';

type WorkspaceTab = 'project' | 'solution' | 'attempts';

interface HackathonProjectWorkspaceProps {
  hackathonProject: HackathonProject;
  hackathon: Hackathon;
  onRefresh: () => void;
}

const HackathonProjectWorkspace = ({
  hackathonProject,
  hackathon,
  onRefresh,
}: HackathonProjectWorkspaceProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, setField } = useRouteQueryState<{ activeTab: WorkspaceTab }>({
    defaults: { activeTab: 'project' },
    schema: {
      activeTab: { ...enumParam(['project', 'solution', 'attempts'] as const), param: 'workspace' },
    },
    historyByKey: { activeTab: 'push' },
  });
  const project = hackathonProject.project;
  const rightTab = state.activeTab === 'attempts' ? 'attempts' : 'solution';

  const brief = (
    <Box sx={{ height: 1, overflowY: 'auto', p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
        <Avatar
          variant="rounded"
          src={project.logo}
          alt=""
          sx={{
            display: { xs: 'none', sm: 'flex' },
            width: { xs: 40, sm: 54 },
            height: { xs: 40, sm: 54 },
            borderRadius: 2.5,
            bgcolor: 'transparent',
            '& img': { objectFit: 'contain' },
          }}
        >
          {project.title.charAt(0)}
        </Avatar>
        <Stack direction="column" spacing={1.5} sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            variant="h5"
            fontWeight={600}
            sx={{ overflowWrap: 'anywhere' }}
          >
            {hackathonProject.symbol}. {project.title}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              variant="soft"
              size="small"
              color={
                project.level <= 1
                  ? 'info'
                  : project.level === 2
                    ? 'primary'
                    : project.level === 3
                      ? 'warning'
                      : 'error'
              }
              label={project.levelTitle}
              aria-label={t('projects.levelLabel', { level: project.levelTitle })}
            />
            <Chip
              variant="soft"
              color="neutral"
              size="small"
              label={`${getHackathonProjectPoints(hackathonProject)} ${t('hackathons.pointsUnit')}`}
            />
            <Chip
              variant="soft"
              color="neutral"
              size="small"
              label={t('projects.taskSummary', { count: project.tasks.length })}
            />
            <Chip
              variant="soft"
              color="neutral"
              size="small"
              label={resolveProjectFileAccept(project.fileAccept)}
              aria-label={t('projects.fileType')}
            />
          </Stack>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      <HackathonProjectDescription hackathonProject={hackathonProject} />
    </Box>
  );

  const solution = (
    <HackathonProjectSidebar
      hackathonProject={hackathonProject}
      hackathon={hackathon}
      onSubmitted={() => {
        setField('activeTab', 'attempts');
        onRefresh();
      }}
    />
  );

  const attempts = (
    <Box sx={{ height: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
      <ProjectAttempts project={project} hackathonId={hackathon.id} />
    </Box>
  );

  return (
    <Box sx={{ height: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {isMobile ? (
        <>
          <Tabs
            value={state.activeTab}
            onChange={(_, value: WorkspaceTab) => setField('activeTab', value)}
            variant="fullWidth"
            aria-label={t('projects.detailTabs')}
            sx={{
              flexShrink: 0,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 42,
                minWidth: 0,
                px: 0.5,
                fontWeight: 500,
                textTransform: 'none',
              },
            }}
          >
            <Tab value="project" label={t('projects.projectTab')} />
            <Tab value="solution" label={t('projects.solution')} />
            <Tab value="attempts" label={t('hackathons.attempts')} />
          </Tabs>
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Box sx={{ height: 1, display: state.activeTab === 'project' ? 'block' : 'none' }}>
              {brief}
            </Box>
            <Box
              sx={{
                height: 1,
                bgcolor: 'background.elevation1',
                display: state.activeTab === 'solution' ? 'block' : 'none',
              }}
            >
              {solution}
            </Box>
            {state.activeTab === 'attempts' ? attempts : null}
          </Box>
        </>
      ) : (
        <PanelGroup
          direction="horizontal"
          autoSaveId="hackathon-project-platform-workspace"
          style={{ flex: 1, minHeight: 0 }}
        >
          <Panel defaultSize={67} minSize={40}>
            {brief}
          </Panel>
          <PanelHandle orientation="horizontal" />
          <Panel defaultSize={33} minSize={30}>
            <Box
              sx={{
                height: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                bgcolor: 'background.elevation1',
              }}
            >
              <Tabs
                value={rightTab}
                onChange={(_, value: WorkspaceTab) => setField('activeTab', value)}
                aria-label={t('projects.sidebarTitle')}
                sx={{
                  px: 3,
                  minHeight: 48,
                  flexShrink: 0,
                  '& .MuiTab-root': { fontWeight: 500, textTransform: 'none' },
                }}
              >
                <Tab value="solution" label={t('projects.solution')} />
                <Tab value="attempts" label={t('hackathons.attempts')} />
              </Tabs>
              <Divider />
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <Box sx={{ height: 1, display: rightTab === 'solution' ? 'block' : 'none' }}>
                  {solution}
                </Box>
                {rightTab === 'attempts' ? attempts : null}
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
      )}
    </Box>
  );
};

export default HackathonProjectWorkspace;
