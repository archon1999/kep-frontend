import { useTranslation } from 'react-i18next';
import { InputAdornment, Typography } from '@mui/material';
import { useArenaListPage } from 'modules/arena/application/hooks/useArenaListPage';
import KepIcon from 'shared/components/base/KepIcon';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
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
      <ListToolbar>
        <Typography variant="label" color="text.secondary">
          {data && !error ? t('arena.countLabel', { count: data.total }) : t('arena.title')}
        </Typography>
        <DebouncedTextField
          type="search"
          size="small"
          value={state.title}
          onValueChange={(value) => setField('title', value)}
          placeholder={t('arena.searchPlaceholder')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <KepIcon name="search" fontSize={20} />
                </InputAdornment>
              ),
            },
            htmlInput: { 'aria-label': t('arena.searchPlaceholder') },
          }}
          sx={{ width: { xs: '100%', sm: 340 } }}
        />
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
