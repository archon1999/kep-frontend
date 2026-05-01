import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import type {
  TournamentDetailEntity,
  TournamentPlayerProfile,
  TournamentStageInfo,
  TournamentStageMatch,
} from 'modules/tournaments/domain';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';

interface TournamentBracketProps {
  tournament: TournamentDetailEntity;
}

type SupportedBracketSize = 16 | 32;
type PlaceholderKind = 'opponent' | 'winner';
type RoundKey = 'roundOf32' | 'roundOf16' | 'quarter' | 'semifinal' | 'final';

type BracketSlot = {
  player: TournamentPlayerProfile | null;
  placeholder: PlaceholderKind | null;
};

type BracketMatch = {
  id: string;
  roundIndex: number;
  matchIndex: number;
  duel?: TournamentStageMatch;
  first: BracketSlot;
  second: BracketSlot;
  winnerId: number | null;
  isFinished: boolean;
  isFinal: boolean;
};

type PositionedMatch = BracketMatch & {
  top: number;
  left: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

type BracketMetrics = {
  matchWidth: number;
  matchHeight: number;
  columnGap: number;
  rowGap: number;
  headerHeight: number;
  trailingSpace: number;
  cardPadding: number;
  cardHeaderHeight: number;
  cardSectionGap: number;
  playerRowHeight: number;
  playerRowsGap: number;
  connectorOffset: number;
};

type BracketRound = {
  key: RoundKey;
  matchCount: number;
};

type BracketMetricInput = Omit<BracketMetrics, 'matchHeight' | 'connectorOffset'>;

const createMetrics = (input: BracketMetricInput): BracketMetrics => {
  const matchHeight =
    input.cardPadding * 2 +
    input.cardHeaderHeight +
    input.cardSectionGap +
    input.playerRowHeight * 2 +
    input.playerRowsGap;

  const connectorOffset =
    input.cardPadding +
    input.cardHeaderHeight +
    input.cardSectionGap +
    input.playerRowHeight +
    input.playerRowsGap / 2;

  return {
    ...input,
    matchHeight,
    connectorOffset,
  };
};

const DESKTOP_METRICS = createMetrics({
  matchWidth: 268,
  columnGap: 72,
  rowGap: 20,
  headerHeight: 48,
  trailingSpace: 32,
  cardPadding: 12,
  cardHeaderHeight: 32,
  cardSectionGap: 10,
  playerRowHeight: 56,
  playerRowsGap: 8,
});

const MOBILE_METRICS = createMetrics({
  matchWidth: 224,
  columnGap: 40,
  rowGap: 16,
  headerHeight: 44,
  trailingSpace: 24,
  cardPadding: 10,
  cardHeaderHeight: 30,
  cardSectionGap: 8,
  playerRowHeight: 52,
  playerRowsGap: 8,
});

const DESKTOP_METRICS_16 = createMetrics({
  matchWidth: 268,
  columnGap: 96,
  rowGap: 20,
  headerHeight: 48,
  trailingSpace: 48,
  cardPadding: 12,
  cardHeaderHeight: 32,
  cardSectionGap: 10,
  playerRowHeight: 56,
  playerRowsGap: 8,
});

const MOBILE_METRICS_16 = createMetrics({
  matchWidth: 224,
  columnGap: 48,
  rowGap: 16,
  headerHeight: 44,
  trailingSpace: 28,
  cardPadding: 10,
  cardHeaderHeight: 30,
  cardSectionGap: 8,
  playerRowHeight: 52,
  playerRowsGap: 8,
});

const getBracketMetrics = (size: SupportedBracketSize | null, isMobile: boolean) => {
  if (size === 16) {
    return isMobile ? MOBILE_METRICS_16 : DESKTOP_METRICS_16;
  }

  return isMobile ? MOBILE_METRICS : DESKTOP_METRICS;
};

const getSupportedBracketSize = (tournament: TournamentDetailEntity): SupportedBracketSize | null => {
  const stageCapacity = (tournament.stages ?? [])
    .map((stage) => (stage.duels?.length ?? 0) * 2)
    .find((capacity) => capacity === 16 || capacity === 32);

  if (stageCapacity === 16 || stageCapacity === 32) {
    return stageCapacity;
  }

  const playersCount = tournament.players.length;
  if (playersCount > 0 && playersCount <= 16) return 16;
  if (playersCount > 16 && playersCount <= 32) return 32;

  return null;
};

const getRounds = (size: SupportedBracketSize): BracketRound[] =>
  size === 32
    ? [
        { key: 'roundOf32', matchCount: 16 },
        { key: 'roundOf16', matchCount: 8 },
        { key: 'quarter', matchCount: 4 },
        { key: 'semifinal', matchCount: 2 },
        { key: 'final', matchCount: 1 },
      ]
    : [
        { key: 'roundOf16', matchCount: 8 },
        { key: 'quarter', matchCount: 4 },
        { key: 'semifinal', matchCount: 2 },
        { key: 'final', matchCount: 1 },
      ];

const buildSeedPairs = (size: SupportedBracketSize) => {
  let seeds = [1];

  while (seeds.length < size) {
    const currentLength = seeds.length;
    const nextSeeds: number[] = [];

    seeds.forEach((seed) => {
      nextSeeds.push(seed, currentLength * 2 + 1 - seed);
    });

    seeds = nextSeeds;
  }

  const pairs: Array<[number, number]> = [];
  for (let index = 0; index < seeds.length; index += 2) {
    pairs.push([seeds[index], seeds[index + 1]]);
  }

  return pairs;
};

const getWinnerId = (duel?: TournamentStageMatch['duel']) => {
  if (!duel || duel.status !== 1) return null;
  if (duel.playerFirst?.status === 1) return duel.playerFirst.id;
  if (duel.playerSecond?.status === 1) return duel.playerSecond.id;
  return null;
};

const normalizeDuelsOrder = (duels: TournamentStageMatch[] | undefined, expectedCount: number) => {
  const ordered: Array<TournamentStageMatch | undefined> = Array(expectedCount).fill(undefined);
  if (!duels?.length) return ordered;

  const sortedDuels = [...duels].sort((first, second) => (first.number ?? 0) - (second.number ?? 0));
  let cursor = 0;

  sortedDuels.forEach((duel, index) => {
    const requestedIndex = duel.number != null ? duel.number - 1 : index;
    let targetIndex = requestedIndex;

    if (targetIndex < 0 || targetIndex >= expectedCount || ordered[targetIndex]) {
      while (cursor < expectedCount && ordered[cursor]) {
        cursor += 1;
      }
      targetIndex = cursor;
    }

    if (targetIndex < expectedCount) {
      ordered[targetIndex] = duel;
    }
  });

  return ordered;
};

const normalizeStages = (stages?: TournamentStageInfo[]) =>
  [...(stages ?? [])]
    .sort((first, second) => first.number - second.number)
    .reduce((accumulator, stage) => {
      accumulator.set(stage.number, {
        ...stage,
        duels: [...(stage.duels ?? [])].sort((first, second) => (first.number ?? 0) - (second.number ?? 0)),
      });
      return accumulator;
    }, new Map<number, TournamentStageInfo>());

const resolveSeedSlot = (
  players: TournamentPlayerProfile[],
  seedNumber: number,
  duelPlayer?: TournamentPlayerProfile,
): BracketSlot => {
  if (duelPlayer) {
    return { player: duelPlayer, placeholder: null };
  }

  const player = players[seedNumber - 1] ?? null;
  return {
    player,
    placeholder: player ? null : 'opponent',
  };
};

const getAdvancingPlayer = (match?: BracketMatch) => {
  if (!match) return null;
  if (match.winnerId && match.first.player?.id === match.winnerId) return match.first.player;
  if (match.winnerId && match.second.player?.id === match.winnerId) return match.second.player;
  if (match.first.player && !match.second.player) return match.first.player;
  if (match.second.player && !match.first.player) return match.second.player;
  return null;
};

const resolveRoundSlot = (
  duelPlayer: TournamentPlayerProfile | undefined,
  sourceMatch: BracketMatch | undefined,
): BracketSlot => {
  if (duelPlayer) {
    return { player: duelPlayer, placeholder: null };
  }

  const advancingPlayer = getAdvancingPlayer(sourceMatch);
  if (advancingPlayer) {
    return { player: advancingPlayer, placeholder: null };
  }

  return { player: null, placeholder: 'winner' };
};

const buildBracketRounds = (tournament: TournamentDetailEntity, size: SupportedBracketSize): BracketMatch[][] => {
  const rounds = getRounds(size);
  const seedPairs = buildSeedPairs(size);
  const stageMap = normalizeStages(tournament.stages);
  const bracketRounds: BracketMatch[][] = [];

  rounds.forEach((round, roundIndex) => {
    const stage = stageMap.get(roundIndex + 1);
    const orderedDuels = normalizeDuelsOrder(stage?.duels, round.matchCount);
    const currentRound: BracketMatch[] = [];

    for (let matchIndex = 0; matchIndex < round.matchCount; matchIndex += 1) {
      const duel = orderedDuels[matchIndex];
      const duelEntity = duel?.duel;
      let first: BracketSlot;
      let second: BracketSlot;

      if (roundIndex === 0) {
        const pair = seedPairs[matchIndex];
        first = resolveSeedSlot(tournament.players, pair[0], duelEntity?.playerFirst);
        second = resolveSeedSlot(tournament.players, pair[1], duelEntity?.playerSecond);
      } else {
        const previousRound = bracketRounds[roundIndex - 1];
        first = resolveRoundSlot(duelEntity?.playerFirst, previousRound[matchIndex * 2]);
        second = resolveRoundSlot(duelEntity?.playerSecond, previousRound[matchIndex * 2 + 1]);
      }

      currentRound.push({
        id: `${roundIndex}-${matchIndex}`,
        roundIndex,
        matchIndex,
        duel,
        first,
        second,
        winnerId: getWinnerId(duelEntity),
        isFinished: (duelEntity?.status ?? 0) === 1,
        isFinal: roundIndex === rounds.length - 1,
      });
    }

    bracketRounds.push(currentRound);
  });

  return bracketRounds;
};

const positionRounds = (rounds: BracketMatch[][], metrics: BracketMetrics) => {
  if (!rounds.length) {
    return {
      rounds: [] as PositionedMatch[][],
      width: 0,
      height: 0,
      columnLeft: [] as number[],
    };
  }

  const columnLeft = rounds.map((_, index) => index * (metrics.matchWidth + metrics.columnGap));
  const centers: number[][] = [];

  centers[0] = rounds[0].map(
    (_, matchIndex) =>
      metrics.headerHeight + metrics.connectorOffset + matchIndex * (metrics.matchHeight + metrics.rowGap),
  );

  for (let roundIndex = 1; roundIndex < rounds.length; roundIndex += 1) {
    centers[roundIndex] = rounds[roundIndex].map((_, matchIndex) => {
      const previousCenters = centers[roundIndex - 1];
      const top = previousCenters[matchIndex * 2];
      const bottom = previousCenters[matchIndex * 2 + 1];
      return (top + bottom) / 2;
    });
  }

  const positionedRounds = rounds.map((round, roundIndex) =>
    round.map((match, matchIndex) => {
      const centerY = centers[roundIndex][matchIndex];
      const left = columnLeft[roundIndex];

      return {
        ...match,
        top: centerY - metrics.connectorOffset,
        left,
        centerX: left + metrics.matchWidth / 2,
        centerY,
        width: metrics.matchWidth,
        height: metrics.matchHeight,
      };
    }),
  );

  const height =
    (centers[0][centers[0].length - 1] ?? 0) + (metrics.matchHeight - metrics.connectorOffset) + metrics.rowGap;
  const width = columnLeft[columnLeft.length - 1] + metrics.matchWidth + metrics.trailingSpace;

  return {
    rounds: positionedRounds,
    width,
    height,
    columnLeft,
  };
};

const PlayerRow = ({
  slot,
  isWinner,
  rowHeight,
}: {
  slot: BracketSlot;
  isWinner: boolean;
  rowHeight: number;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const title =
    slot.player?.username ??
    (slot.placeholder === 'winner' ? t('tournaments.awaitingWinner') : t('tournaments.awaitingOpponent'));

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      sx={{
        height: rowHeight,
        boxSizing: 'border-box',
        px: 1.5,
        py: 1,
        borderRadius: 1.75,
        border: '1px solid',
        borderStyle: slot.player ? 'solid' : 'dashed',
        borderColor: isWinner ? alpha(theme.palette.primary.main, 0.42) : alpha(theme.palette.divider, 0.85),
        bgcolor: isWinner
          ? alpha(theme.palette.primary.main, 0.12)
          : slot.player
            ? alpha(theme.palette.background.default, 0.52)
            : alpha(theme.palette.background.default, 0.28),
        color: isWinner ? 'text.primary' : slot.player ? 'text.primary' : 'text.secondary',
        transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
      }}
    >
      <Stack direction="column" spacing={0.2} sx={{ minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          fontWeight={slot.player ? 700 : 600}
          noWrap
          title={title}
          sx={{ letterSpacing: slot.player ? 0 : 0.1 }}
        >
          {title}
        </Typography>
        {slot.player ? (
          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ minWidth: 0 }}>
            <ContestsRatingChip title={slot.player.ratingTitle} imgSize={16} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {slot.player.ratingTitle}
            </Typography>
          </Stack>
        ) : null}
      </Stack>

      {typeof slot.player?.balls === 'number' ? (
        <Box
          sx={{
            minWidth: 32,
            px: 1,
            py: 0.35,
            borderRadius: 99,
            textAlign: 'center',
            bgcolor: isWinner ? 'primary.main' : alpha(theme.palette.text.primary, 0.08),
            color: isWinner ? 'primary.contrastText' : 'text.secondary',
          }}
        >
          <Typography variant="subtitle2" fontWeight={800}>
            {slot.player.balls}
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
};

const BracketMatchCard = ({
  match,
  metrics,
}: {
  match: PositionedMatch;
  metrics: BracketMetrics;
}) => {
  const theme = useTheme();
  const firstIsWinner = match.winnerId != null && match.first.player?.id === match.winnerId;
  const secondIsWinner = match.winnerId != null && match.second.player?.id === match.winnerId;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: match.top,
        left: match.left,
        width: match.width,
        height: match.height,
        p: `${metrics.cardPadding}px`,
        borderRadius: 3,
        border: '1px solid',
        borderColor: match.isFinal ? alpha(theme.palette.primary.main, 0.42) : alpha(theme.palette.divider, 0.9),
        bgcolor: alpha(theme.palette.background.paper, 0.94),
        boxShadow: match.isFinal ? theme.shadows[6] : theme.shadows[2],
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: `${metrics.cardSectionGap}px`,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ minHeight: metrics.cardHeaderHeight, boxSizing: 'border-box' }}
      >
        <Typography variant="caption" fontWeight={800} color="text.secondary">
          {match.matchIndex + 1}-duel
        </Typography>
      </Stack>

      <Stack direction="column" sx={{ gap: `${metrics.playerRowsGap}px` }}>
        <PlayerRow slot={match.first} isWinner={firstIsWinner} rowHeight={metrics.playerRowHeight} />
        <PlayerRow slot={match.second} isWinner={secondIsWinner} rowHeight={metrics.playerRowHeight} />
      </Stack>
    </Box>
  );
};

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const bracketSize = useMemo(() => getSupportedBracketSize(tournament), [tournament]);
  const metrics = useMemo(() => getBracketMetrics(bracketSize, isMobile), [bracketSize, isMobile]);

  const rounds = useMemo(
    () => (bracketSize ? buildBracketRounds(tournament, bracketSize) : []),
    [bracketSize, tournament],
  );

  const layout = useMemo(() => positionRounds(rounds, metrics), [metrics, rounds]);

  const roundTitles = useMemo(
    () =>
      bracketSize
        ? getRounds(bracketSize).map((round) => t(`tournaments.round.${round.key}`))
        : [],
    [bracketSize, t],
  );

  const connectors = useMemo(() => {
    const lines: { fromX: number; fromY: number; toX: number; toY: number }[] = [];

    for (let roundIndex = 0; roundIndex < layout.rounds.length - 1; roundIndex += 1) {
      const currentRound = layout.rounds[roundIndex];
      const nextRound = layout.rounds[roundIndex + 1];

      currentRound.forEach((match) => {
        const target = nextRound[Math.floor(match.matchIndex / 2)];
        if (!target) return;

        lines.push({
          fromX: match.left + match.width,
          fromY: match.centerY,
          toX: target.left,
          toY: target.centerY,
        });
      });
    }

    return lines;
  }, [layout.rounds]);

  return (
    <Card background={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent>
        <Stack direction="column" spacing={3}>
          <Stack direction="column" spacing={0.75}>
            <Typography variant="h6" fontWeight={800}>
              {t('tournaments.bracketTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680 }}>
              {bracketSize
                ? t('tournaments.bracketSubtitle', { count: bracketSize })
                : t('tournaments.unsupportedHint')}
            </Typography>
          </Stack>

          <Divider />

          {!bracketSize ? (
            <Box
              sx={{
                borderRadius: 3,
                border: '1px dashed',
                borderColor: alpha(theme.palette.divider, 0.9),
                bgcolor: alpha(theme.palette.background.default, 0.34),
                px: { xs: 2.5, md: 4 },
                py: { xs: 4, md: 5 },
                textAlign: 'center',
              }}
            >
              <Stack direction="column" spacing={1} alignItems="center">
                <Typography variant="subtitle1" fontWeight={800}>
                  {t('tournaments.unsupportedMessage')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                  {t('tournaments.unsupportedHint')}
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflowX: 'auto',
                overflowY: 'hidden',
                px: { xs: 0.5, md: 1 },
                pb: 2,
                scrollbarWidth: 'thin',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  minWidth: layout.width,
                  minHeight: layout.height,
                  borderRadius: 3,
                  background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
                    theme.palette.background.default,
                    0.08,
                  )} 100%)`,
                }}
              >
                <Box
                  component="svg"
                  viewBox={`0 0 ${layout.width} ${layout.height}`}
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
                        stroke={alpha(theme.palette.primary.main, 0.2)}
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </Box>

                {layout.rounds.map((_, roundIndex) => (
                  <Box
                    key={`title-${roundIndex}`}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: layout.columnLeft[roundIndex],
                      width: metrics.matchWidth,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.65,
                        borderRadius: 99,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.16),
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        color="text.secondary"
                        sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                      >
                        {roundTitles[roundIndex]}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                {layout.rounds.map((round) =>
                  round.map((match) => <BracketMatchCard key={match.id} match={match} metrics={metrics} />),
                )}
              </Box>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TournamentBracket;
