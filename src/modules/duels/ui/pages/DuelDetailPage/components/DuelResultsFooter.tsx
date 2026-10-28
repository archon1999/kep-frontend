import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  IconButton,
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
import {
  Duel,
  DuelDetailPageNavigationProblem,
  getDuelDetailPagePlayerRows,
} from 'modules/duels/domain';
import DuelParticipant from 'modules/duels/ui/shared/components/DuelParticipant';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type Props = {
  duel: Duel;
  problems: DuelDetailPageNavigationProblem[];
  activeSymbol?: string | null;
  onSelectProblem: (symbol: string) => void;
};
const DuelResultsFooter = ({ duel, problems, activeSymbol, onSelectProblem }: Props) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(true);
  const rows = getDuelDetailPagePlayerRows(duel);
  const first = duel.playerFirst.balls ?? 0,
    second = duel.playerSecond?.balls ?? 0;
  const color = (order: number) =>
    !duel.playerSecond || first === second
      ? 'text.primary'
      : (order === 0) === first > second
        ? 'success.main'
        : 'error.main';
  if (!rows.length || !problems.length) return null;
  return (
    <Box
      component="section"
      className="kep-duel-results"
      aria-label={t('duels.standings')}
      sx={{
        borderTop: '1px solid var(--kep-line)',
        bgcolor: 'background.default',
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        sx={{ minHeight: 48, px: { xs: 1.5, md: 2.5 } }}
      >
        <Stack
          direction="row"
          gap={0.75}
          alignItems="center"
          sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}
        >
          <IconifyIcon icon="mdi:podium" sx={{ fontSize: 18 }} />
          <Typography variant="label">{t('duels.standings')}</Typography>
        </Stack>
        <Stack
          direction="row"
          gap={{ xs: 1.5, sm: 3 }}
          alignItems="center"
          justifyContent="center"
          sx={{ flex: 1, minWidth: 0 }}
        >
          {rows.map((row) => (
            <Stack
              key={row.key}
              direction="row"
              gap={1.25}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <DuelParticipant player={row.player} compact />
              <Typography variant="metric" color={color(row.order)} sx={{ fontSize: 22 }}>
                {row.player.balls ?? 0}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Tooltip title={t(collapsed ? 'duels.expandStandings' : 'duels.collapseStandings')}>
          <IconButton
            size="small"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={t(collapsed ? 'duels.expandStandings' : 'duels.collapseStandings')}
            aria-expanded={!collapsed}
          >
            <IconifyIcon icon={collapsed ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
          </IconButton>
        </Tooltip>
      </Stack>
      {!collapsed && (
        <TableContainer sx={{ overflowX: 'auto', maxHeight: 180 }}>
          <Table
            size="small"
            stickyHeader
            aria-label={t('duels.standings')}
            sx={{ minWidth: Math.max(480, 190 + problems.length * 64) }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 140 }}>{t('duels.table.username')}</TableCell>
                <TableCell align="center" sx={{ width: 72 }}>
                  {t('duels.points')}
                </TableCell>
                {problems.map((problem) => (
                  <TableCell
                    key={problem.symbol}
                    align="center"
                    sx={{
                      p: 0.5,
                      bgcolor: problem.symbol === activeSymbol ? 'action.selected' : undefined,
                    }}
                  >
                    <Button
                      size="small"
                      aria-pressed={problem.symbol === activeSymbol}
                      onClick={() => onSelectProblem(problem.symbol)}
                      disabled={Boolean(problem.isLocked && !problem.unlockAt)}
                      sx={{ minWidth: 32, fontFamily: 'var(--kep-display-font)', borderRadius: 0 }}
                    >
                      {problem.symbol}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key} hover>
                  <TableCell>
                    <DuelParticipant player={row.player} compact />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="metric" color={color(row.order)} sx={{ fontSize: 19 }}>
                      {row.player.balls ?? 0}
                    </Typography>
                  </TableCell>
                  {problems.map((problem) => (
                    <TableCell
                      key={problem.symbol}
                      align="center"
                      sx={{
                        bgcolor: problem.symbol === activeSymbol ? 'action.selected' : undefined,
                      }}
                    >
                      <Typography
                        variant="metric"
                        color={row.scoreAccessor(problem) > 0 ? 'success.main' : 'text.disabled'}
                        sx={{ fontSize: 16 }}
                      >
                        {row.scoreAccessor(problem) > 0 ? row.scoreAccessor(problem) : '—'}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
export default DuelResultsFooter;
