import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useArenasList } from '../../application/queries.ts';
import ArenaListCard from '../components/ArenaListCard.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import Logo from 'shared/components/common/Logo';

const ArenaListPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArenasList({
    page,
    pageSize: 6,
    status: undefined,
  });

  const arenas = data?.data ?? [];
  const pagesCount = data?.pagesCount ?? 0;

  const subtitle = useMemo(
    () =>
      arenas.length
        ? t('arena.listSubtitle', { count: data?.total ?? arenas.length })
        : t('arena.listEmptySubtitle'),
    [arenas.length, data?.total, t],
  );

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={(theme) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: 'background.paper',
            background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.warning.mainChannel, 0.06)})`,
          })}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction="column" spacing={1.25}>
              <Typography variant="h4" fontWeight={800}>
                {t('arena.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {subtitle}
              </Typography>
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
          ? Array.from({ length: 6 }).map((_) => <Skeleton variant="rounded" height={200} />)
          : arenas.map((arena) => <ArenaListCard arena={arena} />)}

        {!isLoading && arenas.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('arena.listEmptySubtitle')}
          </Typography>
        ) : null}

        {pagesCount > 1 ? (
          <Stack direction="column" alignItems="center">
            <Pagination
              color="warning"
              count={pagesCount}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
};

export default ArenaListPage;
