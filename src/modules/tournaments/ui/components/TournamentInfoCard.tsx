import dayjs from 'dayjs';
import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TournamentDetailEntity } from '../../domain/entities/tournament.entity';

interface TournamentInfoCardProps {
  tournament: TournamentDetailEntity;
}

const TournamentInfoCard = ({ tournament }: TournamentInfoCardProps) => {
  const { t } = useTranslation();
  const start = tournament.startTime ? dayjs(tournament.startTime) : null;

  return (
    <Card background={1} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography variant="h5" fontWeight={800} sx={{ mr: 1 }}>
              {tournament.title}
            </Typography>
            <Chip label={t('tournaments.players', { count: tournament.players.length })} color="primary" />
            <Chip label={t('tournaments.type', { type: tournament.type })} variant="outlined" />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {t('tournaments.startsOn', { date: start ? start.format('DD MMM, HH:mm') : '—' })}
          </Typography>

          <Divider />

          {tournament.description ? (
            <Typography
              variant="body1"
              color="text.secondary"
              component="div"
              sx={{
                '& p': { m: 0, mb: 1 },
                '& ul': { m: 0, pl: 3 },
              }}
              dangerouslySetInnerHTML={{ __html: tournament.description }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('tournaments.emptyDescription')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentInfoCard;
