import { useMemo } from 'react';
import { Box, Button, Card, CardContent, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { hackathonsQueries, useHackathon } from '../../application/queries';
import { HackathonStatus } from '../../domain/entities/hackathon.entity';
import HackathonCountdownCard from '../components/HackathonCountdownCard';
import HackathonTabs from '../components/HackathonTabs';

const HackathonPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: hackathon, isLoading, mutate } = useHackathon(id);
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathon' : undefined,
    hackathon?.title
      ? {
          hackathonTitle: hackathon.title,
        }
      : undefined,
  );

  const statusLabel = useMemo(() => {
    if (!hackathon) return '';
    if (hackathon.status === HackathonStatus.NOT_STARTED) return t('hackathons.startsIn');
    if (hackathon.status === HackathonStatus.FINISHED) return t('hackathons.finished');
    return t('hackathons.active');
  }, [hackathon, t]);

  const handleRegistration = async () => {
    if (!id) return;
    if (hackathon?.isRegistered) {
      await hackathonsQueries.hackathonsRepository.unregister(id);
    } else {
      await hackathonsQueries.hackathonsRepository.register(id);
    }
    await mutate();
  };

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isLoading ? (
                  <Skeleton variant="text" height={40} />
                ) : (
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        bgcolor: 'background.neutral',
                        backgroundImage: hackathon?.logo ? `url(${hackathon.logo})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {!hackathon?.logo ? (
                        <Typography variant="h4" fontWeight={800} color="primary.main">
                          {hackathon?.title?.charAt(0) ?? 'H'}
                        </Typography>
                      ) : null}
                    </Box>

                    <Stack direction="row" spacing={1} flex={1} minWidth={0}>
                      <Typography variant="h4" fontWeight={800} noWrap>
                        {hackathon?.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
                        <Chip label={statusLabel} color="primary" size="small" />
                        <Chip
                          label={t('hackathons.projectsCount', { count: hackathon?.projectsCount ?? 0 })}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={t('hackathons.participantsCount', {
                            count: hackathon?.participantsCount ?? hackathon?.registrantsCount ?? 0,
                          })}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Stack>

                    <Button variant={hackathon?.isRegistered ? 'outlined' : 'contained'} onClick={handleRegistration}>
                      {hackathon?.isRegistered ? t('hackathons.unregister') : t('hackathons.register')}
                    </Button>
                  </Stack>
                )}

                {hackathon?.description ? (
                  <Typography variant="body1" color="text.secondary" component="div" sx={{ '& p': { m: 0 } }}
                    dangerouslySetInnerHTML={{ __html: hackathon.description }}
                  />
                ) : null}

                <Stack direction="row" spacing={3} flexWrap="wrap" rowGap={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconifyIcon icon="mdi:calendar-clock" />
                    <Typography variant="body2" color="text.secondary">
                      {hackathon?.startTime}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconifyIcon icon="mdi:clock-outline" />
                    <Typography variant="body2" color="text.secondary">
                      {hackathon?.finishTime}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <HackathonCountdownCard hackathon={hackathon} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default HackathonPage;
