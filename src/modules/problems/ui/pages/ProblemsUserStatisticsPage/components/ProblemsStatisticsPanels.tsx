import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import type {
  ProblemsStatisticsTagStat,
  ProblemsUserStatistics,
} from 'modules/problems/domain/entities/problem.entity';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import { createNumberFormatter } from 'shared/lib/numberFormat';

interface PanelProps {
  statistics: ProblemsUserStatistics;
}

export const ProblemsLanguagesPanel = ({ statistics }: PanelProps) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter({ maximumFractionDigits: 0 }, i18n.language);
  const total = statistics.byLang.reduce((sum, row) => sum + row.solved, 0);
  return (
    <StatisticsSection title={t('problems.statisticsPage.profile.languages')}>
      <Stack
        spacing={2.5}
        tabIndex={0}
        aria-label={t('problems.statisticsPage.profile.languages')}
        sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}
      >
        {[...statistics.byLang]
          .sort((a, b) => b.solved - a.solved)
          .map((lang) => (
            <Box key={lang.lang}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{ mb: 1 }}
              >
                <Stack direction="row" alignItems="center" gap={1} minWidth={0}>
                  <AttemptLanguage lang={lang.lang} langFull={lang.langFull} size={22} />
                  <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                    {lang.langFull}
                  </Typography>
                </Stack>
                <Typography variant="metric" fontSize={20}>
                  {number.format(lang.solved)}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={total ? (lang.solved / total) * 100 : 0}
                aria-label={lang.langFull}
                sx={{ height: 4, borderRadius: 0, bgcolor: 'action.hover' }}
              />
            </Box>
          ))}
        {!statistics.byLang.length && (
          <Typography variant="body2" color="text.secondary">
            {t('problems.statisticsPage.noData')}
          </Typography>
        )}
      </Stack>
    </StatisticsSection>
  );
};

export const ProblemsDifficultyPanel = ({ statistics }: PanelProps) => {
  const { t } = useTranslation();
  return (
    <StatisticsSection
      title={t('problems.statisticsPage.difficulty.title')}
      subtitle={t('problems.statisticsPage.difficulty.overview', {
        solved: statistics.byDifficulty.totalSolved,
        total: statistics.byDifficulty.totalProblems,
      })}
    >
      <Stack spacing={2}>
        {difficultyOptions.map((option) => {
          const data = statistics.byDifficulty;
          const solved = Number(data[option.key as keyof typeof data] ?? 0);
          const total = Number(
            data[`all${option.key[0].toUpperCase()}${option.key.slice(1)}` as keyof typeof data] ??
              0,
          );
          const percent = total ? Math.min(100, Math.round((100 * solved) / total)) : 0;
          return (
            <Box key={option.key}>
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
                sx={{ mb: 0.75 }}
              >
                <Typography variant="body2">{t(option.label)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {solved} / {total} · {percent}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={percent}
                color={difficultyColorByKey[option.key]}
                aria-label={t(option.label)}
                sx={{ height: 5, borderRadius: 0, bgcolor: 'action.hover' }}
              />
            </Box>
          );
        })}
      </Stack>
    </StatisticsSection>
  );
};

export const ProblemsTagsPanel = ({ statistics }: PanelProps) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter({ maximumFractionDigits: 0 }, i18n.language);
  const groups = useMemo(() => {
    const map = new Map<
      string,
      { title: string; total: number; tags: ProblemsStatisticsTagStat[] }
    >();
    [...statistics.byTag]
      .sort((a, b) => b.value - a.value)
      .forEach((tag) => {
        const key = String(tag.categoryId ?? tag.categoryCode ?? 'other');
        const group = map.get(key) ?? {
          title: tag.categoryTitle ?? t('problems.statisticsPage.profile.tags'),
          total: 0,
          tags: [],
        };
        group.total += tag.value;
        group.tags.push(tag);
        map.set(key, group);
      });
    return [...map.entries()].sort(([, a], [, b]) => b.total - a.total);
  }, [statistics.byTag, t]);
  return (
    <StatisticsSection title={t('problems.statisticsPage.profile.byCategoryAndTags')}>
      <Box sx={{ maxHeight: 410, overflowY: 'auto' }}>
        {groups.map(([key, group]) => (
          <Accordion
            key={key}
            disableGutters
            sx={{ background: 'transparent', border: 0, borderBottom: 1, borderColor: 'divider' }}
          >
            <AccordionSummary>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
                sx={{ width: 1, minWidth: 0 }}
              >
                <Typography variant="body2" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                  {group.title}
                </Typography>
                <Typography variant="metric" fontSize={20} color="primary.main">
                  {number.format(group.total)}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                {group.tags.map((tag) => (
                  <Stack key={tag.name} direction="row" justifyContent="space-between" gap={2}>
                    <Typography variant="body2" color="text.secondary">
                      {tag.name}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {number.format(tag.value)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      {!groups.length && (
        <Typography variant="body2" color="text.secondary">
          {t('problems.statisticsPage.noData')}
        </Typography>
      )}
    </StatisticsSection>
  );
};
