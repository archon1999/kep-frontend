import { Box, Grid, Skeleton, Stack } from '@mui/material';
import { useParams } from 'react-router';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import PageLoader from 'shared/components/loading/PageLoader';
import TournamentBracket from '../components/TournamentBracket';
import TournamentInfoCard from '../components/TournamentInfoCard';
import { useTournament } from '../../application/queries';

const TournamentPage = () => {
  const { id } = useParams();

  const { data: tournament, isLoading } = useTournament(id);
  useDocumentTitle(
    tournament?.title ? 'pageTitles.tournament' : undefined,
    tournament?.title
      ? {
          tournamentTitle: tournament.title,
        }
      : undefined,
  );

  if (isLoading && !tournament) {
    return <PageLoader />;
  }

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {isLoading || !tournament ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={180} />
            <Skeleton variant="rounded" height={520} />
          </Stack>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Stack direction="column" spacing={3}>
                <TournamentInfoCard tournament={tournament} />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12}}>
              <TournamentBracket tournament={tournament} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default TournamentPage;
