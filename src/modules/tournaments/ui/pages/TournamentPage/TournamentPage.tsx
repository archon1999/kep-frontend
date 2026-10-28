import { Grid, Skeleton, Stack } from '@mui/material';
import { useTournamentPage } from 'modules/tournaments/application/hooks/useTournamentPage';
import PageLoader from 'shared/components/loading/PageLoader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import TournamentBracket from './components/TournamentBracket';
import TournamentInfoCard from './components/TournamentInfoCard';

const TournamentPage = () => {
  const { tournament, isLoading } = useTournamentPage();

  if (isLoading && !tournament) {
    return <PageLoader />;
  }

  return (
    <FramedPage>
      <Stack direction="column" spacing={0}>
        {isLoading || !tournament ? (
          <Stack direction="column" spacing={2}>
            <Skeleton variant="rounded" height={180} />
            <Skeleton variant="rounded" height={520} />
          </Stack>
        ) : (
          <Grid container spacing={0}>
            <Grid size={{ xs: 12 }}>
              <Stack direction="column" spacing={0}>
                <TournamentInfoCard tournament={tournament} />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TournamentBracket tournament={tournament} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </FramedPage>
  );
};

export default TournamentPage;
