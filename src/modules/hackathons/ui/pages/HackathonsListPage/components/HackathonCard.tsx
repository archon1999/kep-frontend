import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type Hackathon } from 'modules/hackathons/domain';
import { HackathonStatusChip } from 'modules/hackathons/ui/shared';
import { stripProjectDescription } from 'modules/projects/application/project-listing';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import EventListCard, { EventDate } from 'shared/components/sections/common/EventListCard';

const HackathonCard = ({ hackathon }: { hackathon: Hackathon }) => {
  const { t } = useTranslation();
  return (
    <EventListCard
      id={hackathon.id}
      title={hackathon.title}
      titleMinLines={2}
      href={getResourceById(resources.Hackathon, hackathon.id)}
      category={t('hackathons.formatValue')}
      icon="mdi:code-braces-box"
      badges={<HackathonStatusChip hackathon={hackathon} variant="status" />}
      media={
        hackathon.logo ? (
          <Box
            sx={{
              width: 80,
              height: 64,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'common.white',
              border: 1,
              borderColor: 'divider',
              p: 1,
            }}
          >
            <Box
              component="img"
              src={hackathon.logo}
              alt=""
              loading="lazy"
              sx={{ maxWidth: '100%', maxHeight: 48, objectFit: 'contain' }}
            />
          </Box>
        ) : (
          <PatternArtwork
            kind="hackathon"
            sx={{ width: 100, display: { xs: 'none', sm: 'block' } }}
          />
        )
      }
      details={[
        {
          label: t('hackathons.startsAt'),
          icon: 'mdi:calendar-outline',
          value: <EventDate value={hackathon.startTime} fallback={t('hackathons.noSchedule')} />,
        },
        {
          label: t('hackathons.endsAt'),
          icon: 'mdi:clock-outline',
          value: <EventDate value={hackathon.finishTime} fallback={t('hackathons.noSchedule')} />,
        },
      ]}
      metrics={[
        {
          label: t('hackathons.projects'),
          icon: 'mdi:code-tags',
          value: hackathon.projectsCount ?? 0,
        },
        {
          label: t('hackathons.participants'),
          icon: 'mdi:account-group-outline',
          value: hackathon.participantsCount ?? 0,
        },
      ]}
      actionLabel={t('hackathons.viewHackathon')}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          lineHeight: 1.8,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          overflowWrap: 'anywhere',
        }}
      >
        {hackathon.description
          ? stripProjectDescription(hackathon.description)
          : t('hackathons.scoringDescription')}
      </Typography>
    </EventListCard>
  );
};
export default HackathonCard;
