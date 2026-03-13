import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Box, Card, CardContent, CardHeader, CircularProgress, Grid, Tab, Tabs } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useProjectDetails } from '../../application/queries';
import ProjectAttempts from '../components/ProjectAttempts.tsx';
import ProjectDescription from '../components/ProjectDescription.tsx';
import ProjectSidebar from '../components/ProjectSidebar.tsx';


const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const { data: project, isLoading, mutate } = useProjectDetails(slug);

  useDocumentTitle(
    project ? 'pageTitles.project' : undefined,
    project
      ? {
          projectTitle: project.title ?? '',
        }
      : undefined,
  );

  const tabs = useMemo(
    () => [
      { label: t('projects.projectTab'), value: 0 },
      { label: t('projects.attempts'), value: 1 },
    ],
    [t],
  );

  const handleSubmitted = () => {
    setActiveTab(1);
    mutate();
  };

  if (isLoading || !project) {
    return (
      <Box
        sx={{
          ...responsivePagePaddingSx,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 320,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardHeader
              sx={{ mb: 0 }}
              title={
                <Tabs
                  value={activeTab}
                  onChange={(_, value) => setActiveTab(value)}
                  variant="scrollable"
                  allowScrollButtonsMobile
                  sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
              }
            />
            <CardContent>
              {activeTab === 0 && <ProjectDescription project={project} />}
              {activeTab === 1 && <ProjectAttempts project={project} />}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <ProjectSidebar project={project} onSubmitted={handleSubmitted} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetailPage;
