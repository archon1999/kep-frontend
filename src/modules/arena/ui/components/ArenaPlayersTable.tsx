import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import UserPopover from 'modules/users/ui/components/UserPopover';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';
import { ArenaStatus } from '../../domain/entities/arena.entity.ts';
import { PageResult } from '../../domain/ports/arena.repository.ts';

interface ArenaPlayersTableProps {
  data?: PageResult<ArenaPlayer>;
  loading?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectPlayer?: (player: ArenaPlayer) => void;
  selectedUsername?: string;
  currentUsername?: string;
  status?: ArenaStatus;
}

const resultColor = (value: number) => {
  if (value === 3) return 'warning.dark';
  if (value === 2) return 'success.dark';
  if (value === 1) return 'text.secondary';
  return 'error.main';
};

const topPlayerHighlight = (rank?: number | null) => {
  if (rank === 1) {
    return {
      backgroundColor: 'rgba(255, 193, 7, 0.18)',
      hoverBackgroundColor: 'rgba(255, 193, 7, 0.26)',
      borderColor: 'rgba(255, 193, 7, 0.58)',
      rankColor: 'warning.dark',
    };
  }

  if (rank === 2) {
    return {
      backgroundColor: 'rgba(158, 158, 158, 0.16)',
      hoverBackgroundColor: 'rgba(158, 158, 158, 0.24)',
      borderColor: 'rgba(158, 158, 158, 0.48)',
      rankColor: 'text.secondary',
    };
  }

  if (rank === 3) {
    return {
      backgroundColor: 'rgba(205, 127, 50, 0.16)',
      hoverBackgroundColor: 'rgba(205, 127, 50, 0.24)',
      borderColor: 'rgba(205, 127, 50, 0.48)',
      rankColor: '#A46122',
    };
  }

  return undefined;
};

const ArenaPlayersTable = ({
  data,
  loading,
  page,
  pageSize,
  onPageChange,
  onSelectPlayer,
  selectedUsername,
  currentUsername,
  status,
}: ArenaPlayersTableProps) => {
  const { t } = useTranslation();
  const isUpcoming = status === ArenaStatus.NotStarted;
  const isOngoing = status === ArenaStatus.Already;

  const handleSelect = (player: ArenaPlayer) => {
    if (!isUpcoming && onSelectPlayer) {
      onSelectPlayer(player);
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={800}>
          {isUpcoming ? t('arena.participantsTitle') : t('arena.players')}
        </Typography>
      </Stack>

      <TableContainer background={1} component={Paper} sx={{ outline: 'none', borderRadius: 3 }}>
        <Table>
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
                <TableCell align="right">{t('arena.columns.buchholz')}</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={isUpcoming ? 2 : 5}>
                      <Box sx={{ height: 52, bgcolor: 'background.default', borderRadius: 2 }} />
                    </TableCell>
                  </TableRow>
                ))
              : data?.data?.map((player) => {
                  const isCurrentUser = player.username === currentUsername;
                  const isSelected = player.username === selectedUsername;
                  const highlight = isOngoing ? topPlayerHighlight(player.rank) : undefined;

                  return (
                    <TableRow
                      key={player.username}
                      hover={!isUpcoming}
                      onClick={() => handleSelect(player)}
                      sx={{
                        cursor: !isUpcoming && onSelectPlayer ? 'pointer' : 'default',
                        backgroundColor:
                          highlight?.backgroundColor ??
                          (isCurrentUser ? 'warning.lighter' : undefined),
                        '&:hover': highlight
                          ? {
                              backgroundColor: highlight.hoverBackgroundColor,
                            }
                          : undefined,
                        '&.MuiTableRow-hover:hover': highlight
                          ? {
                              backgroundColor: highlight.hoverBackgroundColor,
                            }
                          : undefined,
                        '& td': {
                          borderColor: isSelected ? 'warning.light' : highlight?.borderColor,
                        },
                        '& td:first-of-type': {
                          borderLeft: highlight ? '4px solid' : undefined,
                          borderLeftColor: highlight?.borderColor,
                        },
                      }}
                    >
                      {!isUpcoming && (
                        <TableCell align="center">
                          <Typography
                            fontWeight={700}
                            fontSize={20}
                            color={highlight?.rankColor ?? 'primary'}
                          >
                            {player.rank}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <UserPopover username={player.username} avatar={player.avatar}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={player.avatar} alt={player.username}>
                              {player.username[0]?.toUpperCase()}
                            </Avatar>
                            <Stack direction="column" spacing={0.25} minWidth={0}>
                              <Typography fontWeight={700} noWrap>
                                {player.username}
                              </Typography>
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <ChallengesRatingChip title={player.rankTitle} size="small" />
                                <Typography variant="caption" color="text.secondary">
                                  {player.rating}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </UserPopover>
                      </TableCell>
                      {isUpcoming ? (
                        <TableCell align="right">
                          <Typography fontFamily="monospace" fontWeight={700}>
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
                                  fontFamily="monospace"
                                  fontWeight={700}
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
                          <Typography fontFamily="monospace" fontWeight={800} color="warning.dark">
                            {player.points}
                          </Typography>
                        </TableCell>
                      ) : null}
                      {!isUpcoming ? (
                        <TableCell align="right">
                          <Typography fontFamily="monospace" fontWeight={700} color="info.dark">
                            {player.buchholzCoefficient}
                          </Typography>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {data?.pagesCount && data.pagesCount > 1 ? (
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

export default ArenaPlayersTable;
