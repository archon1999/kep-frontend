import { Card, CardContent, Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChallengeCard from 'modules/challenges/ui/shared/components/ChallengeCard.tsx';
import { Challenge, ChallengePlayer, ChallengeQuestionTimeType, ChallengeStatus } from 'modules/challenges/domain';
import { ArenaChallenge } from 'modules/arena/domain/entities/arena-challenge.entity.ts';
import { PageResult } from 'modules/arena/domain/ports/arena.repository.ts';

interface ChallengesListProps {
  data?: PageResult<ArenaChallenge>;
  loading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  titleKey?: string;
  emptyKey?: string;
  currentUsername?: string;
  showPagination?: boolean;
}

const mapArenaChallengeToChallenge = (challenge: ArenaChallenge): Challenge => {
  const mapPlayer = (player?: ArenaChallenge['playerFirst']): ChallengePlayer => ({
    username: player?.username ?? '-',
    avatar: player?.avatar,
    result: player?.result ?? 0,
    results: player?.results ?? [],
    rating: player?.rating ?? 0,
    newRating: player?.rating ?? 0,
    rankTitle: player?.rankTitle ?? '',
    newRankTitle: player?.rankTitle ?? '',
    delta: 0,
  });

  return {
    id: challenge.id,
    playerFirst: mapPlayer(challenge.playerFirst),
    playerSecond: mapPlayer(challenge.playerSecond),
    finished: challenge.finished,
    questionsCount: challenge.questionsCount,
    timeSeconds: challenge.timeSeconds,
    remainingTimeSeconds: challenge.timeSeconds,
    rated: Boolean(challenge.rated),
    questionTimeType: challenge.questionTimeType ?? ChallengeQuestionTimeType.TimeToAll,
    status: challenge.finished ? ChallengeStatus.Finished : ChallengeStatus.Already,
  };
};

const ArenaChallengesList = ({
  data,
  loading,
  page,
  onPageChange,
  titleKey = 'arena.challenges',
  emptyKey = 'arena.noChallenges',
  currentUsername,
  showPagination = true,
}: ChallengesListProps) => {
  const { t } = useTranslation();

  const challenges = data?.data?.map(mapArenaChallengeToChallenge) ?? [];

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" fontWeight={800}>
        {t(titleKey)}
      </Typography>
      <Grid container spacing={2}>
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rounded" height={160} />
              </Grid>
            ))
          : challenges.map((challenge) => (
              <Grid key={challenge.id} size={{ xs: 12, md: 6 }}>
                <ChallengeCard challenge={challenge} currentUsername={currentUsername} />
              </Grid>
            ))}
      </Grid>
      {!loading && challenges.length === 0 ? (
        <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t(emptyKey)}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
      {showPagination && data?.pagesCount && data.pagesCount > 1 ? (
        <Stack direction="column" alignItems="center">
          <Pagination
            color="warning"
            count={data.pagesCount}
            page={page}
            onChange={(_, value) => onPageChange(value)}
          />
        </Stack>
      ) : null}
    </Stack>
  );
};

export default ArenaChallengesList;
