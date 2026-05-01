import { Avatar, Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonRegistrants } from 'modules/hackathons/application';
import { HackathonPageHeader, HackathonTabs } from 'modules/hackathons/ui/shared';
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

        {hackathon ? (
          <HackathonPageHeader
            hackathon={hackathon}
            eyebrow={hackathon.title}
            title={t('hackathons.registrants')}
            lead={t('hackathons.registrantsLead')}
          />
        ) : (
          <Skeleton variant="rounded" height={260} />
        )}

        <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
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
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'background.neutral',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" width={32} textAlign="center">
                    {index + 1}
                  </Typography>
                  <Avatar src={registrant.userAvatar} sx={{ width: 44, height: 44 }} />
                  <Stack direction="column" spacing={0.25}>
                    <Typography fontWeight={700}>{registrant.username}</Typography>
                    {registrant.userFullName ? (
                      <Typography variant="body2" color="text.secondary">
                        {registrant.userFullName}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              ))}

              {!isLoading && (!registrants || registrants.length === 0) ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  {t('hackathons.noRegistrants')}
                </Typography>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default HackathonRegistrantsPage;
