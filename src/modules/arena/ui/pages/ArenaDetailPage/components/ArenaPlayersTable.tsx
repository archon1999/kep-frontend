import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useArenaPlayerStatistics } from 'modules/arena/application/queries.ts';
import { PageResult } from 'modules/arena/domain/contracts/arena.repository.ts';
import { ArenaPlayer } from 'modules/arena/domain/entities/arena-player.entity.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { mergePinnedRows } from 'shared/lib/pinnedRows';
import ArenaPlayerStatisticsDialog from '../dialogs/ArenaPlayerStatisticsDialog.tsx';

interface PlayersTableProps {
  arenaId?: string | number;
  data?: PageResult<ArenaPlayer>;
  loading?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  currentUsername?: string;
  status?: ArenaStatus;
}

const resultColor = (value: number) => {
  if (value === 3) return 'warning.dark';
  if (value === 2) return 'success.dark';
  if (value === 1) return 'text.secondary';
  return 'error.main';
};

const rankColor = (rank?: number | null) => {
  if (rank === 1) return 'var(--kep-gold)';
  if (rank === 2) return 'var(--kep-silver)';
  if (rank === 3) return 'var(--kep-bronze)';
  return 'text.secondary';
};

const ArenaPlayersTable = ({
  arenaId,
  data,
  loading,
  page,
  pageSize,
  onPageChange,
  currentUsername,
  status,
}: PlayersTableProps) => {
  const { t } = useTranslation();
  const [selectedUsername, setSelectedUsername] = useState<string>();
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const isUpcoming = status === ArenaStatus.NotStarted;
  const { data: playerStatistics, isLoading: isStatisticsLoading } = useArenaPlayerStatistics(
    arenaId,
    selectedUsername,
  );
  const rows = mergePinnedRows(data?.data ?? [], data?.pinnedRows, (player) => player.username);

  const handleSelect = (player: ArenaPlayer) => {
    if (isUpcoming) return;

    setSelectedUsername(player.username);
    setIsStatsModalOpen(true);
  };

  return (
    <Paper component="section" variant="section" className="kep-arena-standings">
      <SectionHeader
        title={isUpcoming ? t('arena.participantsTitle') : t('arena.players')}
        action={<PatternArtwork kind="activity" sx={{ width: 64 }} />}
      />
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table
          size="small"
          aria-label={isUpcoming ? t('arena.participantsTitle') : t('arena.players')}
          sx={{
            minWidth: isUpcoming ? 360 : 680,
            '& th': { whiteSpace: 'nowrap' },
            '& td, & th': { px: { xs: 2, md: 2.5 } },
          }}
        >
          <TableHead>
            <TableRow>
              {!isUpcoming ? <TableCell width={72}>{t('arena.columns.rank')}</TableCell> : null}
              <TableCell>{t('arena.columns.user')}</TableCell>
              {isUpcoming ? <TableCell align="right">{t('arena.columns.rating')}</TableCell> : null}
              {!isUpcoming ? (
                <TableCell align="right">{t('arena.columns.results')}</TableCell>
              ) : null}
              {!isUpcoming ? (
                <TableCell align="right">{t('arena.columns.points')}</TableCell>
              ) : null}
              {!isUpcoming ? (
                <TableCell align="right">
                  <Tooltip arrow title={t('arena.columns.performanceDescription')}>
                    <Box
                      component="span"
                      sx={{
                        borderBottom: '1px dotted',
                        borderColor: 'text.secondary',
                        cursor: 'help',
                      }}
                    >
                      {t('arena.columns.performance')}
                    </Box>
                  </Tooltip>
                </TableCell>
              ) : null}
              {!isUpcoming && (
                <TableCell sx={{ width: 52 }}>
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                      clipPath: 'inset(50%)',
                    }}
                  >
                    {t('arena.playerStatistics')}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, idx) => (
                  <TableRow key={idx} sx={{ height: 76 }}>
                    {!isUpcoming && (
                      <TableCell>
                        <Skeleton width={24} />
                      </TableCell>
                    )}
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton width={110} />
                          <Skeleton width={75} height={18} />
                        </Box>
                      </Stack>
                    </TableCell>
                    {Array.from({ length: isUpcoming ? 1 : 4 }, (_, index) => (
                      <TableCell align="right" key={index}>
                        <Skeleton width={index === 0 ? 72 : 40} sx={{ ml: 'auto' }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((player) => {
                  const isCurrentUser = player.username === currentUsername;
                  const isSelected = player.username === selectedUsername;

                  return (
                    <TableRow
                      key={player.username}
                      hover={!isUpcoming}
                      onClick={() => handleSelect(player)}
                      tabIndex={isUpcoming ? undefined : 0}
                      onKeyDown={(event) => {
                        if (
                          event.target === event.currentTarget &&
                          (event.key === 'Enter' || event.key === ' ')
                        ) {
                          event.preventDefault();
                          handleSelect(player);
                        }
                      }}
                      sx={{
                        height: 76,
                        cursor: !isUpcoming ? 'pointer' : 'default',
                        backgroundColor: isCurrentUser ? 'action.selected' : 'transparent',
                        '&.MuiTableRow-hover:hover': { backgroundColor: 'action.hover' },
                        '& td': { borderColor: isSelected ? 'primary.main' : 'divider' },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: -2,
                        },
                      }}
                    >
                      {!isUpcoming && (
                        <TableCell align="center">
                          <Typography
                            fontWeight={600}
                            fontSize={20}
                            variant="metric"
                            color={rankColor(player.rank)}
                          >
                            {player.rank ? String(player.rank).padStart(2, '0') : '—'}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <UserPopover username={player.username} avatar={player.avatar}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={player.avatar} alt="" sx={{ width: 32, height: 32 }}>
                              {player.username[0]?.toUpperCase()}
                            </Avatar>
                            <Stack direction="column" spacing={0.25} minWidth={0}>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {player.username}
                              </Typography>
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <ChallengesRatingChip title={player.rankTitle} size="small" />
                                <Typography
                                  variant="metric"
                                  color="text.secondary"
                                  sx={{ fontSize: 12 }}
                                >
                                  {player.rating}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </UserPopover>
                      </TableCell>
                      {isUpcoming ? (
                        <TableCell align="right">
                          <Typography variant="metric" sx={{ fontSize: 18 }}>
                            {player.rating}
                          </Typography>
                        </TableCell>
                      ) : null}
                      {!isUpcoming ? (
                        <TableCell align="right">
                          {player.results.length ? (
                            <Stack
                              direction="row"
                              spacing={0.75}
                              justifyContent="flex-end"
                              flexWrap="wrap"
                            >
                              {player.results.map((result, idx) => (
                                <Typography
                                  key={`${player.username}-result-${idx}`}
                                  variant="metric"
                                  sx={{ fontSize: 14 }}
                                  fontWeight={600}
                                  color={resultColor(result)}
                                >
                                  {result}
                                </Typography>
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      ) : null}
                      {!isUpcoming ? (
                        <TableCell align="right">
                          <Typography
                            variant="metric"
                            sx={{ fontSize: 20 }}
                            fontWeight={600}
                            color="primary.main"
                          >
                            {player.points}
                          </Typography>
                        </TableCell>
                      ) : null}
                      {!isUpcoming ? (
                        <TableCell align="right">
                          <Tooltip
                            arrow
                            title={t('arena.columns.averageOpponentRating', {
                              rating: player.averageOpponentRating.toFixed(1),
                            })}
                          >
                            <Typography
                              component="span"
                              variant="metric"
                              sx={{ fontSize: 16 }}
                              fontWeight={600}
                              color="text.primary"
                            >
                              {player.performance?.toFixed(1) ?? '—'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      ) : null}
                      {!isUpcoming && (
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            aria-label={`${t('arena.playerStatistics')}: ${player.username}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleSelect(player);
                            }}
                          >
                            <IconifyIcon icon="mdi:chart-box-outline" fontSize={18} />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            {!loading && !rows.length && (
              <TableRow>
                <TableCell colSpan={isUpcoming ? 2 : 6}>
                  <EmptyState compact kind="battles" title={t('arena.noParticipants')} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ListPagination count={data?.pagesCount ?? 0} page={page} onChange={onPageChange} />

      <ArenaPlayerStatisticsDialog
        open={isStatsModalOpen}
        onClose={() => {
          setIsStatsModalOpen(false);
          setSelectedUsername(undefined);
        }}
        statistics={playerStatistics}
        loading={isStatisticsLoading}
        username={selectedUsername}
      />
    </Paper>
  );
};

export default ArenaPlayersTable;
