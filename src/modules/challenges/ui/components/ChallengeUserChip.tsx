import { Stack, Typography } from '@mui/material';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { ChallengePlayer } from '../../domain';

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
      justifyContent: align === 'left' ? 'flex-start' : 'flex-end',
    }}
  >
    <Stack
      spacing={1}
      direction="row"
      alignItems={align === 'left' ? 'flex-start' : 'flex-end'}
      flexDirection={align == 'left' ? 'row' : 'row-reverse'}
    >
      <ChallengesRatingChip title={player.rankTitle} size="small" />
      <Typography variant="subtitle2" fontWeight={700}>
        {player.username}
      </Typography>
    </Stack>
  </Stack>
);

export default ChallengeUserChip;
