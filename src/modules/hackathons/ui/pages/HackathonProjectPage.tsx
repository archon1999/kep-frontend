import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import ProjectAttempts from 'modules/projects/ui/components/ProjectAttempts';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useHackathon, useHackathonProject } from '../../application/queries';
import { HackathonStatus } from '../../domain/entities/hackathon.entity';
import HackathonCountdownCard from '../components/HackathonCountdownCard';
import HackathonPageHeader from '../components/HackathonPageHeader';
import HackathonPointsBadge from '../components/HackathonPointsBadge';
import HackathonProjectDescription from '../components/HackathonProjectDescription';
import HackathonProjectSidebar from '../components/HackathonProjectSidebar';
import HackathonTabs from '../components/HackathonTabs';
import { getHackathonProjectPoints } from '../lib/format';

const HackathonProjectPage = () => {
  const { t } = useTranslation();
  const { id, symbol } = useParams();
  const hackathonId = id ? Number(id) : undefined;

  const { data: hackathon } = useHackathon(id);
  const { data: hackathonProject, isLoading, mutate } = useHackathonProject(id, symbol);

  const project = hackathonProject?.project;
  useDocumentTitle(
    project?.title ? 'pageTitles.hackathonProject' : undefined,
    project?.title
      ? {
          projectTitle: project.title,
        }
      : undefined,
  );

  const lead =
    hackathon?.status === HackathonStatus.FINISHED
      ? t('hackathons.finishedSubmissionBody')
      : hackathon?.status === HackathonStatus.NOT_STARTED
        ? t('hackathons.beforeStartLead')
        : hackathon?.isRegistered
          ? t('hackathons.submissionWindow')
          : t('hackathons.registerToSubmitBody');

  const statusLabel =
    hackathon?.status === HackathonStatus.FINISHED
      ? t('hackathons.finished')
      : hackathon?.status === HackathonStatus.ALREADY
        ? t('hackathons.active')
        : t('hackathons.upcoming');

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        {hackathon && project ? (
          <HackathonPageHeader
            hackathon={hackathon}
            eyebrow={hackathon.title}
            title={project.title}
            lead={lead}
            stats={[
              {
                label: t('hackathons.projectSymbol'),
                value: hackathonProject?.symbol ?? symbol ?? '-',
                icon: 'mdi:code-tags',
              },
              {
                label: t('hackathons.points'),
                value: <HackathonPointsBadge value={getHackathonProjectPoints(project)} color="primary" />,
                icon: 'mdi:star-circle-outline',
              },
              {
                label: t('projects.level'),
                value: project.levelTitle,
                icon: 'mdi:rocket-launch-outline',
              },
              {
                label: t('hackathons.status'),
                value: statusLabel,
                icon: 'mdi:timer-sand',
              },
            ]}
          />
        ) : (
          <Skeleton variant="rounded" height={260} />
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            {isLoading || !project ? (
              <Skeleton variant="rounded" height={420} />
            ) : (
              <Stack direction="column" spacing={3}>
                <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <HackathonProjectDescription project={project} symbol={hackathonProject?.symbol ?? symbol ?? ''} />
                  </CardContent>
                </Card>

                <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack direction="column" spacing={2}>
                      <Typography variant="h6" fontWeight={800}>
                        {t('hackathons.attempts')}
                      </Typography>
                      <ProjectAttempts project={project} hackathonId={hackathonId} />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            )}
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack direction="column" spacing={3}>
              <HackathonCountdownCard hackathon={hackathon} />
              {project ? (
                <HackathonProjectSidebar
                  project={project}
                  symbol={hackathonProject?.symbol ?? symbol ?? ''}
                  hackathon={hackathon}
                  onSubmitted={() => mutate()}
                />
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default HackathonProjectPage;
