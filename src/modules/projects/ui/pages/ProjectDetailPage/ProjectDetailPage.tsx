import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Box, Card, CardContent, CardHeader, CircularProgress, Grid } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useProjectDetails } from 'modules/projects/application/queries';
import ProjectAttempts from './components/ProjectAttempts.tsx';
import ProjectDescription from './components/ProjectDescription.tsx';
import ProjectSidebar from './components/ProjectSidebar.tsx';


const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { state, setField } = useRouteQueryState({
    defaults: {
      activeTab: 0,
    },
    schema: {
      activeTab: {
        ...numberParam({ min: 0, max: 1 }),
        param: 'tab',
      },
    },
    historyByKey: {
      activeTab: 'push',
    },
  });
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
    setField('activeTab', 1);
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
                <ResponsiveTabs
                  value={state.activeTab}
                  onChange={(value) => setField('activeTab', value)}
                  items={tabs}
                  ariaLabel="project detail tabs"
                  tabsProps={{
                    variant: 'scrollable',
                    allowScrollButtonsMobile: true,
                    sx: { borderBottom: (theme) => `1px solid ${theme.palette.divider}` },
                  }}
                />
              }
            />
            <CardContent>
              {state.activeTab === 0 && <ProjectDescription project={project} />}
              {state.activeTab === 1 && <ProjectAttempts project={project} />}
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
