import { Box, Card, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import { Challenge } from '../../domain';
import ChallengeUserChip from './ChallengeUserChip.tsx';

dayjs.extend(relativeTime);

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  dayjs.extend(relativeTime);

  const getResultColor = (score: number, opponentScore: number) => {
    if (score > opponentScore) return 'success.main';
    if (score < opponentScore) return 'error.main';
    return 'text.secondary';
  };

  return (
    <Card variant="outlined" background={0}>
      <Stack spacing={1.5} direction="column" paddingX={2} paddingY={1}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <UserPopover sx={{ width: 200 }} username={challenge.playerFirst.username}>
            <ChallengeUserChip
              player={challenge.playerFirst}
              highlight={challenge.playerFirst.result > challenge.playerSecond.result}
            />
          </UserPopover>
          <Box textAlign="center" px={1}>
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
          <UserPopover sx={{ width: 200 }} username={challenge.playerSecond.username}>
            <Stack width={1} justifyContent="flex-end">
              <ChallengeUserChip
                player={challenge.playerSecond}
                align="right"
                highlight={challenge.playerSecond.result > challenge.playerFirst.result}
              />
            </Stack>
          </UserPopover>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ChallengeCard;
