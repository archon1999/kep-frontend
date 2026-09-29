import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
  Button,
  ButtonBase,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { useWorldLeaderboard } from '../../../../application';

const podiumColors = ['#D99214', '#8396A9', '#B5744D'] as const;

const WorldRanking = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'week' | 'all'>('week');
  const [page, setPage] = useState(1);
  const { currentUser } = useAuth();
  const { data, error, isLoading, mutate } = useWorldLeaderboard(
    period,
    true,
    currentUser?.username,
    page,
  );
  useEffect(() => {
    if (data && data.page !== page) setPage(data.page);
  }, [data, page]);
  const players = data?.players ?? [];
  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        size="small"
        value={period}
        exclusive
        onChange={(_event, value) => {
          if (value) {
            setPeriod(value);
            setPage(1);
          }
        }}
      >
        <ToggleButton value="week">{t('keppyWorld.thisWeek')}</ToggleButton>
        <ToggleButton value="all">{t('keppyWorld.allTime')}</ToggleButton>
      </ToggleButtonGroup>
      {isLoading && <Skeleton height={150} />}
      {error && (
        <Alert
          severity="warning"
          action={<Button onClick={() => void mutate()}>{t('keppyWorld.retry')}</Button>}
        >
          {t('keppyWorld.loadError')}
        </Alert>
      )}
      {data && !error && players.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          {t('keppyWorld.emptyRanking')}
        </Typography>
      )}
      {!!players.length && !error && (
        <Table
          size="small"
          aria-label={t('keppyWorld.ranking')}
          sx={{
            tableLayout: 'fixed',
            '& td, & th': { border: 0, px: 0.75, py: 1.25 },
            '& th': { color: 'text.secondary', fontSize: 11, fontWeight: 500 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 44 }} aria-label={t('keppyWorld.rankColumn')}>
                #
              </TableCell>
              <TableCell>{t('keppyWorld.playerColumn')}</TableCell>
              <TableCell align="right" sx={{ width: 58 }}>
                <Tooltip title={t('keppyWorld.completedTasksTotal')} describeChild>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={0.5}
                    tabIndex={0}
                  >
                    <IconifyIcon icon="mdi:clipboard-check-outline" width={15} />
                    {t('keppyWorld.completedTasksColumn')}
                  </Stack>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ width: 72 }}>
                XP
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => {
              const date = formatDateTime(player.lastCompletedAt, 'compactDateTimeNoComma', '');
              const title = date ? t('keppyWorld.lastTaskCompletedAt', { date }) : '';
              return (
                <TableRow
                  key={player.username}
                  sx={{ bgcolor: player.isCurrentUser ? 'action.selected' : undefined }}
                >
                  <TableCell
                    sx={{
                      color: player.rank <= 3 ? podiumColors[player.rank - 1] : 'text.secondary',
                      fontSize: 13,
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {String(player.rank).padStart(2, '0')}
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden' }}>
                    <UserPopover
                      username={player.username}
                      avatar={player.avatar}
                      sx={{ display: 'flex', width: '100%', maxWidth: '100%', minWidth: 0 }}
                    >
                      <ButtonBase
                        sx={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          gap: 1,
                          minWidth: 0,
                          textAlign: 'left',
                          borderRadius: 1,
                          '&.Mui-focusVisible': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                          },
                        }}
                      >
                        <Avatar
                          src={player.avatar}
                          alt={player.username}
                          sx={{ width: 28, height: 28, fontSize: 12 }}
                        >
                          {player.username.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <Typography
                          noWrap
                          variant="body2"
                          sx={{
                            minWidth: 0,
                            fontSize: 13,
                            fontWeight: player.isCurrentUser ? 700 : 500,
                          }}
                        >
                          {player.username}
                        </Typography>
                      </ButtonBase>
                    </UserPopover>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 13 }}
                  >
                    {player.completedTasks.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip
                      title={title}
                      describeChild
                      arrow
                      slotProps={{ popper: { disablePortal: true } }}
                    >
                      <Typography
                        component="span"
                        tabIndex={title ? 0 : undefined}
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          fontVariantNumeric: 'tabular-nums',
                          cursor: title ? 'help' : undefined,
                        }}
                      >
                        {player.xp.toLocaleString()}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {data && data.totalPlayers > 0 && !error && (
        <Stack gap={1.25} alignItems="center">
          <Typography variant="caption" color="text.secondary" role="status">
            {t('keppyWorld.rankingRange', {
              from: (data.page - 1) * data.pageSize + 1,
              to: Math.min(data.page * data.pageSize, data.totalPlayers),
              total: data.totalPlayers,
            })}
          </Typography>
          {data.totalPages > 1 && (
            <Pagination
              page={data.page}
              count={data.totalPages}
              onChange={(_event, value) => setPage(value)}
              size="small"
              color="primary"
              siblingCount={0}
              boundaryCount={1}
            />
          )}
          {data.currentUser && !players.some((player) => player.isCurrentUser) && (
            <Button
              size="small"
              onClick={() => setPage(Math.ceil(data.currentUser!.rank / data.pageSize))}
            >
              {t('keppyWorld.yourRank', { rank: data.currentUser.rank })}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};
export default WorldRanking;
