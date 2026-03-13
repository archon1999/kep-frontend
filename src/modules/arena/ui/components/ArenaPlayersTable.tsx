import {
  Avatar,
  Box,
  Chip,
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
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { useTranslation } from 'react-i18next';
import { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';
import { PageResult } from '../../domain/ports/arena.repository.ts';
import { ArenaStatus } from '../../domain/entities/arena.entity.ts';

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

  const handleSelect = (player: ArenaPlayer) => {
    if (onSelectPlayer) {
      onSelectPlayer(player);
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={800}>
          {t('arena.players')}
        </Typography>
        {data?.total ? (
          <Chip size="small" color="warning" label={`${data.total} ${t('arena.participants')}`} />
        ) : null}
      </Stack>

      <TableContainer background={1} component={Paper} sx={{ outline: 'none', borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={60}>#</TableCell>
              <TableCell>{t('arena.columns.user')}</TableCell>
              <TableCell align="right">{t('arena.columns.results')}</TableCell>
              <TableCell align="center">{t('arena.columns.points')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={4}>
                      <Box sx={{ height: 48, bgcolor: 'background.default', borderRadius: 2 }} />
                    </TableCell>
                  </TableRow>
                ))
              : data?.data?.map((player) => (
                  <TableRow
                    key={player.username}
                    hover
                    onClick={() => handleSelect(player)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor:
                        player.username === selectedUsername
                          ? 'action.hover'
                          : player.username === currentUsername
                            ? 'warning.lighter'
                            : undefined,
                    }}
                  >
                    <TableCell>{player.rowIndex}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar>{player.username[0]?.toUpperCase()}</Avatar>
                        <Stack direction="column" spacing={0.25}>
                          <Typography fontWeight={700}>{player.username}</Typography>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <ChallengesRatingChip title={player.rankTitle} size="small" />
                            <Typography variant="caption" color="text.secondary">
                              {player.rating}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap">
                        {player.results.map((result, idx) => (
                          <Box
                            key={`${player.username}-result-${idx}`}
                            sx={{
                              minWidth: 28,
                              height: 24,
                              borderRadius: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 700,
                              color:
                                result === 3
                                  ? 'warning.darker'
                                  : result === 2
                                    ? 'success.darker'
                                    : result === 1
                                      ? 'text.secondary'
                                      : 'error.dark',
                              bgcolor:
                                result === 3
                                  ? 'warning.lighter'
                                  : result === 2
                                    ? 'success.lighter'
                                    : result === 1
                                      ? 'background.neutral'
                                      : 'error.lighter',
                              border: '1px solid',
                              borderColor:
                                result === 1 ? 'divider' : result === 3 ? 'warning.light' : result === 2 ? 'success.light' : 'error.light',
                            }}
                          >
                            {result}
                          </Box>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        color="warning"
                        size="small"
                        variant="filled"
                        label={player.points}
                        icon={
                          player.streak && status === ArenaStatus.Already ? (
                            <IconifyIcon icon="mdi:fire" color="error.main" fontSize={16} />
                          ) : undefined
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
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
