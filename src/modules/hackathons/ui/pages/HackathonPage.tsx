import { Box, Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { hackathonsQueries, useHackathon } from '../../application/queries';
import HackathonCountdownCard from '../components/HackathonCountdownCard';
import HackathonTabs from '../components/HackathonTabs';
import HackathonPageHeader from '../components/HackathonPageHeader';

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

        {hackathon ? (
          <HackathonPageHeader
            hackathon={hackathon}
            lead={t('hackathons.subtitle')}
            action={
              <Button
                variant={hackathon.isRegistered ? 'outlined' : 'contained'}
                onClick={handleRegistration}
                sx={{ width: { xs: 1, sm: 'auto' } }}
              >
                {hackathon.isRegistered ? t('hackathons.unregister') : t('hackathons.register')}
              </Button>
            }
          />
        ) : (
          <Skeleton variant="rounded" height={260} />
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {isLoading ? (
                  <Skeleton variant="rounded" height={260} />
                ) : (
                  <Stack direction="column" spacing={3}>
                    <Stack direction="column" spacing={1}>
                      <Typography variant="h5" fontWeight={800}>
                        {t('hackathons.details')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('hackathons.projectsLead')}
                      </Typography>
                    </Stack>

                    {hackathon?.description ? (
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        component="div"
                        sx={{ '& p': { m: 0 }, '& p + p': { mt: 2 } }}
                        dangerouslySetInnerHTML={{ __html: hackathon.description }}
                      />
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        {t('hackathons.emptySubtitle')}
                      </Typography>
                    )}
                  </Stack>
                )}
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
