import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type Hackathon } from 'modules/hackathons/domain';
import { EventDate } from 'shared/components/sections/common/EventListCard';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { createSafeHtml } from 'shared/lib/safeHtml';

const HackathonSummaryCard = ({ hackathon }: { hackathon: Hackathon }) => {
  const { t } = useTranslation();
  return (
    <Box component="section" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <SectionHeader title={t('hackathons.about')} />
      <Box
        sx={{
          p: { xs: 2.5, md: 4 },
          typography: 'body1',
          lineHeight: 1.85,
          overflowWrap: 'anywhere',
          '& p': { mt: 0, mb: 1.5 },
          '& p:last-child': { mb: 0 },
          '& strong': { color: 'text.primary', fontWeight: 600 },
          '& img': { maxWidth: '100%', height: 'auto' },
          '& pre, & table': { maxWidth: '100%', overflowX: 'auto', display: 'block' },
          '& a': { color: 'primary.main' },
        }}
        dangerouslySetInnerHTML={createSafeHtml(
          hackathon.description || t('hackathons.noDescription'),
        )}
      />
      <Box
        component="dl"
        sx={{
          m: 0,
          p: { xs: 2.5, md: 4 },
          pt: { xs: 0, md: 0 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
        }}
      >
        {[
          { label: 'hackathons.startsAt', value: hackathon.startTime },
          { label: 'hackathons.endsAt', value: hackathon.finishTime },
        ].map((item) => (
          <Box key={item.label}>
            <Typography component="dt" variant="label" color="text.secondary" sx={{ mb: 1 }}>
              {t(item.label)}
            </Typography>
            <Box component="dd" sx={{ m: 0 }}>
              <EventDate value={item.value} fallback={t('hackathons.noSchedule')} />
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {[
          {
            label: 'hackathons.projects',
            value: hackathon.projectsCount,
            route: resources.HackathonProjects,
          },
          {
            label: 'hackathons.registrants',
            value: hackathon.registrantsCount,
            route: resources.HackathonRegistrants,
          },
          {
            label: 'hackathons.participants',
            value: hackathon.participantsCount,
            route: resources.HackathonStandings,
          },
        ].map((item, index) => (
          <Stack
            key={item.label}
            component={RouterLink}
            to={getResourceById(item.route, hackathon.id)}
            direction="column"
            gap={1}
            sx={{
              px: { xs: 1.5, md: 4 },
              py: 2.5,
              textDecoration: 'none',
              color: 'inherit',
              minWidth: 0,
              borderRight: index < 2 ? 1 : 0,
              borderColor: 'divider',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Typography
              variant="label"
              color="text.secondary"
              sx={{ fontSize: { xs: 10, sm: 12 }, overflowWrap: 'anywhere' }}
            >
              {t(item.label)}
            </Typography>
            <Typography variant="metric" sx={{ fontSize: 30 }}>
              {item.value ?? 0}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
};
export default HackathonSummaryCard;
