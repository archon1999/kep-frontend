import { useState } from 'react';
import { Box, Card, CardContent, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon } from 'modules/hackathons/application';
import { HackathonPageHeader, HackathonTabs } from 'modules/hackathons/ui/shared';
import { useProjectAttempts } from 'modules/projects/application/queries';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import HackathonAttemptsTable from './components/HackathonAttemptsTable';

const HackathonAttemptsPage = () => {
  const { id } = useParams();
  const hackathonId = id ? Number(id) : undefined;
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data: hackathon } = useHackathon(id);
  const { data, isLoading, mutate } = useProjectAttempts(undefined, { page, hackathonId });
  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonAttempts' : undefined,
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
            title={t('hackathons.attempts')}
            lead={t('hackathons.attemptsLead')}
          />
        ) : (
          <Skeleton variant="rounded" height={260} />
        )}

        <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction="column" spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                <Typography variant="h6" fontWeight={800}>
                  {t('hackathons.attempts')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.total ?? 0} {t('projects.attempts')}
                </Typography>
              </Stack>

              <Box sx={{ overflowX: 'auto' }}>
                <HackathonAttemptsTable attempts={data?.data} isLoading={isLoading} onRerun={() => mutate()} />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Pagination
                  shape="rounded"
                  count={data?.pagesCount ?? 0}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  disabled={!data}
                  color="primary"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default HackathonAttemptsPage;
