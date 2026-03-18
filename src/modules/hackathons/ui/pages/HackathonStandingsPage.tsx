import { useMemo } from 'react';
import { Box, Card, CardContent, Skeleton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useHackathon, useHackathonProjects, useHackathonStandings } from '../../application/queries';
import { HackathonProjectResult } from '../../domain/entities/hackathon-project.entity';
import HackathonPageHeader from '../components/HackathonPageHeader';
import HackathonPointsBadge from '../components/HackathonPointsBadge';
import HackathonTabs from '../components/HackathonTabs';
import { formatHackathonDuration } from '../lib/format';

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

    return [...standings]
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

        {hackathon ? (
          <HackathonPageHeader
            hackathon={hackathon}
            eyebrow={hackathon.title}
            title={t('hackathons.standings')}
            lead={t('hackathons.standingsLead')}
          />
        ) : (
          <Skeleton variant="rounded" height={260} />
        )}

        <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction="column" spacing={3}>
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
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            {participant.userAvatar ? (
                              <Box
                                component="img"
                                src={participant.userAvatar}
                                alt={participant.username}
                                sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                              />
                            ) : null}
                            <Stack direction="column" spacing={0.25}>
                              <Typography fontWeight={700}>{participant.username}</Typography>
                              {participant.userFullName ? (
                                <Typography variant="body2" color="text.secondary">
                                  {participant.userFullName}
                                </Typography>
                              ) : null}
                            </Stack>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <HackathonPointsBadge value={participant.points} color="primary" />
                        </TableCell>
                        {(projects ?? []).map((project) => {
                          const result = getProjectResult(participant.projectResults, project.symbol);

                          return (
                            <TableCell key={project.symbol} align="center">
                              {result ? (
                                <Stack direction="column" spacing={0.25} alignItems="center">
                                  <Typography variant="body2" fontWeight={800} color="primary.main">
                                    {result.points}
                                  </Typography>
                                  {result.hackathonTime ? (
                                    <Typography variant="caption" color="text.secondary">
                                      {formatHackathonDuration(result.hackathonTime)}
                                    </Typography>
                                  ) : null}
                                </Stack>
                              ) : (
                                <Typography variant="body2" color="text.disabled">
                                  -
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
      </Stack>
    </Box>
  );
};

export default HackathonStandingsPage;
