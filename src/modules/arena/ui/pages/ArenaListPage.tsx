import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import Logo from 'shared/components/common/Logo';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { useArenasList } from '../../application/queries.ts';
import ArenaListCard from '../components/ArenaListCard.tsx';

const ArenaListPage = () => {
  const { t } = useTranslation();
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

  const arenas = data?.data ?? [];
  const pagesCount = data?.pagesCount ?? 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={(theme) => ({
            borderRadius: 3,
            background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.06)})`,
          })}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack>
              <Stack direction="column" spacing={1.25}>
                <Typography variant="h4" fontWeight={800}>
                  {t('arena.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                  {t('arena.listSubtitle', { count: data?.total ?? arenas.length })}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>

          <Box
            sx={{
              position: 'absolute',
              right: { xs: -24, md: 24 },
              bottom: { xs: -24, md: 8 },
              opacity: 0.08,
              pointerEvents: 'none',
            }}
          >
            <Logo sx={{ width: { xs: 200, md: 280 }, height: { xs: 200, md: 280 } }} />
          </Box>
        </Card>

        {isLoading
          ? Array.from({ length: 6 }).map(() => <Skeleton variant="rounded" height={108} />)
          : arenas.map((arena) => <ArenaListCard key={arena.id} arena={arena} />)}

        {pagesCount > 1 && (
          <Stack direction="column" alignItems="center">
            <Pagination
              color="warning"
              count={pagesCount}
              page={state.page}
              onChange={(_, value) => setField('page', value)}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ArenaListPage;
