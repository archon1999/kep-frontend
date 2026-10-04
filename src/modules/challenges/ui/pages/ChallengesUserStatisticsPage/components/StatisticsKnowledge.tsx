import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Divider,
  Grid,
  LinearProgress,
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
import { normalizeSupportedLocale } from 'app/locales/locale';
import { ChallengeQuestionTimeType, type ChallengeUserStatistics } from 'modules/challenges/domain';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { statisticsInset, statisticsPanelSx } from './statisticsStyles';

interface StatisticsKnowledgeProps {
  statistics: ChallengeUserStatistics;
}

interface KnowledgeRow {
  id: number;
  label: string;
  seen: number;
  solved: number;
}

const percent = (solved: number, seen: number) =>
  seen > 0 ? Math.min(100, Math.max(0, (solved / seen) * 100)) : 0;

const questionTypeKeys: Record<number, string> = {
  1: 'singleChoice',
  2: 'multipleChoice',
  3: 'textInput',
  4: 'conformity',
  5: 'ordering',
  6: 'classification',
  7: 'codeInput',
  8: 'problem',
};

const tableSx = {
  '& td, & th': { fontSize: 14, px: 1.25 },
  '& td': { py: 1.5 },
  '& tbody tr:last-child td': { borderBottom: 0 },
  fontVariantNumeric: 'tabular-nums',
};

const KnowledgeTable = ({
  label,
  firstColumnLabel,
  rows,
}: {
  label: string;
  firstColumnLabel: string;
  rows: KnowledgeRow[];
}) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter(
    { maximumFractionDigits: 0 },
    normalizeSupportedLocale(i18n.language),
  );

  if (!rows.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('challenges.statisticsPage.noData')}
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ borderRadius: 0 }}>
      <Table
        size="small"
        className="disable-edge-padding"
        aria-label={label}
        sx={{ ...tableSx, minWidth: 420 }}
      >
        <TableHead>
          <TableRow>
            <TableCell>{firstColumnLabel}</TableCell>
            <TableCell align="right">
              {t('challenges.statisticsPage.knowledge.questionsSeen')}
            </TableCell>
            <TableCell align="right">{t('challenges.statisticsPage.questionsSolved')}</TableCell>
            <TableCell align="right">
              {t('challenges.statisticsPage.knowledge.solveRate')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ color: 'text.primary', overflowWrap: 'anywhere' }}>
                {row.label}
              </TableCell>
              <TableCell align="right">{number.format(row.seen)}</TableCell>
              <TableCell align="right">{number.format(row.solved)}</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                {number.format(percent(row.solved, row.seen))}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const StatisticsKnowledge = ({ statistics }: StatisticsKnowledgeProps) => {
  const { t, i18n } = useTranslation();
  const number = useMemo(
    () =>
      createNumberFormatter({ maximumFractionDigits: 0 }, normalizeSupportedLocale(i18n.language)),
    [i18n.language],
  );
  const decimal = useMemo(
    () =>
      createNumberFormatter({ maximumFractionDigits: 2 }, normalizeSupportedLocale(i18n.language)),
    [i18n.language],
  );
  const results = statistics.results;
  const difficultyRows = statistics.distribution?.byDifficulty ?? [];
  const questionTypes = (statistics.distribution?.byQuestionType ?? []).map((row) => ({
    id: row.questionType,
    label: questionTypeKeys[row.questionType]
      ? t('challenges.statisticsPage.questionTypes.' + questionTypeKeys[row.questionType])
      : t('challenges.statisticsPage.unknown'),
    seen: row.seen,
    solved: row.solved,
  }));
  const chapters = [...(statistics.distribution?.byChapter ?? [])]
    .sort((first, second) => second.seen - first.seen)
    .slice(0, 10)
    .map((row) => ({
      id: row.chapterId,
      label: row.title,
      seen: row.seen,
      solved: row.solved,
    }));
  const formats = [
    {
      id: 'timeControl',
      title: t('challenges.statisticsPage.formats.timeControl'),
      rows: (statistics.formats?.byTimeControl ?? []).map((row) => ({
        id: row.timeSeconds,
        label: t('challenges.statisticsPage.formats.seconds', { count: row.timeSeconds }),
        count: row.count,
        winRate: row.winRate,
      })),
    },
    {
      id: 'timerMode',
      title: t('challenges.statisticsPage.formats.timerMode'),
      rows: (statistics.formats?.byQuestionTimeType ?? []).map((row) => ({
        id: row.questionTimeType,
        label:
          row.questionTimeType === ChallengeQuestionTimeType.TimeToOne
            ? t('challenges.statisticsPage.formats.perQuestion')
            : row.questionTimeType === ChallengeQuestionTimeType.TimeToAll
              ? t('challenges.statisticsPage.formats.wholeChallenge')
              : t('challenges.statisticsPage.unknown'),
        count: row.count,
        winRate: row.winRate,
      })),
    },
    {
      id: 'questionCount',
      title: t('challenges.statisticsPage.formats.questionCount'),
      rows: (statistics.formats?.byQuestionsCount ?? []).map((row) => ({
        id: row.questionsCount,
        label: t('challenges.statisticsPage.formats.questionsCount', { count: row.questionsCount }),
        count: row.count,
        winRate: row.winRate,
      })),
    },
  ];
  const renderFormatTable = (format: (typeof formats)[number]) => (
    <Stack key={format.id} direction="column" spacing={2} sx={{ minWidth: 0 }}>
      <Typography component="h3" variant="subtitle1">
        {format.title}
      </Typography>
      <TableContainer sx={{ borderRadius: 0 }}>
        <Table
          size="small"
          className="disable-edge-padding"
          aria-label={format.title}
          sx={{
            ...tableSx,
            '& td, & th': { fontSize: 14, px: 0.75, overflowWrap: 'normal' },
            '& th': { whiteSpace: 'nowrap' },
            '& td': { py: 1, height: 40 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40%' }}>
                {t('challenges.statisticsPage.history.format')}
              </TableCell>
              <TableCell align="right" sx={{ width: '30%' }}>
                {t('challenges.statisticsPage.challengesShort')}
              </TableCell>
              <TableCell align="right" sx={{ width: '30%' }}>
                {t('challenges.statisticsPage.winRate')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {format.rows.length ? (
              format.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: 'text.primary' }}>{row.label}</TableCell>
                  <TableCell align="right">{number.format(row.count)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {number.format(row.winRate)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>{t('challenges.statisticsPage.noData')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );

  return (
    <Grid container>
      <Grid size={{ xs: 12, lg: 5 }}>
        <Paper component="section" sx={[statisticsPanelSx, { p: statisticsInset, height: 1 }]}>
          <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
            {t('challenges.statisticsPage.knowledge.difficulty')}
          </Typography>
          {difficultyRows.length ? (
            <Stack direction="column" spacing={3}>
              {difficultyRows.map((row) => {
                const difficultyKey =
                  row.difficulty === 1
                    ? 'easy'
                    : row.difficulty === 2
                      ? 'medium'
                      : row.difficulty === 3
                        ? 'hard'
                        : null;
                const label = difficultyKey
                  ? t('challenges.statisticsPage.difficulty.' + difficultyKey)
                  : t('challenges.statisticsPage.unknown');
                const solveRate = percent(row.solved, row.seen);
                return (
                  <Stack key={row.difficulty} direction="column" spacing={1}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                        {number.format(solveRate)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={solveRate}
                      aria-label={label + ': ' + t('challenges.statisticsPage.knowledge.solveRate')}
                      sx={{ height: 4, borderRadius: 0.5, bgcolor: 'action.hover' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.statisticsPage.knowledge.solvedOf', {
                        solved: number.format(row.solved),
                        seen: number.format(row.seen),
                      })}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('challenges.statisticsPage.noData')}
            </Typography>
          )}

          <Divider sx={{ my: 4 }} />
          <Typography component="h3" variant="subtitle1" sx={{ mb: 3 }}>
            {t('challenges.statisticsPage.performance.solveSummary')}
          </Typography>
          {results ? (
            <Stack direction="column" spacing={2}>
              {[
                {
                  label: 'averageSolved',
                  value: decimal.format(results.averageSolvedPerChallenge),
                },
                { label: 'perfectChallenges', value: number.format(results.perfectChallenges) },
                { label: 'cleanSweepWins', value: number.format(results.cleanSweepWins) },
              ].map((fact) => (
                <Stack
                  key={fact.label}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('challenges.statisticsPage.' + fact.label)}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={400}
                    sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {fact.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('challenges.statisticsPage.noData')}
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <Paper component="section" sx={[statisticsPanelSx, { p: statisticsInset, height: 1 }]}>
          <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
            {t('challenges.statisticsPage.knowledge.questionTypes')}
          </Typography>
          <KnowledgeTable
            label={t('challenges.statisticsPage.knowledge.questionTypes')}
            firstColumnLabel={t('challenges.statisticsPage.knowledge.questionType')}
            rows={questionTypes}
          />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <Paper component="section" sx={[statisticsPanelSx, { p: statisticsInset, height: 1 }]}>
          <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
            {t('challenges.statisticsPage.knowledge.topChapters')}
          </Typography>
          <KnowledgeTable
            label={t('challenges.statisticsPage.knowledge.topChapters')}
            firstColumnLabel={t('challenges.chapters')}
            rows={chapters}
          />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Paper component="section" sx={[statisticsPanelSx, { p: statisticsInset, height: 1 }]}>
          <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
            {t('challenges.statisticsPage.history.format')}
          </Typography>
          <Grid container columnSpacing={3} rowSpacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>{renderFormatTable(formats[0])}</Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="column" spacing={3}>
                {formats.slice(1).map(renderFormatTable)}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StatisticsKnowledge;
