import {
  type Challenge,
  type ChallengePlayer,
  ChallengeQuestionTimeType,
  ChallengeStatus,
} from 'modules/challenges/domain';
import type { ArenaChallenge } from '../domain/entities/arena-challenge.entity';

export const mapArenaChallengeToChallenge = (challenge: ArenaChallenge): Challenge => {
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
