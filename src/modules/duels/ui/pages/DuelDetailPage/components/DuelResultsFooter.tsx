import { Button, Card, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import {
  Duel,
  DuelDetailPageNavigationProblem,
  DuelDetailPageWorkspaceView,
  getDuelDetailPagePlayerRows,
} from 'modules/duels/domain/index.ts';

type Props = {
  duel: Duel;
  problems: DuelDetailPageNavigationProblem[];
  activeSymbol?: string | null;
  view: DuelDetailPageWorkspaceView;
  onSelectProblem: (symbol: string) => void;
  onChangeView: (view: DuelDetailPageWorkspaceView) => void;
};

const DuelResultsFooter = ({
  duel,
  problems,
  activeSymbol,
  view,
  onSelectProblem,
  onChangeView,
}: Props) => {
  const { t } = useTranslation();
  const rows = getDuelDetailPagePlayerRows(duel);

  if (!rows.length || !problems.length) {
    return null;
  }

  return (
    <Card
      sx={{
        px: 2.5,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        bgcolor: (theme) =>
          alpha(theme.palette.background.default, theme.palette.mode === 'dark' ? 0.22 : 0.72),
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1.25}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', lg: 'center' }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={(theme) => ({
              width: 'fit-content',
              p: 0.5,
              borderRadius: 999,
              border: '1px solid',
              borderColor: theme.palette.divider,
              bgcolor: alpha(
                theme.palette.background.paper,
                theme.palette.mode === 'dark' ? 0.55 : 0.9,
              ),
            })}
          >
            <Button
              size="small"
              variant={view === 'problems' ? 'contained' : 'text'}
              color="primary"
              onClick={() => onChangeView('problems')}
              startIcon={<IconifyIcon icon="mdi:format-list-bulleted" width={16} height={16} />}
              sx={{ textTransform: 'none', borderRadius: 999 }}
            >
              {t('contests.tabs.problems')}
            </Button>
            <Button
              size="small"
              variant={view === 'standings' ? 'contained' : 'text'}
              color="primary"
              onClick={() => onChangeView('standings')}
              startIcon={<IconifyIcon icon="mdi:podium" width={16} height={16} />}
              sx={{ textTransform: 'none', borderRadius: 999 }}
            >
              {t('duels.standings')}
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {rows.map((row) => (
              <Chip
                key={`${row.key}-total`}
                label={`${row.player.username}: ${row.player.balls ?? 0}`}
                color={row.accent}
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.25 }}>
          {problems.map((problem) => {
            const isActive = activeSymbol === problem.symbol;

            return (
              <Button
                key={problem.symbol}
                onClick={() => onSelectProblem(problem.symbol)}
                variant={isActive ? 'contained' : 'outlined'}
                color={isActive ? 'primary' : 'inherit'}
                sx={{
                  minWidth: 150,
                  flexShrink: 0,
                  px: 1.5,
                  py: 1.15,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  alignItems: 'stretch',
                }}
              >
                <Stack spacing={0.4} alignItems="flex-start" sx={{ width: '100%' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Typography variant="subtitle2" fontWeight={800}>
                      {problem.symbol}
                    </Typography>
                    <Typography variant="caption" color={isActive ? 'inherit' : 'text.secondary'}>
                      {problem.ball ?? 0} pts
                    </Typography>
                  </Stack>

                  {rows.map((row) => (
                    <Typography
                      key={`${row.key}-${problem.symbol}`}
                      variant="caption"
                      color={isActive ? 'inherit' : 'text.secondary'}
                    >
                      {row.player.username}: {row.scoreAccessor(problem)}
                    </Typography>
                  ))}
                </Stack>
              </Button>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};

export default DuelResultsFooter;
