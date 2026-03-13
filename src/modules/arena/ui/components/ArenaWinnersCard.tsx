import { useTranslation } from 'react-i18next';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ChallengeChip from 'shared/components/challenges/ChallengeChip.tsx';
import UserPopover from 'modules/users/ui/components/UserPopover';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';

interface ArenaWinnersCardProps {
  topPlayers?: ArenaPlayerStatistics[];
}

const placeIcon = ['mdi:trophy', 'mdi:trophy-outline', 'mdi:trophy-variant-outline'];
const placeColor = ['warning.main', 'info.main', 'success.main'];

const ArenaWinnersCard = ({ topPlayers }: ArenaWinnersCardProps) => {
  const { t } = useTranslation();

  if (!topPlayers || topPlayers.length === 0) return null;

  return (
    <Card
      sx={{
        outline: 'none',
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255,193,7,0.1), rgba(76,175,80,0.08))',
        border: '1px solid',
        borderColor: 'warning.lighter',
      }}
      background={1}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            {t('arena.winners')}
          </Typography>
          <Grid container spacing={2}>
            {topPlayers.slice(0, 3).map((player, index) => (
              <Grid key={player.username} size={{ xs: 12, md: 4 }}>
                <Stack direction="column" spacing={1.5} alignItems="center" textAlign="center">
                  <IconifyIcon icon={placeIcon[index]} fontSize={36} color={placeColor[index]} />
                  <UserPopover username={player.username}>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <ChallengesRatingChip title={player.rankTitle} size="small" />
                      <Typography variant="subtitle1" fontWeight={800}>
                        {player.username}
                      </Typography>
                    </Stack>
                  </UserPopover>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconifyIcon icon="mdi:chart-line" color="warning.main" fontSize={20} />
                    <Typography fontWeight={700}>Perf {player.performance ?? 0}</Typography>
                  </Stack>

                  <Stack direction="column" spacing={0.5} alignItems="center">
                    <ChallengeChip tone="win" label={`W ${player.winRate ?? 0}% (${player.wins})`} sx={{ minWidth: 140 }} />
                    <ChallengeChip tone="draw" label={`D ${player.drawRate ?? 0}% (${player.draws})`} sx={{ minWidth: 140 }} />
                    <ChallengeChip tone="loss" label={`L ${player.lossRate ?? 0}% (${player.losses})`} sx={{ minWidth: 140 }} />
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaWinnersCard;
