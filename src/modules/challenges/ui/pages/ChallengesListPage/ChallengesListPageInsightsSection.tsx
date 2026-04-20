import Grid from '@mui/material/Grid';
import { Arena } from 'modules/arena/domain/entities/arena.entity.ts';
import { PageResult as ArenaPageResult } from 'modules/arena/domain/ports/arena.repository.ts';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import { PageResult } from 'modules/challenges/domain/ports/challenges.repository.ts';
import ChallengesListPageArenaWinnersCard from './components/ChallengesListPageArenaWinnersCard.tsx';
import ChallengesListPageRatingPreviewCard from './components/ChallengesListPageRatingPreviewCard.tsx';

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
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 6 }}>
      <ChallengesListPageRatingPreviewCard
        ratingPreview={ratingPreview}
        isLoading={isRatingLoading}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 6 }}>
      <ChallengesListPageArenaWinnersCard arenas={arenas} isLoading={isArenasLoading} />
    </Grid>
  </Grid>
);

export default ChallengesListPageInsightsSection;
