import { Box } from '@mui/material';
import type { UsersListItem } from 'modules/users/domain/entities/user.entity';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';

interface LeaderboardValueProps {
  kind: 'contests' | 'skills' | 'activity' | 'challenges' | 'streak' | 'kepcoin';
  user: UsersListItem;
  value: string;
}

const LeaderboardValue = ({ kind, user, value }: LeaderboardValueProps) => (
  <Box component="span" className="kep-leader-value">
    {kind === 'kepcoin' ? (
      <KepcoinValue value={user.kepcoin} label={value} iconSize={22} color="inherit" />
    ) : kind === 'streak' ? (
      <Streak
        streak={user.streak}
        maxStreak={user.maxStreak}
        iconSize={22}
        fallback="—"
        color="inherit"
      />
    ) : (
      <>
        {kind === 'contests' && (
          <ContestsRatingChip title={user.contestsRating?.title} imgSize={24} />
        )}
        {kind === 'challenges' && <ChallengesRatingChip title={user.challengesRating?.title} />}
        <strong>{value}</strong>
      </>
    )}
  </Box>
);

export default LeaderboardValue;
