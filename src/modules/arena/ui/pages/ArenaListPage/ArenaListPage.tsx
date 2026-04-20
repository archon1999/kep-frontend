import { Box, Stack } from '@mui/material';
import { useArenasList } from 'modules/arena/application/queries.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ArenaListPageHeroCard from './ArenaListPageHeroCard.tsx';
import ArenaListPageListSection from './ArenaListPageListSection.tsx';

const ArenaListPage = () => {
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
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <ArenaListPageHeroCard total={data?.total ?? data?.data?.length ?? 0} />

        <ArenaListPageListSection
          arenas={data?.data ?? []}
          isLoading={isLoading}
          page={state.page}
          pagesCount={data?.pagesCount ?? 0}
          onPageChange={(page) => setField('page', page)}
        />
      </Stack>
    </Box>
  );
};

export default ArenaListPage;
