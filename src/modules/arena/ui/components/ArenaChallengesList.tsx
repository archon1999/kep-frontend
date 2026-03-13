import { Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChallengeCard from 'modules/challenges/ui/components/ChallengeCard.tsx';
import { Challenge, ChallengePlayer, ChallengeQuestionTimeType, ChallengeStatus } from 'modules/challenges/domain';
import { ArenaChallenge } from '../../domain/entities/arena-challenge.entity.ts';
import { PageResult } from '../../domain/ports/arena.repository.ts';

interface ArenaChallengesListProps {
  data?: PageResult<ArenaChallenge>;
  loading?: boolean;
}

const mapArenaChallengeToChallenge = (challenge: ArenaChallenge): Challenge => {
  const mapPlayer = (player?: ArenaChallenge['playerFirst']): ChallengePlayer => ({
    username: player?.username ?? '-',
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
    rated: Boolean(challenge.rated),
    questionTimeType: ChallengeQuestionTimeType.TimeToAll,
    status: challenge.finished ? ChallengeStatus.Finished : ChallengeStatus.Already,
  };
};

const ArenaChallengesList = ({ data, loading }: ArenaChallengesListProps) => {
  const { t } = useTranslation();

  const challenges = data?.data?.map(mapArenaChallengeToChallenge) ?? [];

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" fontWeight={800}>
        {t('arena.challenges')}
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
                <ChallengeCard challenge={challenge} />
              </Grid>
            ))}
      </Grid>
      {!loading && challenges.length === 0 ? (
        <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t('arena.noChallenges')}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
};

export default ArenaChallengesList;
