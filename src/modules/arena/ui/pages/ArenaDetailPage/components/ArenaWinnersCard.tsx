import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ArenaPlayerStatistics } from 'modules/arena/domain/entities/arena-player-statistics.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import EmptyState from 'shared/components/common/EmptyState';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { createNumberFormatter } from 'shared/lib/numberFormat';

interface WinnersCardProps {
  topPlayers?: ArenaPlayerStatistics[];
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}
const resultTypes = [
  { key: 'wins', rate: 'winRate', letter: 'W', color: 'success.main' },
  { key: 'losses', rate: 'lossRate', letter: 'L', color: 'error.main' },
  { key: 'draws', rate: 'drawRate', letter: 'D', color: 'text.secondary' },
] as const;
const placeColors = ['var(--kep-gold)', 'var(--kep-silver)', 'var(--kep-bronze)'];

const Winner = ({ player, index }: { player?: ArenaPlayerStatistics; index: number }) => {
  const { t, i18n } = useTranslation();
  const formatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 1 }),
    [i18n.resolvedLanguage],
  );
  const profile = (
    <Stack
      direction="row"
      alignItems="center"
      gap={{ xs: 1, sm: 1.5 }}
      sx={{
        minWidth: 0,
        width: '100%',
        minHeight: 44,
        gridColumn: { xs: 2, sm: 'auto' },
        gridRow: { xs: 1, sm: 'auto' },
      }}
    >
      {player ? (
        <Avatar
          src={player.avatar}
          alt=""
          sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
        >
          {player.username[0]?.toUpperCase()}
        </Avatar>
      ) : (
        <Skeleton
          variant="circular"
          sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, flexShrink: 0 }}
        />
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" fontWeight={600} noWrap title={player?.username}>
          {player?.username ?? <Skeleton width="80%" />}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 20, mt: 0.5 }}>
          {player ? (
            <ChallengesRatingChip title={player.rankTitle} size="small" />
          ) : (
            <Skeleton width={30} height={20} />
          )}
        </Box>
      </Box>
    </Stack>
  );
  return (
    <Box
      role="listitem"
      aria-busy={!player || undefined}
      sx={{
        minWidth: 0,
        p: { xs: 2, sm: 'var(--kep-content-inset)' },
        display: { xs: 'grid', sm: 'block' },
        gridTemplateColumns: '32px minmax(0, 1fr) auto',
        alignItems: 'center',
        columnGap: 1.5,
        rowGap: 1,
        borderInlineStart: { xs: 0, sm: index ? '1px solid var(--kep-line)' : 0 },
        borderTop: { xs: index ? '1px solid var(--kep-line)' : 0, sm: 0 },
        background:
          index === 0
            ? 'linear-gradient(130deg, color-mix(in srgb, var(--kep-logo-sand) 5%, transparent), transparent 70%)'
            : undefined,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ display: { xs: 'contents', sm: 'flex' }, mb: { sm: 2 } }}
      >
        <Typography
          variant="metric"
          aria-label={t('arena.winnersPlace', { place: index + 1 })}
          sx={{
            gridColumn: { xs: 1, sm: 'auto' },
            gridRow: { xs: 1, sm: 'auto' },
            fontSize: { xs: 24, sm: 32 },
            color: placeColors[index],
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Typography>
        <Box
          sx={{
            textAlign: 'right',
            gridColumn: { xs: 3, sm: 'auto' },
            gridRow: { xs: 1, sm: 'auto' },
          }}
        >
          <Typography component="div" variant="label" color="text.secondary" sx={{ fontSize: 10 }}>
            {t('arena.columns.performance')}
          </Typography>
          <Typography variant="metric" sx={{ fontSize: { xs: 22, sm: 26 }, lineHeight: 1.25 }}>
            {player ? (
              formatter.format(player.performance ?? 0)
            ) : (
              <Skeleton width={70} height="1.25em" />
            )}
          </Typography>
        </Box>
      </Stack>
      {player ? (
        <UserPopover
          username={player.username}
          avatar={player.avatar}
          sx={{ width: '100%', gridColumn: { xs: 2, sm: 'auto' }, gridRow: { xs: 1, sm: 'auto' } }}
        >
          {profile}
        </UserPopover>
      ) : (
        profile
      )}
      <Stack
        direction="row"
        gap={2}
        flexWrap="wrap"
        sx={{
          gridColumn: { xs: '2 / -1', sm: 'auto' },
          gridRow: { xs: 2, sm: 'auto' },
          mt: { xs: 0, sm: 2 },
          pt: { xs: 0, sm: 1.5 },
          borderTop: { xs: 0, sm: '1px solid var(--kep-line)' },
        }}
      >
        {resultTypes.map((result) => {
          const label = t(`arena.statisticsLabels.${result.key}`);
          const value = player?.[result.key] ?? 0;
          const rate = formatter.format(player?.[result.rate] ?? 0);
          return (
            <Tooltip
              key={result.key}
              title={player ? `${label}: ${formatter.format(value)} · ${rate}%` : ''}
            >
              <Typography
                component="span"
                tabIndex={player ? 0 : undefined}
                variant="metric"
                aria-label={player ? `${label}: ${value} (${rate}%)` : undefined}
                sx={{ display: 'inline-flex', gap: 0.75, color: result.color, fontSize: 16 }}
              >
                {result.letter}{' '}
                {player ? formatter.format(value) : <Skeleton width={20} height="1.2em" />}
              </Typography>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

const ArenaWinnersCard = ({ topPlayers = [], loading, error, onRetry }: WinnersCardProps) => {
  const { t } = useTranslation();
  const players = loading ? Array.from({ length: 3 }, () => undefined) : topPlayers.slice(0, 3);
  return (
    <Paper component="section" variant="section" className="kep-arena-winners">
      <SectionHeader
        title={t('arena.winners')}
        action={<PatternArtwork kind="competitions" sx={{ width: 64 }} />}
      />
      {error ? (
        <Alert
          severity="error"
          sx={{ m: 'var(--kep-content-inset)' }}
          action={onRetry && <Button onClick={onRetry}>{t('common.retry')}</Button>}
        >
          {t('common.loadFailed')}
        </Alert>
      ) : players.length ? (
        <Box
          role="list"
          aria-label={t('arena.winners')}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {players.map((player, index) => (
            <Winner key={player?.username ?? index} player={player} index={index} />
          ))}
        </Box>
      ) : (
        <EmptyState compact kind="competitions" title={t('arena.noWinners')} />
      )}
    </Paper>
  );
};
export default ArenaWinnersCard;
