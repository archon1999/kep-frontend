import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTournamentsList } from '../../application/queries';
import TournamentCard from '../components/TournamentCard';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import Logo from 'shared/components/common/Logo';

const TournamentsListPage = () => {
  const { t } = useTranslation();
  const { data: pageResult, isLoading } = useTournamentsList();

  const tournaments = pageResult?.data ?? [];
  const showEmptyState = !isLoading && tournaments.length === 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={(theme) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: 'background.paper',
            background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06)})`,
          })}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction="column" spacing={1.25}>
              <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t('menu.tournaments')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {t('tournaments.subtitle')}
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

        {showEmptyState ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {t('tournaments.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('tournaments.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={idx}>
                    <Skeleton variant="rounded" height={320} />
                  </Grid>
                ))
              : tournaments.map((tournament) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tournament.id}>
                    <TournamentCard tournament={tournament} />
                  </Grid>
                ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default TournamentsListPage;
