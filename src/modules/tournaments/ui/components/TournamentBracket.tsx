import { useMemo } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  TournamentDetailEntity,
  TournamentPlayerProfile,
  TournamentStageInfo,
  TournamentStageMatch,
} from '../../domain/entities/tournament.entity';

interface TournamentBracketProps {
  tournament: TournamentDetailEntity;
}

const MATCH_HEIGHT = 96;
const MATCH_WIDTH = 260;
const COLUMN_GAP = 56;
const VERTICAL_GAP = 16;
const HEADER_HEIGHT = 32;

type BracketMatch = {
  id: string;
  roundIndex: number;
  matchIndex: number;
  duel?: TournamentStageMatch;
  playerFirst?: TournamentPlayerProfile | null;
  playerSecond?: TournamentPlayerProfile | null;
  winnerId?: number | null;
  isFinished: boolean;
};

type PositionedMatch = BracketMatch & {
  top: number;
  left: number;
  centerX: number;
  centerY: number;
};

const nearestPowerOfTwo = (value: number) => {
  let size = 1;
  while (size < value) {
    size *= 2;
  }
  return size;
};

const getRoundTitle = (roundIndex: number, maxPlayers: number, t: (key: string, opts?: any) => string) => {
  const rounds = Math.log2(maxPlayers);
  const factor = Math.pow(2, Math.max(rounds - roundIndex, 1));

  if (factor === 2) return t('tournaments.round.final');
  if (factor === 4) return t('tournaments.round.semifinal');
  if (factor === 8) return t('tournaments.round.quarter');

  return t('tournaments.round.generic', { value: factor });
};

const getWinnerId = (duel?: TournamentStageMatch['duel']) => {
  if (!duel || duel.status !== 1) return null;
  if (duel.playerFirst.status === 1) return duel.playerFirst.id;
  if (duel.playerSecond?.status === 1) return duel.playerSecond.id;
  return null;
};

const getAdvancingPlayer = (match?: BracketMatch) => {
  if (!match) return null;
  if (match.winnerId && match.playerFirst?.id === match.winnerId) return match.playerFirst;
  if (match.winnerId && match.playerSecond?.id === match.winnerId) return match.playerSecond;
  if (match.playerFirst && !match.playerSecond) return match.playerFirst;
  if (match.playerSecond && !match.playerFirst) return match.playerSecond;
  return null;
};

const normalizeStageMap = (stages?: TournamentStageInfo[]) => {
  const sortedStages = [...(stages ?? [])].sort((a, b) => {
    const duelDiff = (b.duels?.length ?? 0) - (a.duels?.length ?? 0);
    if (duelDiff !== 0) return duelDiff;
    return a.number - b.number;
  });
  return sortedStages.reduce((acc, stage, idx) => {
    acc.set(idx, stage);
    return acc;
  }, new Map<number, TournamentStageInfo>());
};

const normalizeDuelsOrder = (duels: TournamentStageMatch[] | undefined, expectedMatchCount: number) => {
  const result: Array<TournamentStageMatch | undefined> = Array(expectedMatchCount).fill(undefined);
  if (!duels?.length) return result;

  const sorted = [...duels].sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
  let cursor = 0;

  sorted.forEach((duel, idx) => {
    const suggested = duel.number != null ? duel.number - 1 : idx;
    let targetIndex = suggested;

    if (targetIndex < 0 || targetIndex >= expectedMatchCount || result[targetIndex]) {
      while (cursor < expectedMatchCount && result[cursor]) {
        cursor += 1;
      }
      targetIndex = cursor;
    }

    if (targetIndex < expectedMatchCount) {
      result[targetIndex] = duel;
    }
  });

  return result;
};

const collectStageParticipantsCount = (stages?: TournamentStageInfo[]) => {
  const ids = new Set<number>();
  (stages ?? []).forEach((stage) =>
    (stage.duels ?? []).forEach((duel) => {
      if (duel.duel?.playerFirst?.id != null) ids.add(duel.duel.playerFirst.id);
      if (duel.duel?.playerSecond?.id != null) ids.add(duel.duel.playerSecond.id);
    }),
  );
  return ids.size;
};

const buildBracketRounds = (tournament: TournamentDetailEntity, bracketSize: number): BracketMatch[][] => {
  const roundsCount = Math.log2(bracketSize);
  const stageMap = normalizeStageMap(tournament.stages);

  const rounds: BracketMatch[][] = [];
  const firstStage = stageMap.get(0);
  const firstRoundMatchesCount = bracketSize / 2;
  const firstDuels = normalizeDuelsOrder(firstStage?.duels, firstRoundMatchesCount);

  const firstRound: BracketMatch[] = [];
  for (let matchIndex = 0; matchIndex < firstRoundMatchesCount; matchIndex += 1) {
    const duel = firstDuels[matchIndex];
    const duelEntity = duel?.duel;
    const playerFirst = duelEntity?.playerFirst ?? tournament.players[matchIndex * 2] ?? null;
    const playerSecond = duelEntity?.playerSecond ?? tournament.players[matchIndex * 2 + 1] ?? null;

    firstRound.push({
      id: `0-${matchIndex}`,
      roundIndex: 0,
      matchIndex,
      duel,
      playerFirst,
      playerSecond,
      winnerId: getWinnerId(duelEntity),
      isFinished: (duelEntity?.status ?? 0) === 1,
    });
  }
  rounds.push(firstRound);

  for (let roundIndex = 1; roundIndex < roundsCount; roundIndex += 1) {
    const stage = stageMap.get(roundIndex);
    const matchCount = bracketSize / Math.pow(2, roundIndex + 1);
    const duels = normalizeDuelsOrder(stage?.duels, matchCount);
    const roundMatches: BracketMatch[] = [];

    for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
      const duel = duels[matchIndex];
      const duelEntity = duel?.duel;
      const sourceFirst = rounds[roundIndex - 1][matchIndex * 2];
      const sourceSecond = rounds[roundIndex - 1][matchIndex * 2 + 1];

      const playerFirst = duelEntity?.playerFirst ?? getAdvancingPlayer(sourceFirst);
      const playerSecond = duelEntity?.playerSecond ?? getAdvancingPlayer(sourceSecond);

      roundMatches.push({
        id: `${roundIndex}-${matchIndex}`,
        roundIndex,
        matchIndex,
        duel,
        playerFirst,
        playerSecond,
        winnerId: getWinnerId(duelEntity),
        isFinished: (duelEntity?.status ?? 0) === 1,
      });
    }

    rounds.push(roundMatches);
  }

  return rounds;
};

const positionRounds = (rounds: BracketMatch[][]) => {
  if (!rounds.length) {
    return {
      rounds: [] as PositionedMatch[][],
      width: 0,
      height: 0,
      columnLeft: [] as number[],
    };
  }

  const columnLeft = rounds.map((_, index) => index * (MATCH_WIDTH + COLUMN_GAP));

  const centers: number[][] = [];
  centers[0] = rounds[0].map(
    (_, matchIndex) => HEADER_HEIGHT + MATCH_HEIGHT / 2 + matchIndex * (MATCH_HEIGHT + VERTICAL_GAP),
  );

  for (let roundIndex = 1; roundIndex < rounds.length; roundIndex += 1) {
    centers[roundIndex] = rounds[roundIndex].map((_, matchIndex) => {
      const prevCenters = centers[roundIndex - 1];
      const topChild = prevCenters[matchIndex * 2];
      const bottomChild = prevCenters[matchIndex * 2 + 1];
      return (topChild + bottomChild) / 2;
    });
  }

  const positionedRounds: PositionedMatch[][] = rounds.map((round, roundIndex) =>
    round.map((match, matchIndex) => {
      const centerY = centers[roundIndex][matchIndex];
      const left = columnLeft[roundIndex];
      return {
        ...match,
        top: centerY - MATCH_HEIGHT / 2,
        left,
        centerX: left + MATCH_WIDTH / 2,
        centerY,
      };
    }),
  );

  const height = (centers[0][centers[0].length - 1] ?? 0) + MATCH_HEIGHT / 2 + VERTICAL_GAP;
  const width = columnLeft[columnLeft.length - 1] + MATCH_WIDTH;

  return { rounds: positionedRounds, width, height, columnLeft };
};

const PlayerRow = ({
                     player,
                     highlight,
                     placeholderName,
                     placeholderRating,
                   }: {
  player?: TournamentPlayerProfile | null;
  highlight?: boolean;
  placeholderName: string;
  placeholderRating: string;
}) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    spacing={1}
    sx={{
      px: 1.5,
      py: 1,
      borderRadius: 1.5,
      bgcolor: highlight ? 'primary.main' : 'background.neutral',
      color: highlight ? 'primary.contrastText' : 'text.primary',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    }}
  >
    <Stack direction="column" spacing={0.25} sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2" fontWeight={700} noWrap title={player?.username ?? placeholderName}>
        {player?.username ?? placeholderName}
      </Typography>
      <Typography variant="caption" color={highlight ? 'inherit' : 'text.secondary'} noWrap>
        {player?.ratingTitle ?? placeholderRating}
      </Typography>
    </Stack>
    {typeof player?.balls === 'number' ? (
      <Typography variant="subtitle1" fontWeight={800} color={highlight ? 'inherit' : 'text.secondary'}>
        {player.balls}
      </Typography>
    ) : null}
  </Stack>
);

const BracketMatchCard = ({
                            match,
                            hasNextRound,
                            connectorColor,
                            placeholderName,
                            placeholderRating,
                          }: {
  match: PositionedMatch;
  hasNextRound: boolean;
  connectorColor: string;
  placeholderName: string;
  placeholderRating: string;
}) => {
  const theme = useTheme();

  const highlightFirst = match.winnerId != null && match.playerFirst?.id === match.winnerId;
  const highlightSecond = match.winnerId != null && match.playerSecond?.id === match.winnerId;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: match.top,
        left: match.left,
        width: MATCH_WIDTH,
        height: MATCH_HEIGHT,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        bgcolor: 'background.paper',
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        overflow: 'hidden',
        '::after': hasNextRound
          ? {
            content: '""',
            position: 'absolute',
            right: -COLUMN_GAP / 2,
            top: '50%',
            width: COLUMN_GAP / 2,
            height: 1.5,
            bgcolor: connectorColor,
          }
          : undefined,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        #{match.matchIndex + 1}
      </Typography>
      <Stack direction="column" spacing={1}>
        <PlayerRow
          player={match.playerFirst}
          highlight={highlightFirst}
          placeholderName={placeholderName}
          placeholderRating={placeholderRating}
        />
        <PlayerRow
          player={match.playerSecond}
          highlight={highlightSecond}
          placeholderName={placeholderName}
          placeholderRating={placeholderRating}
        />
      </Stack>
    </Box>
  );
};

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const stageParticipantsCount = collectStageParticipantsCount(tournament.stages);
  const firstStageDuelsCount = (tournament.stages?.[0]?.duels?.length ?? 0) * 2;
  const participantCount = Math.max(tournament.players.length, stageParticipantsCount, firstStageDuelsCount, 2);
  const bracketSize = nearestPowerOfTwo(participantCount);

  const layout = useMemo(() => {
    const rounds = buildBracketRounds(tournament, bracketSize);
    return positionRounds(rounds);
  }, [tournament, bracketSize]);

  const roundTitles = useMemo(
    () => layout.rounds.map((_, roundIndex) => getRoundTitle(roundIndex, bracketSize, t)),
    [layout.rounds, bracketSize, t],
  );

  const connectors = useMemo(() => {
    const lines: { fromX: number; fromY: number; toX: number; toY: number }[] = [];
    for (let roundIndex = 0; roundIndex < layout.rounds.length - 1; roundIndex += 1) {
      const currentRound = layout.rounds[roundIndex];
      const nextRound = layout.rounds[roundIndex + 1];

      currentRound.forEach((match) => {
        const targetIndex = Math.floor(match.matchIndex / 2);
        const target = nextRound[targetIndex];
        if (!target) return;

        lines.push({
          fromX: match.left + MATCH_WIDTH,
          fromY: match.centerY,
          toX: target.left,
          toY: target.centerY,
        });
      });
    }
    return lines;
  }, [layout.rounds]);

  const placeholderName = t('tournaments.awaitingOpponent');
  const placeholderRating = t('tournaments.awaitingWinner');

  return (
    <Card background={1} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="column" spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h6" fontWeight={800}>
                {t('tournaments.bracketTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('tournaments.bracketSubtitle', { count: bracketSize })}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Box sx={{ overflowX: 'auto', pb: 2 }}>
            <Box
              sx={{
                position: 'relative',
                minWidth: layout.width,
                minHeight: layout.height,
                pr: COLUMN_GAP,
              }}
            >
              <Box
                component="svg"
                viewBox={`0 0 ${layout.width + COLUMN_GAP} ${layout.height}`}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  overflow: 'visible',
                }}
              >
                {connectors.map((line, index) => {
                  const midX = (line.fromX + line.toX) / 2;
                  return (
                    <path
                      key={`${line.fromX}-${line.fromY}-${index}`}
                      d={`M ${line.fromX} ${line.fromY} L ${midX} ${line.fromY} L ${midX} ${line.toY} L ${line.toX} ${line.toY}`}
                      stroke={theme.palette.divider}
                      strokeWidth={2}
                      fill="none"
                    />
                  );
                })}
              </Box>

              {layout.rounds.map((_, roundIndex) => (
                <Typography
                  key={`title-${roundIndex}`}
                  variant="subtitle2"
                  fontWeight={800}
                  color="text.secondary"
                  align="center"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: layout.columnLeft[roundIndex],
                    width: MATCH_WIDTH,
                  }}
                >
                  {roundTitles[roundIndex]}
                </Typography>
              ))}

              {layout.rounds.map((round, roundIndex) =>
                round.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    hasNextRound={roundIndex < layout.rounds.length - 1}
                    connectorColor={theme.palette.divider}
                    placeholderName={placeholderName}
                    placeholderRating={placeholderRating}
                  />
                )),
              )}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentBracket;
