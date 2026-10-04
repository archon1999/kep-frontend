import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Project } from 'modules/projects/domain/entities/project.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
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
}

const ProjectWorkspacePanel = ({
  project,
  isLoading,
  hasError,
  activeTab,
  onTabChange,
  hideTabs,
  onRetry,
}: ProjectWorkspacePanelProps) => {
  const { t } = useTranslation();
  return (
    <Card
      background={0}
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: { xs: 0, md: undefined },
        borderRadius: { xs: 0, md: undefined },
        boxShadow: { xs: 'none', md: undefined },
      }}
    >
      {!hideTabs && (
        <>
          <CardHeader
            sx={{ py: 0 }}
            title={
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
                }}
              />
            }
          />
          <Divider />
        </>
      )}
      <CardContent
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: { xs: activeTab === 1 ? 3 : 2, sm: 3 },
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
            {activeTab === 0 && (
              <Stack direction="column" spacing={1.5} sx={{ mb: 3 }}>
                <Typography variant="h5" component="h1" fontWeight={600}>
                  {project.title}
                </Typography>
                <ProjectInfoCard project={project} />
              </Stack>
            )}
            {activeTab === 0 && <Divider sx={{ mb: 3 }} />}
            {activeTab === 1 ? (
              <ProjectAttempts project={project} />
            ) : (
              <ProjectDescription project={project} />
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
      </CardContent>
    </Card>
  );
};

export default ProjectWorkspacePanel;
