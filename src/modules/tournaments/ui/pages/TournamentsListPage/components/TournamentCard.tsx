import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import type { TournamentListItem } from 'modules/tournaments/domain';
import EventListCard, { EventDate } from 'shared/components/sections/common/EventListCard';

const TournamentCard = ({ tournament }: { tournament: TournamentListItem }) => {
  const { t } = useTranslation();
  return (
    <EventListCard
      id={tournament.id}
      title={tournament.title}
      href={getResourceById(resources.Tournament, tournament.id)}
      category={t('tournaments.bracketTitle')}
      icon="mdi:tournament"
      media={
        <Box
          component="svg"
          viewBox="0 0 80 64"
          aria-hidden="true"
          sx={{ width: 72, height: 56, flexShrink: 0, color: 'secondary.main' }}
        >
          <path
            d="M4 8H20V24H4M20 16H36V32H52M4 40H20V56H4M20 48H36V32M52 32H66M60 26L66 32L60 38"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect x="1" y="5" width="5" height="5" fill="currentColor" />
          <rect x="1" y="53" width="5" height="5" fill="currentColor" />
        </Box>
      }
      details={[
        {
          label: t('tournaments.formatLabel'),
          icon: 'mdi:code-braces',
          value: (
            <Typography variant="pixel" sx={{ fontSize: 22 }}>
              {tournament.type.replace(/([a-z])([A-Z])/g, '$1 $2')}
            </Typography>
          ),
        },
        {
          label: t('tournaments.startsLabel'),
          icon: 'mdi:calendar-outline',
          value: <EventDate value={tournament.startTime} />,
        },
      ]}
      metrics={[
        {
          label: t('tournaments.playersLabel'),
          icon: 'mdi:account-group-outline',
          value: tournament.playersCount,
        },
      ]}
      actionLabel={t('tournaments.viewTournament')}
    >
      <Typography variant="body2" color="text.secondary">
        {t('tournaments.bracketSubtitle', { count: tournament.playersCount })}
      </Typography>
    </EventListCard>
  );
};
export default TournamentCard;
