import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Stack, Typography } from '@mui/material';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict.tsx';
import {
  formatBallsLabel,
  formatGroupLabel,
  verdictShortTitle,
} from 'shared/components/problems/attemptVerdict.utils';
import type { AttemptJudgeSummary } from '../../domain/entities/problem.entity';

interface AttemptJudgeSummaryCardProps {
  summary?: AttemptJudgeSummary;
  balls?: number | null;
}

const formatScore = (value?: number | null) => {
  if (value === undefined || value === null) return '0';
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/\.?0+$/, '');
};

const AttemptJudgeSummaryCard = ({ summary, balls }: AttemptJudgeSummaryCardProps) => {
  const { t } = useTranslation();

  const score = summary?.score ?? balls;
  const maxScore = summary?.maxScore;

  const scoreLabel = useMemo(() => {
    if (score === undefined || score === null) return undefined;
    if (maxScore === undefined || maxScore === null) {
      return formatBallsLabel(score);
    }
    return `${formatScore(score)} / ${formatScore(maxScore)} ball`;
  }, [maxScore, score]);

  if (!summary) return null;

  return (
    <Box>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={800}>
            {scoreLabel}
          </Typography>
          {summary.tests ? (
            <Typography variant="body2" color="text.secondary">
              {t('problems.attempts.modal.testsPassed', {
                passed: summary.tests.passed,
                total: summary.tests.total,
              })}
            </Typography>
          ) : null}
        </Stack>

        <Divider />
        <Stack spacing={1}>
          {summary.groups.map((group) => (
            <Box key={`group-${group.id}`}>
              <Typography fontFamily="monospace" variant="body1" fontWeight={700}>
                {formatGroupLabel(group.id)}: {formatBallsLabel(group.score ?? 0)}
              </Typography>
              <Stack spacing={0.25} sx={{ pl: 2.5, pt: 0.5 }}>
                {group.cases.map((testCase) => (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontFamily="monospace" key={`case-${group.id}-${testCase.number}`} variant="body2">
                      {t('problems.attempts.modal.caseProtocolLine', {
                        number: testCase.number,
                      })}
                    </Typography>
                    <AttemptVerdict
                      title={verdictShortTitle[testCase.verdict]}
                      verdict={testCase.verdict}
                      size="small"
                    />
                  </Stack>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default AttemptJudgeSummaryCard;
