import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';
import { useTournamentsListPage } from 'modules/tournaments/application/hooks/useTournamentsListPage';
import { EventListSkeletons } from 'shared/components/sections/common/EventListCard';
import FramedListPage, {
  ListFeedback,
  ListToolbar,
  RouteListPagination,
} from 'shared/components/sections/common/FramedListPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import TournamentCard from './components/TournamentCard';

const TournamentsListPage = () => {
  const { state, setField, pageResult, isLoading, error, mutate, tournaments } =
    useTournamentsListPage();

  const { t } = useTranslation();
  return (
    <FramedListPage>
      <PageHeader
        variant="hero"
        title={t('menu.tournaments')}
        titleId="tournaments-list-title"
        badge={t('tournaments.heroBadge')}
        subtitle={t('tournaments.subtitle')}
      />
      <ListToolbar caption={t('tournaments.bracketTitle')}>
        <Typography variant="label" color="text.secondary">
          {pageResult && !error
            ? t('tournaments.countLabel', { count: pageResult.total })
            : t('menu.tournaments')}
        </Typography>
      </ListToolbar>
      <ListFeedback
        loadingContent={
          <EventListSkeletons
            columns={2}
            detailCount={2}
            metricCount={1}
            badgeCount={0}
            media={{ width: 72, height: 56, mobile: true }}
            description
          />
        }
        kind="competitions"
        onRetry={() => void mutate()}
        loading={isLoading}
        error={error}
        empty={!tournaments.length}
        emptyTitle={t('tournaments.emptyTitle')}
        emptyMessage={t('tournaments.emptySubtitle')}
        errorMessage={t('tournaments.loadError')}
      />
      {!isLoading && !error && (
        <Grid container spacing={0}>
          {tournaments.map((tournament, index) => (
            <Grid
              key={tournament.id}
              size={{ xs: 12, lg: 6 }}
              sx={{
                minWidth: 0,
                borderRight: { lg: index % 2 === 0 ? '1px solid var(--kep-line)' : 0 },
              }}
            >
              <TournamentCard tournament={tournament} />
            </Grid>
          ))}
        </Grid>
      )}
      {!error && (
        <RouteListPagination
          page={state.page}
          count={pageResult?.pagesCount ?? 0}
          onChange={(page) => setField('page', page)}
        />
      )}
    </FramedListPage>
  );
};
export default TournamentsListPage;
