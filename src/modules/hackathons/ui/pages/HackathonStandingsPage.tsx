import { useMemo } from 'react';
import { Box, Card, CardContent, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonProjects, useHackathonStandings } from '../../application/queries';
import HackathonTabs from '../components/HackathonTabs';
import HackathonCountdownCard from '../components/HackathonCountdownCard';
import { HackathonProjectResult } from '../../domain/entities/hackathon-project.entity';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const HackathonStandingsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: hackathon } = useHackathon(id);
  const { data: standings, isLoading } = useHackathonStandings(id);
  const { data: projects } = useHackathonProjects(id);
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonStandings' : undefined,
    hackathon?.title
      ? {
          hackathonTitle: hackathon.title,
        }
      : undefined,
  );

  const rankedStandings = useMemo(() => {
    if (!standings) return [];
    let rank = 1;
    return standings
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
      .map((participant, index, arr) => {
        if (index > 0 && participant.points !== arr[index - 1].points) {
          rank = index + 1;
        }
        return { ...participant, rank };
      });
  }, [standings]);

  const getProjectResult = (results: HackathonProjectResult[] | undefined, symbol: string) =>
    results?.find((result) => result.symbol === symbol);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6" fontWeight={800}>
                    {t('hackathons.standings')}
                  </Typography>

                  <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>{t('hackathons.contestant')}</TableCell>
                          <TableCell>{t('hackathons.points')}</TableCell>
                          {(projects ?? []).map((project) => (
                            <TableCell key={project.symbol} align="center">
                              <Typography variant="caption" fontWeight={700}>
                                {project.symbol}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rankedStandings ?? []).map((participant) => (
                          <TableRow key={participant.username}>
                            <TableCell>{participant.rank}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                {participant.userAvatar ? (
                                  <Box
                                    component="img"
                                    src={participant.userAvatar}
                                    alt={participant.username}
                                    sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                ) : null}
                                <Stack direction="row" spacing={0.25}>
                                  <Typography fontWeight={700}>{participant.username}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {participant.userFullName}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={800} color="primary">
                                {participant.points}
                              </Typography>
                            </TableCell>
                            {(projects ?? []).map((project) => {
                              const result = getProjectResult(participant.projectResults, project.symbol);
                              return (
                                <TableCell key={project.symbol} align="center">
                                  {result ? (
                                    <Stack direction="row" spacing={0.25} alignItems="center">
                                      <Typography variant="body2" fontWeight={700} color="primary">
                                        {result.points}
                                      </Typography>
                                      {result.hackathonTime ? (
                                        <Typography variant="caption" color="text.secondary">
                                          {result.hackathonTime}
                                        </Typography>
                                      ) : null}
                                    </Stack>
                                  ) : (
                                    <Typography variant="body2" color="text.disabled">
                                      —
                                    </Typography>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}

                        {!isLoading && rankedStandings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={(projects?.length ?? 0) + 3} align="center">
                              <Typography variant="body2" color="text.secondary">
                                {t('hackathons.emptyTitle')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <HackathonCountdownCard hackathon={hackathon} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default HackathonStandingsPage;
