import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import ProjectCard from 'modules/projects/ui/components/ProjectCard';
import { useHackathon, useHackathonProjects } from '../../application/queries';
import HackathonTabs from '../components/HackathonTabs';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const HackathonProjectsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: hackathon } = useHackathon(id);
  const { data: projects, isLoading } = useHackathonProjects(id);
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonProjects' : undefined,
    hackathon?.title
      ? {
          hackathonTitle: hackathon.title,
        }
      : undefined,
  );

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={800}>
            {t('hackathons.projects')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('hackathons.projectsCount', { count: projects?.length ?? 0 })}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                <Skeleton variant="rounded" height={280} />
              </Grid>
            ))
            : (projects ?? []).map((item) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                <ProjectCard project={item.project} />
              </Grid>
            ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default HackathonProjectsPage;
