import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { useArenaListPage } from 'modules/arena/application/hooks/useArenaListPage';
import { EventListSkeletons } from 'shared/components/sections/common/EventListCard';
import {
  ListFeedback,
  ListToolbar,
  RouteListPagination,
} from 'shared/components/sections/common/FramedListPage';
import ArenaListCard from './components/ArenaListCard';

const ArenaListPageSection = () => {
  const { state, setField, data, isLoading, error, mutate, arenas } = useArenaListPage();

  const { t } = useTranslation();
  return (
    <>
      <ListToolbar caption={t('arena.listCaption')}>
        <Typography variant="label" color="text.secondary">
          {data && !error ? t('arena.countLabel', { count: data.total }) : t('arena.title')}
        </Typography>
      </ListToolbar>
      <ListFeedback
        loadingContent={
          <EventListSkeletons detailCount={2} metricCount={2} badgeCount={1} firstDetailIsDate />
        }
        kind="battles"
        onRetry={() => void mutate()}
        loading={isLoading}
        error={error}
        empty={!arenas.length}
        emptyTitle={t('arena.emptyTitle')}
        emptyMessage={t('arena.listEmptySubtitle')}
        errorMessage={t('arena.loadError')}
      />
      {!isLoading &&
        !error &&
        arenas.map((arena) => <ArenaListCard key={arena.id} arena={arena} />)}
      {!error && (
        <RouteListPagination
          page={state.page}
          count={data?.pagesCount ?? 0}
          onChange={(page) => setField('page', page)}
        />
      )}
    </>
  );
};
export default ArenaListPageSection;
