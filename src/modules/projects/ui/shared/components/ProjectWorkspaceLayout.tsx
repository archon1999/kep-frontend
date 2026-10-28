import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Box, LinearProgress, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import { PanelHandle } from 'modules/problems/ui/shared/components/problem-detail/PanelHandles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { WorkspaceRoot } from 'shared/components/sections/common/Workspace';

interface ProjectWorkspaceLayoutProps {
  header: ReactNode;
  description: ReactNode;
  solution: ReactNode;
  activeTab: number;
  onTabChange: (value: number) => void;
  isLoading?: boolean;
  storageKey?: string;
}

const ProjectWorkspaceLayout = ({
  header,
  description,
  solution,
  activeTab,
  onTabChange,
  isLoading = false,
  storageKey = 'project-workspace',
}: ProjectWorkspaceLayoutProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <WorkspaceRoot>
      {header}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: 0,
          border: 0,
          borderRadius: 0,
          boxShadow: 'none',
        }}
        aria-busy={isLoading}
      >
        {isLoading && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
        )}
        {isMobile && (
          <Tabs
            value={activeTab}
            onChange={(_, value) => onTabChange(value)}
            variant="fullWidth"
            aria-label={t('projects.detailTabs')}
            sx={{
              flexShrink: 0,
              minHeight: 44,
              bgcolor: 'background.paper',
              '& .MuiTab-root': {
                minHeight: 44,
                minWidth: 0,
                px: 0.25,
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '& .MuiTab-iconWrapper': { mr: 0.75 },
              },
              '& .MuiTab-root.Mui-selected': { fontWeight: 700 },
            }}
          >
            <Tab
              value={0}
              label={t('projects.projectTab')}
              icon={<IconifyIcon icon="mdi:book-open-page-variant" sx={{ fontSize: 19 }} />}
              iconPosition="start"
            />
            <Tab
              value={2}
              label={t('projects.solution')}
              icon={<IconifyIcon icon="mdi:file-upload-outline" sx={{ fontSize: 19 }} />}
              iconPosition="start"
            />
            <Tab
              value={1}
              label={t('projects.attempts')}
              icon={<IconifyIcon icon="mdi:history" sx={{ fontSize: 19 }} />}
              iconPosition="start"
            />
          </Tabs>
        )}
        {/* Keep both panes mounted so resizing never discards a selected submission file. */}
        <PanelGroup
          direction="horizontal"
          autoSaveId={storageKey}
          style={{ flex: 1, minHeight: 0 }}
        >
          <Panel
            id="project-description"
            defaultSize={67}
            minSize={45}
            style={
              isMobile
                ? {
                    flexGrow: 1,
                    flexBasis: 0,
                    flexShrink: 1,
                    display: activeTab === 2 ? 'none' : 'block',
                  }
                : undefined
            }
          >
            {description}
          </Panel>
          <PanelHandle orientation="horizontal" disabled={isMobile} />
          <Panel
            id="project-solution"
            defaultSize={33}
            minSize={25}
            style={
              isMobile
                ? {
                    flexGrow: 1,
                    flexBasis: 0,
                    flexShrink: 1,
                    display: activeTab === 2 ? 'block' : 'none',
                  }
                : undefined
            }
          >
            {solution}
          </Panel>
        </PanelGroup>
      </Box>
    </WorkspaceRoot>
  );
};

export default ProjectWorkspaceLayout;
