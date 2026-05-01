import { Pagination, Skeleton, Stack } from '@mui/material';
import { useArenasList } from 'modules/arena/application/queries.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import ArenaListCard from './components/ArenaListCard.tsx';

const ArenaListPageSection = () => {
  const { state, setField } = useRouteQueryState<{
    page: number;
  }>({
    defaults: {
      page: 1,
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
    },
    historyByKey: {
      page: 'push',
    },
  });

  const { data, isLoading } = useArenasList({
    page: state.page,
    pageSize: 7,
  });

  return (
    <>
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={108} />
          ))
        : data?.data?.map((arena) => <ArenaListCard key={arena.id} arena={arena} />)}

      {(data?.pagesCount ?? 0) > 1 ? (
        <Stack direction="column" alignItems="center">
          <Pagination
            color="warning"
            count={data?.pagesCount ?? 0}
            page={state.page}
            onChange={(_, value) => setField('page', value)}
          />
        </Stack>
      ) : null}
    </>
  );
};

export default ArenaListPageSection;
