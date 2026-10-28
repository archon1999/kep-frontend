import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DuelReadyPlayer } from 'modules/duels/domain/index.ts';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';

type Props = {
  players: DuelReadyPlayer[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  currentUsername?: string | null;
  onPageChange: (page: number) => void;
  onChallenge: (player: DuelReadyPlayer) => void;
};

const ReadyPlayerCard = ({
  player,
  disabled,
  onChallenge,
}: {
  player: DuelReadyPlayer;
  disabled?: boolean;
  onChallenge: (player: DuelReadyPlayer) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Card
      variant="panel"
      sx={{
        height: '100%',
      }}
    >
      <CardHeader
        avatar={
          <Avatar src={player.avatar} sx={{ width: 46, height: 46 }}>
            {player.username?.slice(0, 1)}
          </Avatar>
        }
        title={
          <Stack spacing={0.35}>
            <UserPopover username={player.username}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {player.username}
              </Typography>
            </UserPopover>
            {player.contestsRating || player.contestsRatingTitle ? (
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                <ContestsRatingChip title={player.contestsRatingTitle} imgSize={22} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {player.contestsRating ?? '—'} {player.contestsRatingTitle ?? ''}
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            {player.fullName}
          </Typography>
        }
        action={
          <Chip
            label={t('duels.record', {
              wins: player.wins ?? 0,
              draws: player.draws ?? 0,
              losses: player.losses ?? 0,
            })}
            size="small"
            color="primary"
            variant="outlined"
          />
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {t('duels.readyPlayerDescription')}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={disabled}
            onClick={() => onChallenge(player)}
            sx={{ minWidth: 148, borderRadius: 999 }}
          >
            {t('duels.challengeToDuel')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const DuelReadyPlayersSection = ({
  players,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onChallenge,
  currentUsername,
}: Props) => {
  const { t } = useTranslation();
  const pageCount = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={600}>
            {t('duels.readyPlayersTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('duels.readyPlayersSubtitle')}
          </Typography>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : null}

        {!loading && !players.length ? (
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.noReadyPlayers')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {!loading &&
          players.map((player) => (
            <Grid key={player.username} size={{ xs: 12, md: 6, lg: 4 }}>
              <ReadyPlayerCard
                player={player}
                disabled={player.username === currentUsername}
                onChallenge={onChallenge}
              />
            </Grid>
          ))}
      </Grid>

      <ListPagination count={pageCount} page={page} onChange={onPageChange} />
    </Stack>
  );
};

export default DuelReadyPlayersSection;
