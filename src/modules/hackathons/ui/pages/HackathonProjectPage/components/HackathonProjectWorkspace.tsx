import { useTranslation } from 'react-i18next';
import { Avatar, Chip, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { type Hackathon, type HackathonProject } from 'modules/hackathons/domain';
import { getHackathonProjectPoints } from 'modules/hackathons/ui/shared';
import { resolveProjectFileAccept } from 'modules/projects/domain/utils/project-upload';
import ProjectWorkspaceLayout from 'modules/projects/ui/shared/components/ProjectWorkspaceLayout';
import ProjectWorkspacePanel from 'modules/projects/ui/shared/components/ProjectWorkspacePanel';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam } from 'shared/lib/queryParams';
import HackathonProjectDescription from './HackathonProjectDescription';
import HackathonProjectSidebar from './HackathonProjectSidebar';
import HackathonProjectWorkspaceHeader from './HackathonProjectWorkspaceHeader';

type WorkspaceTab = 'project' | 'solution' | 'attempts';
const workspaceTabs: WorkspaceTab[] = ['project', 'attempts', 'solution'];

interface HackathonProjectWorkspaceProps {
  hackathonProject: HackathonProject;
  hackathon: Hackathon;
  hasError?: boolean;
  onRefresh: () => void;
}

const HackathonProjectWorkspace = ({
  hackathonProject,
  hackathon,
  hasError = false,
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
  const activeTab = workspaceTabs.indexOf(state.activeTab);
  const onTabChange = (value: number) => setField('activeTab', workspaceTabs[value]);

  return (
    <ProjectWorkspaceLayout
      storageKey="hackathon-project-workspace"
      header={
        <HackathonProjectWorkspaceHeader
          hackathon={hackathon}
          hackathonProject={hackathonProject}
        />
      }
      activeTab={activeTab}
      onTabChange={onTabChange}
      description={
        <ProjectWorkspacePanel
          project={project}
          isLoading={false}
          hasError={hasError}
          activeTab={activeTab === 1 ? 1 : 0}
          onTabChange={onTabChange}
          hideTabs={isMobile}
          onRetry={onRefresh}
          hackathonId={hackathon.id}
          intro={
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
              <Avatar
                variant="rounded"
                src={project.logo}
                alt=""
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  width: { xs: 40, sm: 54 },
                  height: { xs: 40, sm: 54 },
                  borderRadius: 0,
                  bgcolor: 'transparent',
                  '& img': { objectFit: 'contain' },
                }}
              >
                {project.title.charAt(0)}
              </Avatar>
              <Stack direction="column" spacing={1.5} sx={{ minWidth: 0 }}>
                <Typography
                  component="h1"
                  variant="h5"
                  fontWeight={600}
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  <MixedText>{`${hackathonProject.symbol}. ${project.title}`}</MixedText>
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
          }
          description={<HackathonProjectDescription hackathonProject={hackathonProject} />}
        />
      }
      solution={
        <WorkspacePane>
          <WorkspaceToolbar>
            <IconifyIcon icon="mdi:file-upload-outline" />
            <Typography variant="subtitle2">{t('projects.solution')}</Typography>
          </WorkspaceToolbar>
          <HackathonProjectSidebar
            hackathonProject={hackathonProject}
            hackathon={hackathon}
            onSubmitted={() => {
              setField('activeTab', 'attempts');
              onRefresh();
            }}
          />
        </WorkspacePane>
      }
    />
  );
};

export default HackathonProjectWorkspace;
