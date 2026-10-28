import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { Challenge, ChallengeStatus } from 'modules/challenges/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ChallengeUserChip from './ChallengeUserChip';

interface ChallengeCardProps {
  challenge: Challenge;
  currentUsername?: string;
}
const ChallengeCard = ({ challenge, currentUsername }: ChallengeCardProps) => {
  const { t } = useTranslation();
  const finished = challenge.status === ChallengeStatus.Finished;
  const players = [challenge.playerFirst, challenge.playerSecond];
  return (
    <Box
      component="article"
      sx={{
        py: 2,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 36px',
        columnGap: { xs: 1, sm: 2 },
        alignItems: 'center',
        minHeight: 72,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
        }}
      >
        {players.map((player, index) => (
          <Box
            key={index}
            sx={{
              minWidth: 0,
              gridColumn: index === 0 ? 1 : 3,
              gridRow: 1,
              color:
                player.username.toLowerCase() === currentUsername?.toLowerCase()
                  ? 'primary.main'
                  : 'text.primary',
            }}
          >
            <UserPopover
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: index === 0 ? 'flex-end' : 'flex-start',
              }}
              username={player.username}
              avatar={player.avatar}
            >
              <ChallengeUserChip player={player} align={index === 0 ? 'right' : 'left'} />
            </UserPopover>
          </Box>
        ))}
        <Stack direction="row" gap={0.75} alignItems="center" sx={{ gridColumn: 2, gridRow: 1 }}>
          {players.map((player, index) => (
            <Stack key={index} direction="row" gap={0.75} alignItems="center">
              {index === 1 && (
                <Typography variant="body2" color="text.disabled">
                  :
                </Typography>
              )}
              <Typography
                variant="metric"
                sx={{ fontSize: { xs: 23, sm: 28 } }}
                color={
                  finished && player.result > players[1 - index].result
                    ? 'success.main'
                    : 'text.primary'
                }
              >
                {player.result}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Tooltip title={t('challenges.statisticsPage.history.view')}>
        <IconButton
          component={RouterLink}
          to={getResourceById(resources.Challenge, challenge.id)}
          aria-label={`${t('challenges.statisticsPage.history.view')} #${challenge.id}`}
          color="primary"
          size="small"
          sx={{ width: 36, height: 36, border: 1, borderColor: 'divider' }}
        >
          <IconifyIcon icon="solar:arrow-right-up-linear" fontSize={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default ChallengeCard;
