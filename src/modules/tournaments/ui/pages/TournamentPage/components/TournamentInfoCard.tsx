import { useTranslation } from 'react-i18next';
import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import type { TournamentDetailEntity } from 'modules/tournaments/domain';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { formatDateTime } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';

interface TournamentInfoCardProps {
  tournament: TournamentDetailEntity;
}

const TournamentInfoCard = ({ tournament }: TournamentInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader variant="detail" title={tournament.title} backTo={resources.Tournaments} />
      <Card variant="section">
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Chip
                label={t('tournaments.players', { count: tournament.players.length })}
                color="primary"
              />
              <Chip label={t('tournaments.type', { type: tournament.type })} variant="outlined" />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {t('tournaments.startsOn', {
                date: formatDateTime(tournament.startTime, 'compactDateTime'),
              })}
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
                dangerouslySetInnerHTML={createSafeHtml(tournament.description)}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.emptyDescription')}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default TournamentInfoCard;
