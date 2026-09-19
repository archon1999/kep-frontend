import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import type { ContestProblemEntity } from 'modules/contests/domain/entities/contest-problem.entity';
import type { ReplayRow } from 'modules/contests/domain/entities/contest-replay.types';
import type { ContestTypeInfo } from 'modules/contests/domain/entities/contest.entity';
import ContestantProblemResultCell from 'modules/contests/ui/shared/components/ContestantProblemResultCell';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import { formatContestPoints, isAcmStyle } from 'modules/contests/ui/shared/utils/contestType';

interface Props {
  rows: ReplayRow[];
  problems: string[];
  problemDetails: ContestProblemEntity[];
  contestType: string;
  typeInfo?: ContestTypeInfo | null;
  showPenalties: boolean;
  animate: boolean;
}

interface RowProps extends Omit<Props, 'rows' | 'animate'> {
  row: ReplayRow;
  index: number;
  rowHeight: number;
  visibleCount: number;
  exiting: boolean;
  motion: boolean;
  compact: boolean;
  columns: string;
  muted: boolean;
}

const AnimatedRow = memo(
  ({
    row,
    index,
    rowHeight,
    visibleCount,
    exiting,
    motion,
    compact,
    columns,
    muted,
    problems,
    problemDetails,
    contestType,
    typeInfo,
    showPenalties,
  }: RowProps) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<Animation | null>(null);
    const lastY = useRef<number | null>(null);
    const [direction, setDirection] = useState(0);

    useLayoutEffect(() => {
      const element = elementRef.current;
      if (!element) return;
      const target = index * rowHeight;
      const previous = lastY.current;
      // React StrictMode can replay effects when keyed rows are moved. Preserve
      // the active animation when that replay has the same target position.
      if (motion && previous === target) return;
      const from =
        animationRef.current?.playState === 'running'
          ? getComputedStyle(element).transform
          : `translate3d(0, ${previous ?? (visibleCount + 1) * rowHeight}px, 0)`;
      animationRef.current?.cancel();
      lastY.current = target;
      if (!motion || previous === target) {
        setDirection(0);
        return;
      }
      setDirection(previous === null || target < previous ? 1 : -1);
      // Explicit keyframes keep a row moving from its current visual position even
      // when another score arrives before its previous movement has finished.
      animationRef.current = element.animate(
        [
          { transform: from, opacity: previous === null ? 0 : 1 },
          { transform: `translate3d(0, ${target}px, 0)`, opacity: exiting ? 0 : 1 },
        ],
        { duration: 750, easing: 'cubic-bezier(0.22, 0.8, 0.25, 1)' },
      );
    }, [index, rowHeight, motion, exiting, visibleCount]);

    useEffect(() => {
      if (!direction) return;
      const timeout = window.setTimeout(() => setDirection(0), 900);
      return () => window.clearTimeout(timeout);
    }, [direction, index]);
    useEffect(() => {
      const element = elementRef.current;
      return () => {
        if (!element?.isConnected) animationRef.current?.cancel();
      };
    }, []);

    return (
      <Box
        ref={elementRef}
        role="row"
        aria-hidden={exiting || undefined}
        data-replay-row={row.id}
        data-replay-direction={direction}
        sx={(theme) => ({
          position: 'absolute',
          left: 0,
          right: 0,
          height: rowHeight,
          transform: `translate3d(0, ${index * rowHeight}px, 0)`,
          opacity: exiting ? 0 : 1,
          zIndex: direction > 0 ? 3 : direction < 0 ? 2 : 1,
          willChange: motion ? 'transform' : undefined,
          bgcolor: muted ? '#f7f7f7' : 'background.paper',
          ...(muted && theme.applyStyles('dark', { bgcolor: '#111418' })),
          borderBottom: index === visibleCount - 1 ? 0 : 1,
          borderColor: 'dividerLight',
          borderLeft: '3px solid',
          borderLeftColor:
            direction > 0 ? 'success.main' : direction < 0 ? 'error.main' : 'transparent',
          boxShadow: direction > 0 ? 3 : 0,
          display: 'grid',
          gridTemplateColumns: columns,
          alignItems: 'center',
          '& > [role="cell"]': { px: compact ? 0.5 : 1.5, minWidth: 0 },
          '& .MuiTypography-body2, & .MuiTypography-subtitle2': {
            fontSize: compact ? '0.7rem' : undefined,
          },
          '& .MuiTypography-caption': { fontSize: compact ? '0.65rem' : undefined },
        })}
      >
        <Stack role="cell" direction="row" alignItems="center" gap={0.25}>
          <Typography variant="body2" fontWeight={700}>
            {row.rank}
          </Typography>
          {direction !== 0 && (
            <Typography
              aria-hidden
              variant="caption"
              color={direction > 0 ? 'success.main' : 'error.main'}
            >
              {direction > 0 ? '↑' : '↓'}
            </Typography>
          )}
        </Stack>
        <Box role="cell">
          <ContestantView
            contestant={row.participant}
            imgSize={compact ? 22 : 28}
            showCountry
            showFullName={!compact}
            disablePopover
          />
        </Box>
        <Stack
          role="cell"
          direction="row"
          spacing={0.5}
          alignItems="center"
          key={`score-${row.points}-${row.penalties}`}
          sx={{
            animation: motion ? 'replayScore 850ms ease-out' : 'none',
            '@keyframes replayScore': {
              from: { bgcolor: 'action.selected' },
              to: { bgcolor: 'transparent' },
            },
          }}
        >
          <Typography variant="body2" fontWeight={800} color="primary.main">
            {formatContestPoints(row.points)}
          </Typography>
          {showPenalties && (
            <Typography variant="caption" color="error.main">
              ({row.penalties})
            </Typography>
          )}
        </Stack>
        {problems.map((symbol) => {
          const result = row.problems.find((problem) => problem.symbol === symbol);
          const info = result
            ? {
                problemSymbol: symbol,
                points: result.points,
                penalties: result.penalties,
                attemptsCount: result.attempts,
                firstAcceptedTime: result.firstAcceptedTime ?? null,
                contestTime: result.contestTime,
                theBest: result.theBest,
              }
            : null;
          return (
            <Box role="cell" key={symbol} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                key={`${result?.points}-${result?.attempts}-${result?.solved}`}
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  animation: motion && result ? 'replayCell 900ms ease-out' : 'none',
                  '@keyframes replayCell': {
                    from: { bgcolor: 'action.selected' },
                    to: { bgcolor: 'transparent' },
                  },
                }}
              >
                <ContestantProblemResultCell
                  contestType={contestType}
                  typeInfo={typeInfo}
                  info={info}
                  problem={problemDetails.find((problem) => problem.symbol === symbol)}
                  rowType="official"
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  },
);

const ReplayStandings = memo(
  ({ rows, problems, problemDetails, contestType, typeInfo, showPenalties, animate }: Props) => {
    const { t } = useTranslation();
    const compact = useMediaQuery('(max-width:600px)');
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const mutedRowIds = useMemo(() => {
      const muted = new Set<number>();
      let lastPoints: string | null = null;
      let groupIndex = -1;
      rows.forEach((row, index) => {
        const points = formatContestPoints(row.points);
        if (points !== lastPoints) {
          groupIndex += 1;
          lastPoints = points;
        }
        if ((isAcmStyle(contestType) ? groupIndex : index) % 2 === 1) muted.add(row.id);
      });
      return muted;
    }, [contestType, rows]);
    const [leaving, setLeaving] = useState<ReplayRow[]>([]);
    const [previous, setPrevious] = useState(rows);
    if (previous !== rows) {
      setPrevious(rows);
      setLeaving(animate ? previous.filter((old) => !rows.some((row) => row.id === old.id)) : []);
    }
    useEffect(() => {
      if (!leaving.length) return;
      const timeout = window.setTimeout(() => setLeaving([]), 800);
      return () => window.clearTimeout(timeout);
    }, [leaving]);
    const rowHeight = compact ? 42 : 72;
    const columns = compact
      ? `42px minmax(128px, 1.2fr) 70px repeat(${Math.max(1, problems.length)}, 56px)`
      : `70px minmax(200px, 1.2fr) minmax(110px, 0.8fr) repeat(${Math.max(1, problems.length)}, minmax(90px, 0.8fr))`;
    return (
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          role="table"
          aria-label={t('contests.replay.title')}
          sx={{ minWidth: (compact ? 245 : 390) + problems.length * (compact ? 56 : 90) }}
        >
          <Box
            role="row"
            sx={{
              display: 'grid',
              gridTemplateColumns: columns,
              alignItems: 'center',
              minHeight: compact ? 38 : 56,
              bgcolor: 'background.elevation1',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              pl: '3px',
              '& > [role="columnheader"]': { px: compact ? 0.5 : 1.5 },
            }}
          >
            {[
              t('contests.standings.place'),
              t('contests.standings.contestant'),
              t('contests.standings.points'),
            ].map((label) => (
              <Typography
                role="columnheader"
                key={label}
                variant="subtitle2"
                fontWeight={500}
                sx={{ fontSize: compact ? '0.75rem' : undefined }}
              >
                {label}
              </Typography>
            ))}
            {problems.map((symbol) => (
              <Tooltip
                key={symbol}
                title={
                  problemDetails.find((problem) => problem.symbol === symbol)?.problem.title ??
                  symbol
                }
              >
                <Typography
                  role="columnheader"
                  textAlign="center"
                  variant="subtitle2"
                  fontWeight={700}
                >
                  {symbol}
                </Typography>
              </Tooltip>
            ))}
          </Box>
          <Box sx={{ height: rows.length * rowHeight, position: 'relative', overflow: 'hidden' }}>
            {[...rows, ...leaving.filter((old) => !rows.some((row) => row.id === old.id))].map(
              (row, index) => (
                <AnimatedRow
                  key={row.id}
                  row={row}
                  index={index}
                  rowHeight={rowHeight}
                  visibleCount={rows.length}
                  exiting={index >= rows.length}
                  motion={animate && !reducedMotion}
                  compact={compact}
                  columns={columns}
                  muted={mutedRowIds.has(row.id)}
                  problems={problems}
                  problemDetails={problemDetails}
                  contestType={contestType}
                  typeInfo={typeInfo}
                  showPenalties={showPenalties}
                />
              ),
            )}
          </Box>
        </Box>
      </Box>
    );
  },
);

export default ReplayStandings;
