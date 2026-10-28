import { Box } from '@mui/material';
import { PageResult as ArenaPageResult } from 'modules/arena/domain/contracts/arena.repository';
import { Arena } from 'modules/arena/domain/entities/arena.entity';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import { PageResult } from 'modules/challenges/domain/contracts/challenges.repository';
import ArenaWinnersCard from './components/ArenaWinnersCard';
import ChallengeRatingPreviewCard from './components/ChallengeRatingPreviewCard';

type ChallengesListPageInsightsSectionProps = {
  ratingPreview?: PageResult<ChallengeRatingRow>;
  isRatingLoading: boolean;
  arenas?: ArenaPageResult<Arena>;
  isArenasLoading: boolean;
};
const ChallengesListPageInsightsSection = ({
  ratingPreview,
  isRatingLoading,
  arenas,
  isArenasLoading,
}: ChallengesListPageInsightsSectionProps) => (
  <Box
    component="aside"
    sx={{
      minWidth: 0,
      borderLeftStyle: 'solid',
      borderLeftWidth: { xs: 0, lg: 1 },
      borderTopStyle: 'solid',
      borderTopWidth: { xs: 1, lg: 0 },
      borderColor: 'divider',
    }}
  >
    <ChallengeRatingPreviewCard ratingPreview={ratingPreview} isLoading={isRatingLoading} />
    <ArenaWinnersCard arenas={arenas} isLoading={isArenasLoading} />
  </Box>
);
export default ChallengesListPageInsightsSection;
