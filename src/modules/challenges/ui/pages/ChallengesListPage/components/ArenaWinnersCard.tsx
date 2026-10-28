import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Link, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { PageResult } from 'modules/arena/domain/contracts/arena.repository';
import { Arena } from 'modules/arena/domain/entities/arena.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import PatternArtwork from 'shared/components/common/PatternArtwork';

type ChallengesArenaWinnersCardProps = { arenas?: PageResult<Arena>; isLoading: boolean };
const ArenaWinnersCard = ({ arenas, isLoading }: ChallengesArenaWinnersCardProps) => {
  const { t } = useTranslation();
  return (
    <Box component="section" sx={{ p: { xs: 2.5, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
        <Typography component="h2" variant="subtitle1" fontWeight={700}>
          {t('challenges.arenaWinners')}
        </Typography>
        <PatternArtwork kind="competitions" sx={{ width: 84, flexShrink: 0 }} />
      </Stack>
      {isLoading
        ? Array.from({ length: 5 }, (_, index) => <Skeleton key={index} height={64} />)
        : (arenas?.data ?? []).slice(0, 5).map((arena) => {
            const winner = arena.winner as { username?: string } | null;
            return (
              <Box
                key={arena.id}
                sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider', overflowWrap: 'anywhere' }}
              >
                <Link
                  component={RouterLink}
                  to={getResourceById(resources.ArenaTournament, arena.id)}
                  color="text.primary"
                  underline="hover"
                  fontWeight={600}
                  variant="body2"
                >
                  {arena.title}
                </Link>
                {winner?.username && (
                  <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: 0.5 }}>
                    <KepIcon name="ranking" color="warning.main" fontSize={16} />
                    <UserPopover username={winner.username}>
                      <Typography
                        component="button"
                        type="button"
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          border: 0,
                          bgcolor: 'transparent',
                          p: 0,
                          textAlign: 'left',
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {winner.username}
                      </Typography>
                    </UserPopover>
                  </Stack>
                )}
              </Box>
            );
          })}
      {!isLoading && !arenas?.data?.length && (
        <Typography variant="body2" color="text.secondary">
          {t('challenges.noArenas')}
        </Typography>
      )}
      <Button
        fullWidth
        component={RouterLink}
        to={resources.Arena}
        variant="text"
        sx={{ mt: 2 }}
        endIcon={<IconifyIcon icon="solar:arrow-right-linear" fontSize={16} />}
      >
        {t('challenges.viewArena')}
      </Button>
    </Box>
  );
};
export default ArenaWinnersCard;
