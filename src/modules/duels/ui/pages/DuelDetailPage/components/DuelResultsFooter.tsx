import {
  Button,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import {
  Duel,
  DuelDetailPageNavigationProblem,
  getDuelDetailPagePlayerRows,
} from 'modules/duels/domain/index.ts';

type Props = {
  duel: Duel;
  problems: DuelDetailPageNavigationProblem[];
  activeSymbol?: string | null;
  onSelectProblem: (symbol: string) => void;
};

const DuelResultsFooter = ({
  duel,
  problems,
  activeSymbol,
  onSelectProblem,
}: Props) => {
  const rows = getDuelDetailPagePlayerRows(duel);
  const firstTotal = duel.playerFirst.balls ?? 0;
  const secondTotal = duel.playerSecond?.balls ?? 0;
  const getTotalColor = (order: number): 'default' | 'success' | 'error' => {
    if (!duel.playerSecond || firstTotal === secondTotal) return 'default';
    const isFirstLeading = firstTotal > secondTotal;
    return (order === 0) === isFirstLeading ? 'success' : 'error';
  };

  if (!rows.length || !problems.length) {
    return null;
  }

  return (
    <Card
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        bgcolor: (theme) =>
          alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.28 : 0.82),
      }}
    >
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table
          size="small"
          aria-label="Duel live standings"
          sx={{ minWidth: Math.max(720, 310 + problems.length * 104) }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 190, py: 1.1 }}>
                <IconifyIcon icon="mdi:account-outline" width={21} height={21} />
              </TableCell>
              <TableCell align="center" sx={{ width: 110, py: 1.1 }}>
                <IconifyIcon icon="mdi:chart-bar" width={21} height={21} />
              </TableCell>
              {problems.map((problem) => {
                const isActive = problem.symbol === activeSymbol;

                return (
                  <TableCell
                    key={problem.symbol}
                    align="center"
                    sx={(theme) => ({
                      width: 104,
                      py: 0.4,
                      bgcolor: isActive
                        ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.06)
                        : 'transparent',
                    })}
                  >
                    <Button
                      size="small"
                      color={isActive ? 'primary' : 'inherit'}
                      variant="text"
                      onClick={() => onSelectProblem(problem.symbol)}
                      disabled={Boolean(problem.isLocked && !problem.unlockAt)}
                      startIcon={
                        problem.isLocked ? (
                          <IconifyIcon icon="mdi:lock-outline" width={16} height={16} />
                        ) : undefined
                      }
                      sx={{ minWidth: 40, fontWeight: 800, fontSize: '0.95rem' }}
                    >
                      {problem.symbol}
                    </Button>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key} hover>
                <TableCell sx={{ py: 1.15 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    {row.player.ratingTitle ? (
                      <ContestsRatingChip title={row.player.ratingTitle} imgSize={28} />
                    ) : null}
                    <Typography fontWeight={800} noWrap>
                      {row.player.username}
                    </Typography>
                    {row.player.isBot ? (
                      <Chip size="small" color="secondary" variant="outlined" label="BOT" />
                    ) : null}
                  </Stack>
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={row.player.balls ?? 0}
                    color={getTotalColor(row.order)}
                    size="small"
                    sx={{ minWidth: 58, fontWeight: 800 }}
                  />
                </TableCell>

                {problems.map((problem) => {
                  const score = row.scoreAccessor(problem);
                  const isActive = problem.symbol === activeSymbol;

                  return (
                    <TableCell
                      key={`${row.key}-${problem.symbol}`}
                      align="center"
                      sx={(theme) => ({
                        bgcolor: isActive
                          ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.06)
                          : 'transparent',
                      })}
                    >
                      {score > 0 ? (
                        <Chip
                          label={score}
                          color="success"
                          size="small"
                          sx={{ minWidth: 54, fontWeight: 800 }}
                        />
                      ) : (
                        <Typography color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default DuelResultsFooter;
