import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import { useDuelDetail, useDuelResults } from '../../application/queries.ts';

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const statusTone = (status?: number | null) => {
  if (status === -1) return { color: 'info' as const, label: 'duels.status.upcoming' };
  if (status === 0) return { color: 'success' as const, label: 'duels.status.running' };
  return { color: 'secondary' as const, label: 'duels.status.finished' };
};

const DuelDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: duel, isLoading } = useDuelDetail(id);
  const { data: results } = useDuelResults(id);
  useDocumentTitle(
    duel?.playerFirst?.username ? 'pageTitles.duel' : undefined,
    duel
      ? {
          playerFirstUsername: duel.playerFirst.username,
          playerSecondUsername: duel.playerSecond?.username ?? '',
        }
      : undefined,
  );

  const problems = useMemo(() => {
    if (!duel?.problems?.length) return [];
    return duel.problems.map((problem, index) => ({
      ...problem,
      playerFirstBall: problem.playerFirstBall ?? results?.playerFirst?.[index],
      playerSecondBall: problem.playerSecondBall ?? results?.playerSecond?.[index],
    }));
  }, [duel?.problems, results?.playerFirst, results?.playerSecond]);

  if (isLoading && !duel) {
    return (
      <Box sx={{ ...responsivePagePaddingSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!duel) {
    return (
      <Box sx={responsivePagePaddingSx}>
        <Typography variant="body2" color="text.secondary">
          {t('duels.error')}
        </Typography>
      </Box>
    );
  }

  const tone = statusTone(duel.status);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={800}>
            {t('duels.detailTitle', {
              first: duel.playerFirst.username,
              second: duel.playerSecond?.username ?? '',
            })}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={t(tone.label)} color={tone.color} variant="filled" size="small" />
            {duel.isConfirmed === false ? (
              <Chip label={t('duels.awaitingConfirmation')} color="warning" variant="outlined" size="small" />
            ) : null}
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                <UserPopover username={duel.playerFirst.username}>
                  <Typography variant="h6" fontWeight={800}>
                    {duel.playerFirst.username}
                  </Typography>
                </UserPopover>
                <Typography variant="body2" color="text.secondary">
                  vs
                </Typography>
                {duel.playerSecond ? (
                  <UserPopover username={duel.playerSecond.username}>
                    <Typography variant="h6" fontWeight={800}>
                      {duel.playerSecond.username}
                    </Typography>
                  </UserPopover>
                ) : (
                  <Chip label="BYE" size="small" />
                )}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" color="text.secondary">
                  {t('duels.starts')}: {formatDate(duel.startTime)}
                </Typography>
                {duel.finishTime ? (
                  <Typography variant="body2" color="text.secondary">
                    • {t('duels.ends')}: {formatDate(duel.finishTime)}
                  </Typography>
                ) : null}
              </Stack>

              {duel.preset ? (
                <Stack spacing={0.5}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('duels.preset')}
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {duel.preset.title}
                  </Typography>
                  {duel.preset.description ? (
                    <Typography variant="body2" color="text.secondary">
                      {duel.preset.description}
                    </Typography>
                  ) : null}
                </Stack>
              ) : null}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight={800}>
                  {t('duels.scoreboard')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.scoreboardSubtitle')}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {duel.playerFirst.balls ?? 0}
                </Typography>
                {duel.playerSecond ? (
                  <>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="h4" fontWeight={800} color="primary.main">
                      {duel.playerSecond.balls ?? 0}
                    </Typography>
                  </>
                ) : null}
              </Stack>
            </Stack>

            {problems.length ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('duels.problem')}</TableCell>
                    <TableCell align="center">{duel.playerFirst.username}</TableCell>
                    {duel.playerSecond ? (
                      <TableCell align="center">{duel.playerSecond.username}</TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {problems.map((problem) => (
                    <TableRow key={problem.symbol}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {problem.symbol}
                        </Typography>
                        {problem.problem?.title ? (
                          <Typography variant="body2" color="text.secondary">
                            {problem.problem.title}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={problem.playerFirstBall ?? 0}
                          color="success"
                          size="small"
                          variant={problem.playerFirstBall ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      {duel.playerSecond ? (
                        <TableCell align="center">
                          <Chip
                            label={problem.playerSecondBall ?? 0}
                            color="success"
                            size="small"
                            variant={problem.playerSecondBall ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('duels.noProblems')}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default DuelDetailPage;
