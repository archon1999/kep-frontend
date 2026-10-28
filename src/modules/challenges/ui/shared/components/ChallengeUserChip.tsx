import { Stack, Typography } from '@mui/material';
import { ChallengePlayer } from 'modules/challenges/domain';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';

interface ChallengeUserChipProps {
  player: ChallengePlayer;
  align?: 'left' | 'right';
  highlight?: boolean;
}

const ChallengeUserChip = ({ player, align = 'left' }: ChallengeUserChipProps) => (
  <Stack
    direction="row"
    spacing={1.5}
    alignItems="center"
    sx={{
      textAlign: align,
      minWidth: 0,
      justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
    }}
  >
    <Stack
      spacing={1}
      direction="row"
      alignItems={align === 'left' ? 'flex-start' : 'flex-end'}
      flexDirection={align == 'left' ? 'row' : 'row-reverse'}
      sx={{ minWidth: 0, flexWrap: 'wrap', gap: 0.75 }}
    >
      <ChallengesRatingChip title={player.rankTitle} size="small" />
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
      >
        {player.username}
      </Typography>
    </Stack>
  </Stack>
);

export default ChallengeUserChip;
