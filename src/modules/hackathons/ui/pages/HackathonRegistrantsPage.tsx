import { Avatar, Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonRegistrants } from '../../application/queries';
import HackathonTabs from '../components/HackathonTabs';
import HackathonCountdownCard from '../components/HackathonCountdownCard';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const HackathonRegistrantsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: hackathon } = useHackathon(id);
  const { data: registrants, isLoading } = useHackathonRegistrants(id);
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonRegistrants' : undefined,
    hackathon?.title
      ? {
          hackathonTitle: hackathon.title,
        }
      : undefined,
  );

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        {hackathon ? <HackathonTabs hackathon={hackathon} /> : <Skeleton variant="rectangular" height={56} />}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6" fontWeight={800}>
                    {t('hackathons.registrants')}
                  </Typography>

                  {(registrants ?? []).map((registrant, index) => (
                    <Stack
                      key={registrant.username}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ p: 2, borderRadius: 2, bgcolor: 'background.neutral' }}
                    >
                      <Typography variant="subtitle2" width={32} textAlign="center">
                        {index + 1}
                      </Typography>
                      <Avatar src={registrant.userAvatar} sx={{ width: 40, height: 40 }} />
                      <Stack direction="row" spacing={0.25}>
                        <Typography fontWeight={700}>{registrant.username}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {registrant.userFullName}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}

                  {!isLoading && (!registrants || registrants.length === 0) ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {t('hackathons.emptyTitle')}
                    </Typography>
                  ) : null}
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

export default HackathonRegistrantsPage;
