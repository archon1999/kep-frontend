import { Box, Card, Stack, Typography } from '@mui/material';
import { Challenge } from 'modules/challenges/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import ChallengeUserChip from './ChallengeUserChip.tsx';

interface ChallengeCardProps {
  challenge: Challenge;
  currentUsername?: string;
}

const ChallengeCard = ({ challenge, currentUsername }: ChallengeCardProps) => {
  const currentUsernameLower = currentUsername?.toLowerCase();
  const isPlayerFirstCurrent = Boolean(
    currentUsernameLower && challenge.playerFirst.username.toLowerCase() === currentUsernameLower,
  );
  const isPlayerSecondCurrent = Boolean(
    currentUsernameLower && challenge.playerSecond.username.toLowerCase() === currentUsernameLower,
  );

  const getResultColor = (score: number, opponentScore: number) => {
    if (score > opponentScore) return 'success.main';
    if (score < opponentScore) return 'error.main';
    return 'text.secondary';
  };

  const getPlayerPanelSx = (isCurrentUser: boolean, align: 'left' | 'right') => ({
    flex: '1 1 0',
    minWidth: 0,
    px: 2,
    py: 1.25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
    bgcolor: isCurrentUser ? 'primary.lighter' : 'transparent',
  });

  return (
    <Card variant="outlined" sx={{ overflow: 'hidden' }}>
      <Stack direction="row" alignItems="stretch" sx={{ minHeight: 64 }}>
        <Box sx={getPlayerPanelSx(isPlayerFirstCurrent, 'left')}>
          <UserPopover
            sx={{ width: 1 }}
            username={challenge.playerFirst.username}
            avatar={challenge.playerFirst.avatar}
          >
            <ChallengeUserChip
              player={challenge.playerFirst}
              highlight={challenge.playerFirst.result > challenge.playerSecond.result}
            />
          </UserPopover>
        </Box>
        <Box
          textAlign="center"
          px={1.5}
          sx={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography
              variant="h5"
              fontWeight={800}
              color={getResultColor(challenge.playerFirst.result, challenge.playerSecond.result)}
            >
              {challenge.playerFirst.result}
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.secondary">
              :
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
              color={getResultColor(challenge.playerSecond.result, challenge.playerFirst.result)}
            >
              {challenge.playerSecond.result}
            </Typography>
          </Stack>
        </Box>
        <Box sx={getPlayerPanelSx(isPlayerSecondCurrent, 'right')}>
          <UserPopover
            sx={{ width: 1 }}
            username={challenge.playerSecond.username}
            avatar={challenge.playerSecond.avatar}
          >
            <Stack width={1} justifyContent="flex-end">
              <ChallengeUserChip
                player={challenge.playerSecond}
                align="right"
                highlight={challenge.playerSecond.result > challenge.playerFirst.result}
              />
            </Stack>
          </UserPopover>
        </Box>
      </Stack>
    </Card>
  );
};

export default ChallengeCard;
