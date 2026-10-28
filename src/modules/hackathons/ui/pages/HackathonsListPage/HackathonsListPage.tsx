import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';
import { useHackathonsListPage } from 'modules/hackathons/application/hooks/useHackathonsListPage';
import { EventListSkeletons } from 'shared/components/sections/common/EventListCard';
import FramedListPage, {
  ListFeedback,
  ListToolbar,
  RouteListPagination,
} from 'shared/components/sections/common/FramedListPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import HackathonCard from './components/HackathonCard';

const HackathonsListPage = () => {
  const { state, setField, pageResult, isLoading, error, mutate, hackathons } =
    useHackathonsListPage();

  const { t } = useTranslation();

  return (
    <FramedListPage>
      <PageHeader
        variant="hero"
        title={t('menu.hackathons')}
        titleId="hackathons-list-title"
        badge={t('hackathons.formatValue')}
        subtitle={t('hackathons.subtitle')}
      />
      <ListToolbar caption={t('hackathons.scoringValue')}>
        <Typography variant="label" color="text.secondary">
          {pageResult && !error
            ? t('hackathons.countLabel', { count: pageResult.total })
            : t('menu.hackathons')}
        </Typography>
      </ListToolbar>
      <ListFeedback
        loadingContent={
          <EventListSkeletons
            columns={2}
            detailCount={2}
            metricCount={2}
            badgeCount={1}
            titleMinLines={2}
            firstDetailIsDate
            description
            media={{ width: 80, height: 64, mobile: true }}
          />
        }
        kind="hackathon"
        onRetry={() => void mutate()}
        loading={isLoading}
        error={error}
        empty={!hackathons.length}
        emptyTitle={t('hackathons.emptyTitle')}
        emptyMessage={t('hackathons.emptySubtitle')}
        errorMessage={t('hackathons.loadError')}
      />
      {!error && !isLoading && (
        <Grid container spacing={0}>
          {hackathons.map((hackathon, index) => (
            <Grid
              key={hackathon.id}
              size={{ xs: 12, lg: 6 }}
              sx={{
                minWidth: 0,
                borderRight: { lg: index % 2 === 0 ? '1px solid var(--kep-line)' : 0 },
              }}
            >
              <HackathonCard hackathon={hackathon} />
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
export default HackathonsListPage;
