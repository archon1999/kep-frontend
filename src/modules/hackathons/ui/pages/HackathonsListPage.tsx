import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import HackathonCard from '../components/HackathonCard';
import { useHackathonsList } from '../../application/queries';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import Logo from 'shared/components/common/Logo';

const HackathonsListPage = () => {
  const { t } = useTranslation();
  const { data: pageResult, isLoading } = useHackathonsList();

  const hackathons = pageResult?.data ?? [];
  const showEmptyState = !isLoading && hackathons.length === 0;

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Card
          sx={(theme) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: 'background.paper',
            background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.secondary.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.06)})`,
          })}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction="column" spacing={1.25}>
              <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t('menu.hackathons')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {t('hackathons.subtitle')}
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
              {t('hackathons.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('hackathons.emptySubtitle')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                <Grid size={12} key={idx}>
                  <Skeleton variant="rounded" height={360} />
                </Grid>
              ))
              : hackathons.map((hackathon) => (
                <Grid size={12} key={hackathon.id}>
                  <HackathonCard hackathon={hackathon} />
                </Grid>
              ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default HackathonsListPage;
