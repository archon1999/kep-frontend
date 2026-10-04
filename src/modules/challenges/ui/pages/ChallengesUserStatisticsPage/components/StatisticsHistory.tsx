import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Pagination,
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
import { normalizeSupportedLocale } from 'app/locales/locale';
import { getResourceById, resources } from 'app/routes/resources';
import { coreSurfacePaperClassName } from 'app/theme/styles/surfaceTreatments';
import {
  type Challenge,
  type ChallengeRatingHistoryEntry,
  ChallengeStatus,
} from 'modules/challenges/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import { formatDateTime } from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { statisticsInset } from './statisticsStyles';

interface StatisticsHistoryProps {
  username: string;
  challenges: Challenge[];
  ratingHistory?: ChallengeRatingHistoryEntry[];
  embedded?: boolean;
  isLoading: boolean;
  error?: unknown;
  onRetry: () => void;
  page: number;
  pagesCount: number;
  onPageChange: (page: number) => void;
}

const StatisticsHistory = ({
  username,
  challenges,
  ratingHistory = [],
  embedded = false,
  isLoading,
  error,
  onRetry,
  page,
  pagesCount,
  onPageChange,
}: StatisticsHistoryProps) => {
  const { t, i18n } = useTranslation();
  const deltaFormatter = createNumberFormatter(
    { maximumFractionDigits: 1, signDisplay: 'exceptZero' },
    normalizeSupportedLocale(i18n.language),
  );
  return (
    <Box className={embedded ? undefined : coreSurfacePaperClassName} sx={{ overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ px: statisticsInset, pt: statisticsInset, pb: 3 }}
      >
        <Typography component="h2" variant="h6">
          {t('challenges.lastChallenges')}
        </Typography>
      </Stack>
      {error ? (
        <Alert
          severity="error"
          sx={{ mx: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }}
          action={
            <Button color="inherit" onClick={onRetry}>
              {t('challenges.statisticsPage.retry')}
            </Button>
          }
        >
          {t('challenges.statisticsPage.history.error')}
        </Alert>
      ) : isLoading ? (
        <Stack spacing={1} sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
          {[1, 2, 3].map((row) => (
            <Skeleton key={row} height={60} />
          ))}
        </Stack>
      ) : !challenges.length ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}
        >
          {t('challenges.noChallenges')}
        </Typography>
      ) : (
        <TableContainer sx={{ borderRadius: 0 }}>
          <Table
            size="small"
            aria-label={t('challenges.lastChallenges')}
            sx={{
              '& th, & td': { px: { xs: 1, sm: 2 } },
              '& td': { py: 1.5 },
              '& th': {
                borderRadius: 0,
                bgcolor: 'action.hover',
                fontSize: 14,
                color: 'text.secondary',
                fontWeight: 500,
              },
              '& th:first-of-type, & td:first-of-type': { pl: statisticsInset, borderRadius: 0 },
              '& th:last-child, & td:last-child': { pr: statisticsInset, borderRadius: 0 },
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t('challenges.statisticsPage.history.opponent')}</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {t('challenges.statisticsPage.history.result')}
                </TableCell>
                <TableCell align="center">{t('challenges.statisticsPage.history.score')}</TableCell>
                <TableCell align="right">
                  {t('challenges.statisticsPage.history.ratingChange')}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {t('challenges.statisticsPage.history.format')}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  {t('challenges.statisticsPage.history.date')}
                </TableCell>
                <TableCell>
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
                    {t('challenges.statisticsPage.history.view')}
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {challenges.map((challenge) => {
                const isFirst =
                  challenge.playerFirst.username.toLowerCase() === username.toLowerCase();
                const player = isFirst ? challenge.playerFirst : challenge.playerSecond;
                const opponent = isFirst ? challenge.playerSecond : challenge.playerFirst;
                const finished = Boolean(challenge.finished);
                const result = !finished
                  ? 'pending'
                  : player.result > opponent.result
                    ? 'win'
                    : player.result < opponent.result
                      ? 'loss'
                      : 'draw';
                const tone = result === 'win' ? 'success' : result === 'loss' ? 'error' : 'neutral';
                const resultLabel =
                  !finished && challenge.status === ChallengeStatus.NotStarted
                    ? t('challenges.statusNotStarted')
                    : t(`challenges.statisticsPage.history.${result}`);
                const historyEntry = ratingHistory.find(
                  (entry) => entry.challengeId === challenge.id,
                );
                return (
                  <TableRow
                    key={challenge.id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <UserPopover username={opponent.username} avatar={opponent.avatar}>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            src={opponent.avatar}
                            alt={opponent.username}
                            sx={{ width: 32, height: 32, fontSize: 12 }}
                          >
                            {opponent.username.slice(0, 1)}
                          </Avatar>
                          <Stack>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{ overflowWrap: 'anywhere' }}
                            >
                              {opponent.username}
                            </Typography>
                            <ChallengesRatingChip
                              title={opponent.rankTitle}
                              rating={Math.round(opponent.rating)}
                              sx={{ justifyContent: 'flex-start', height: 19, fontSize: 11 }}
                            />
                          </Stack>
                        </Stack>
                      </UserPopover>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Chip label={resultLabel} size="small" variant="soft" color={tone} />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={resultLabel} describeChild>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={`${tone === 'neutral' ? 'text.secondary' : `${tone}.main`}`}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          {player.result} : {opponent.result}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color={
                          challenge.rated && finished
                            ? player.delta > 0
                              ? 'success.main'
                              : player.delta < 0
                                ? 'error.main'
                                : 'text.secondary'
                            : 'text.secondary'
                        }
                      >
                        {challenge.rated && finished ? deltaFormatter.format(player.delta) : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', md: 'table-cell' },
                        color: 'text.secondary',
                      }}
                    >
                      <Stack spacing={0.25}>
                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap', fontSize: 14 }}>
                          {t('challenges.questionsCount', { count: challenge.questionsCount })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 14 }}>
                          {t('challenges.statisticsPage.formats.seconds', {
                            count: challenge.timeSeconds,
                          })}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', lg: 'table-cell' },
                        whiteSpace: 'nowrap',
                        color: 'text.secondary',
                        fontSize: 12,
                      }}
                    >
                      {historyEntry?.finishedAt
                        ? formatDateTime(historyEntry.finishedAt, 'compactDateNoComma')
                        : challenge.finished || '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('challenges.statisticsPage.history.view')}>
                        <IconButton
                          component={RouterLink}
                          to={getResourceById(resources.Challenge, challenge.id)}
                          size="small"
                          aria-label={t('challenges.statisticsPage.history.view')}
                        >
                          <IconifyIcon
                            icon="material-symbols:arrow-outward-rounded"
                            sx={{ fontSize: 18 }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {pagesCount > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 3,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Pagination
            color="primary"
            shape="rounded"
            page={page}
            count={pagesCount}
            onChange={(_, value) => onPageChange(value)}
            size="small"
            siblingCount={0}
          />
        </Box>
      )}
    </Box>
  );
};

export default StatisticsHistory;
