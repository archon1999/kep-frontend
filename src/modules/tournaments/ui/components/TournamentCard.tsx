import dayjs from 'dayjs';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { TournamentListItem } from '../../domain/entities/tournament.entity';

interface TournamentCardProps {
  tournament: TournamentListItem;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const { t } = useTranslation();
  const startDate = tournament.startTime ? dayjs(tournament.startTime) : null;

  return (
    <Card
      background={1}
      sx={{
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={getResourceById(resources.Tournament, tournament.id)}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: 1 }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 200,
            bgcolor: 'background.neutral',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 20% 20%, rgba(86, 112, 255, 0.2), transparent 45%)',
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 4,
            }}
          >
            <KepIcon name="tournaments" fontSize={36} />
          </Avatar>
        </Box>

        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Stack direction="column" spacing={0.5} flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={800} noWrap>
                {tournament.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.startsOn', { date: startDate ? startDate.format('DD MMM, HH:mm') : '—' })}
              </Typography>
            </Stack>
            <Chip label={t('tournaments.players', { count: tournament.playersCount })} color="primary" size="small" />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <KepIcon name="tournament" fontSize={18} />
            <Typography variant="body2" color="text.secondary">
              {t('tournaments.type', { type: tournament.type })}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TournamentCard;
