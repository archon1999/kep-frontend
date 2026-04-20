import { keyframes } from '@emotion/react';
import { Box, Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserPopover from 'modules/users/ui/components/UserPopover';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import firstPlaceImage from 'shared/assets/images/icons/arena-first-place.png';
import secondPlaceImage from 'shared/assets/images/icons/arena-second-place.png';
import thirdPlaceImage from 'shared/assets/images/icons/arena-third-place.png';
import { ArenaPlayerStatistics } from 'modules/arena/domain/entities/arena-player-statistics.entity.ts';

interface ArenaDetailPageWinnersCardProps {
  topPlayers?: ArenaPlayerStatistics[];
}

const podiumBounce = keyframes`
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  60% {
    opacity: 1;
    transform: translateY(-8px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const placeImages = [secondPlaceImage, firstPlaceImage, thirdPlaceImage];
const placeOffsets = [2, 0, 4];
const placeDelays = ['120ms', '280ms', '440ms'];

const WinnerStats = ({ player }: { player: ArenaPlayerStatistics }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" spacing={0.5} alignItems="center">
      <UserPopover username={player.username}>
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" justifyContent="center">
          <ChallengesRatingChip title={player.rankTitle} size="small" />
          <Typography fontWeight={700}>{player.username}</Typography>
        </Stack>
      </UserPopover>

      <Tooltip title={t('arena.performanceShort')}>
        <Stack direction="row" spacing={0.75} alignItems="center" color="text.primary">
          <IconifyIcon icon="mdi:chart-line" color="warning.main" fontSize={18} />
          <Typography fontFamily="monospace" fontWeight={700}>
            {player.performance ?? 0}
          </Typography>
        </Stack>
      </Tooltip>

      <Tooltip title={t('arena.statisticsLabels.wins')}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography color="success.main" fontWeight={800}>
            W
          </Typography>
          <Typography fontFamily="monospace">
            {player.winRate ?? 0}% ({player.wins ?? 0})
          </Typography>
        </Stack>
      </Tooltip>

      <Tooltip title={t('arena.statisticsLabels.draws')}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography color="text.secondary" fontWeight={800}>
            D
          </Typography>
          <Typography fontFamily="monospace">
            {player.drawRate ?? 0}% ({player.draws ?? 0})
          </Typography>
        </Stack>
      </Tooltip>

      <Tooltip title={t('arena.statisticsLabels.losses')}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography color="error.main" fontWeight={800}>
            L
          </Typography>
          <Typography fontFamily="monospace">
            {player.lossRate ?? 0}% ({player.losses ?? 0})
          </Typography>
        </Stack>
      </Tooltip>
    </Stack>
  );
};

const ArenaDetailPageWinnersCard = ({ topPlayers }: ArenaDetailPageWinnersCardProps) => {
  const { t } = useTranslation();

  if (!topPlayers || topPlayers.length === 0) return null;

  const podiumPlayers = [topPlayers[1], topPlayers[0], topPlayers[2]];

  return (
    <Card
      sx={{
        outline: 'none',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'warning.lighter',
        background: 'linear-gradient(135deg, rgba(255,193,7,0.08), rgba(76,175,80,0.06))',
      }}
      background={1}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="column" spacing={2.5}>
          <Typography variant="h6" fontWeight={800}>
            {t('arena.winners')}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: { xs: 1, md: 2 },
              alignItems: 'start',
              textAlign: 'center',
            }}
          >
            {podiumPlayers.map((player, index) => (
              <Box
                key={index}
                sx={{
                  mt: placeOffsets[index],
                  animation: `${podiumBounce} 900ms cubic-bezier(0.22, 1, 0.36, 1) both`,
                  animationDelay: placeDelays[index],
                }}
              >
                {player ? (
                  <Stack direction="column" spacing={1.25} alignItems="center">
                    <Box
                      component="img"
                      src={placeImages[index]}
                      alt={`place-${index + 1}`}
                      sx={{ width: { xs: 60, md: 90 }, height: { xs: 60, md: 90 }, objectFit: 'contain' }}
                    />
                    <WinnerStats player={player} />
                  </Stack>
                ) : null}
              </Box>
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaDetailPageWinnersCard;
