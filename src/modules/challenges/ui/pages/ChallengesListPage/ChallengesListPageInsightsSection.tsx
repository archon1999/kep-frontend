import Grid from '@mui/material/Grid';
import { Arena } from 'modules/arena/domain/entities/arena.entity.ts';
import { PageResult as ArenaPageResult } from 'modules/arena/domain/ports/arena.repository.ts';
import { ChallengeRatingRow } from 'modules/challenges/domain';
import { PageResult } from 'modules/challenges/domain/ports/challenges.repository.ts';
import ArenaWinnersCard from './components/ArenaWinnersCard.tsx';
import ChallengeRatingPreviewCard from './components/ChallengeRatingPreviewCard.tsx';

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
      <ChallengeRatingPreviewCard
        ratingPreview={ratingPreview}
        isLoading={isRatingLoading}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 6 }}>
      <ArenaWinnersCard arenas={arenas} isLoading={isArenasLoading} />
    </Grid>
  </Grid>
);

export default ChallengesListPageInsightsSection;
