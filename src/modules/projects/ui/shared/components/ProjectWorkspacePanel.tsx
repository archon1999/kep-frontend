import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { displayFontFamily } from 'app/theme/fonts';
import { Project } from 'modules/projects/domain/entities/project.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import ProjectAttempts from './ProjectAttempts';
import ProjectDescription from './ProjectDescription';
import ProjectInfoCard from './ProjectInfoCard';

interface ProjectWorkspacePanelProps {
  project?: Project;
  isLoading: boolean;
  hasError: boolean;
  activeTab: number;
  onTabChange: (value: number) => void;
  hideTabs: boolean;
  onRetry: () => void;
  intro?: ReactNode;
  description?: ReactNode;
  hackathonId?: number;
}

const ProjectWorkspacePanel = ({
  project,
  isLoading,
  hasError,
  activeTab,
  onTabChange,
  hideTabs,
  onRetry,
  intro,
  description,
  hackathonId,
}: ProjectWorkspacePanelProps) => {
  const { t } = useTranslation();
  return (
    <WorkspacePane
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: 0,
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      {!hideTabs && (
        <WorkspaceToolbar sx={{ py: 0 }}>
          <ResponsiveTabs
            value={activeTab}
            onChange={onTabChange}
            ariaLabel={t('projects.detailTabs')}
            items={[
              {
                value: 0,
                label: t('projects.projectTab'),
                icon: <IconifyIcon icon="mdi:book-open-page-variant" />,
                tabProps: { iconPosition: 'start', sx: { fontWeight: 500 } },
              },
              {
                value: 1,
                label: t('projects.attempts'),
                icon: <IconifyIcon icon="mdi:history" />,
                tabProps: { iconPosition: 'start', sx: { fontWeight: 500 } },
              },
            ]}
            tabsProps={{
              variant: 'scrollable',
              scrollButtons: 'auto',
              textColor: 'primary',
              indicatorColor: 'primary',
              sx: {
                minHeight: 44,
                '& .MuiTab-root': { minHeight: 44, py: 1, fontFamily: displayFontFamily },
              },
            }}
          />
        </WorkspaceToolbar>
      )}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: { xs: activeTab === 1 ? 3 : 2, sm: 3 },
          py: 3,
        }}
      >
        {hasError && (
          <Alert
            severity={project ? 'warning' : 'error'}
            sx={{ mb: 3 }}
            action={<Button onClick={onRetry}>{t('projects.retry')}</Button>}
          >
            {t('projects.loadError')}
          </Alert>
        )}
        {project ? (
          <>
            {activeTab === 0 &&
              (intro ?? (
                <Stack direction="column" spacing={1.5} sx={{ mb: 3 }}>
                  <Typography variant="h5" component="h1" fontWeight={600}>
                    <MixedText>{project.title}</MixedText>
                  </Typography>
                  <ProjectInfoCard project={project} />
                </Stack>
              ))}
            {activeTab === 0 && <Divider sx={{ mb: 3 }} />}
            {activeTab === 1 ? (
              <ProjectAttempts project={project} hackathonId={hackathonId} />
            ) : (
              (description ?? <ProjectDescription project={project} />)
            )}
          </>
        ) : isLoading ? (
          <Stack direction="column" gap={3}>
            <Skeleton width="70%" height={42} />
            <Skeleton width="50%" height={32} />
            <Skeleton variant="rounded" height={140} />
            <Skeleton variant="rounded" height={220} />
          </Stack>
        ) : null}
      </Box>
    </WorkspacePane>
  );
};

export default ProjectWorkspacePanel;
