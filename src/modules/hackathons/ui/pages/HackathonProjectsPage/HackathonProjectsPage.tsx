import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonProjects } from 'modules/hackathons/application';
import { HackathonStatus } from 'modules/hackathons/domain';
import { HackathonPageHeader, HackathonTabs } from 'modules/hackathons/ui/shared';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import HackathonProjectCard from './components/HackathonProjectCard';

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

  const lead =
    hackathon?.status === HackathonStatus.FINISHED
      ? t('hackathons.projectsLockedLead')
      : hackathon?.status === HackathonStatus.NOT_STARTED
        ? t('hackathons.beforeStartLead')
        : t('hackathons.projectsLead');

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        {hackathon ? (
          <HackathonPageHeader
            hackathon={hackathon}
            eyebrow={hackathon.title}
            title={t('hackathons.projects')}
            lead={lead}
          />
        ) : (
          <Skeleton variant="rounded" height={260} />
        )}

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                <Skeleton variant="rounded" height={280} />
              </Grid>
            ))
            : (projects ?? []).map((item) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                <HackathonProjectCard hackathonId={id ?? ''} project={item} />
              </Grid>
            ))}
        </Grid>

        {!isLoading && (!projects || projects.length === 0) ? (
          <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
            <CardContent sx={{ py: 6 }}>
              <Stack direction="column" spacing={1} alignItems="center" textAlign="center">
                <Typography variant="h6" fontWeight={800}>
                  {t('hackathons.emptyTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lead}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </Box>
  );
};

export default HackathonProjectsPage;
