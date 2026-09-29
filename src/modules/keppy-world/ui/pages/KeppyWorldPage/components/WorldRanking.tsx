import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
  Button,
  ButtonBase,
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

const WorldRanking = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'week' | 'all'>('week');
  const { currentUser } = useAuth();
  const { data, error, isLoading, mutate } = useWorldLeaderboard(
    period,
    true,
    currentUser?.username,
  );
  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        size="small"
        value={period}
        exclusive
        onChange={(_event, value) => value && setPeriod(value)}
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
      {data?.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          {t('keppyWorld.emptyRanking')}
        </Typography>
      )}
      {!!data?.length && (
        <Table
          size="small"
          aria-label={t('keppyWorld.ranking')}
          sx={{
            tableLayout: 'fixed',
            '& td, & th': { border: 0, px: 0.5, py: 1.25 },
            '& th': { color: 'text.secondary', fontSize: 11, fontWeight: 500 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 24 }} aria-label={t('keppyWorld.rankColumn')}>
                #
              </TableCell>
              <TableCell>{t('keppyWorld.playerColumn')}</TableCell>
              <TableCell align="right" sx={{ width: 64 }}>
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
              <TableCell align="right" sx={{ width: 82 }}>
                XP
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((player) => {
              const date = formatDateTime(player.lastCompletedAt, 'compactDateTimeNoComma', '');
              const title = date ? t('keppyWorld.lastTaskCompletedAt', { date }) : '';
              return (
                <TableRow
                  key={player.username}
                  sx={{ bgcolor: player.isCurrentUser ? 'action.selected' : undefined }}
                >
                  <TableCell
                    sx={{
                      color: player.rank === 1 ? 'warning.main' : 'text.secondary',
                      fontSize: 13,
                    }}
                  >
                    {player.rank}
                  </TableCell>
                  <TableCell>
                    <UserPopover
                      username={player.username}
                      avatar={player.avatar}
                      sx={{ minWidth: 0 }}
                    >
                      <ButtonBase
                        sx={{ width: '100%', justifyContent: 'flex-start', gap: 1, minWidth: 0 }}
                      >
                        <Avatar src={player.avatar} sx={{ width: 28, height: 28, fontSize: 12 }}>
                          {player.username.slice(0, 1)}
                        </Avatar>
                        <Typography noWrap variant="body2" sx={{ fontSize: 13 }}>
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
    </Stack>
  );
};
export default WorldRanking;
