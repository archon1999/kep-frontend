import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, Grid, Stack, Typography } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import {
  useHackathon,
  useHackathonProjects,
  useHackathonStandings,
} from 'modules/hackathons/application';
import {
  HackathonAsyncState,
  HackathonCountdownCard,
  HackathonDetailLayout,
} from 'modules/hackathons/ui/shared';
import HackathonStandingsTable from './components/HackathonStandingsTable';

const HackathonStandingsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);
  const { data: standings, isLoading, error } = useHackathonStandings(id);
  const {
    data: projects,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useHackathonProjects(id);

  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonStandings' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );

  const rankedStandings = useMemo(() => {
    if (!standings) return [];
    let rank = 1;

    return [...standings]
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
      .map((participant, index, arr) => {
        if (index > 0 && participant.points !== arr[index - 1].points) rank = index + 1;
        return { ...participant, rank };
      });
  }, [standings]);

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: projects?.length === 1 ? 8 : 12 }} sx={{ minWidth: 0 }}>
          <Card sx={{ borderRadius: 3 }}>
            {hackathon ? (
              <>
                <Typography
                  component="h2"
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ px: 3, pt: 3 }}
                >
                  {t('hackathons.standings')}
                </Typography>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                  sx={{ px: 3, py: 2.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('hackathons.participantsCount', { count: rankedStandings.length })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('hackathons.projectsCount', { count: projects?.length ?? 0 })}
                  </Typography>
                </Stack>
                {isLoading ||
                isProjectsLoading ||
                error ||
                projectsError ||
                !rankedStandings.length ? (
                  <HackathonAsyncState
                    isLoading={isLoading || isProjectsLoading}
                    error={error || projectsError}
                    isEmpty={!rankedStandings.length}
                    emptyTitle={t('hackathons.standingsEmptyTitle')}
                    emptyMessage={t('hackathons.standingsEmptyMessage')}
                  />
                ) : (
                  <HackathonStandingsTable standings={rankedStandings} projects={projects ?? []} />
                )}
              </>
            ) : (
              <HackathonAsyncState
                isLoading={isHackathonLoading}
                error={hackathonError}
                loadingHeight={180}
              />
            )}
          </Card>
        </Grid>
        {projects?.length === 1 ? (
          <Grid size={{ xs: 12, md: 4 }}>
            <HackathonCountdownCard hackathon={hackathon} />
          </Grid>
        ) : null}
      </Grid>
    </HackathonDetailLayout>
  );
};

export default HackathonStandingsPage;
