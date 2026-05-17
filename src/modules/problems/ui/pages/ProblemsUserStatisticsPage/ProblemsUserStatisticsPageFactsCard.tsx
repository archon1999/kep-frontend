import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
import { formatMachineDateTime } from 'shared/lib/dateTime';
import { ProblemsUserStatistics } from 'modules/problems/domain/entities/problem.entity';

interface ProblemsUserStatisticsPageFactsCardProps {
  statistics: ProblemsUserStatistics | undefined;
}

const ProblemsUserStatisticsPageFactsCard = ({
  statistics,
}: ProblemsUserStatisticsPageFactsCardProps) => {
  const { t } = useTranslation();

  const items = [
    {
      key: 'firstAttempt',
      label: t('problems.statisticsPage.facts.firstAttempt'),
      icon: 'activity',
    },
    {
      key: 'firstAccepted',
      label: t('problems.statisticsPage.facts.firstAccepted'),
      icon: 'check-circle',
    },
    { key: 'lastAttempt', label: t('problems.statisticsPage.facts.lastAttempt'), icon: 'clock' },
    { key: 'lastAccepted', label: t('problems.statisticsPage.facts.lastAccepted'), icon: 'award' },
    {
      key: 'mostAttemptedProblem',
      label: t('problems.statisticsPage.facts.mostAttempted'),
      icon: 'alert',
    },
    {
      key: 'mostAttemptedForSolveProblem',
      label: t('problems.statisticsPage.facts.mostAttemptedForSolve'),
      icon: 'trending-up',
    },
  ] as const;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader title={t('problems.statisticsPage.facts.title')} />
      <CardContent>
        <Stack spacing={1.5}>
          {items.map((item) => {
            const fact = (statistics?.facts as any)?.[item.key];
            if (!fact) return null;

            return (
              <Stack
                key={item.key}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <KepIcon name={item.icon as any} fontSize={20} />
                  <Typography variant="body2">{item.label}</Typography>
                </Stack>
                <Stack direction="column" spacing={0.25} alignItems="flex-end">
                  <Typography variant="subtitle2">
                    {fact.problemTitle ?? t('problems.statisticsPage.emptyValue')}
                  </Typography>
                  {fact.datetime ? (
                    <Typography variant="caption" color="text.secondary">
                      {formatMachineDateTime(fact.datetime, 'isoDateTimeMinute')}
                    </Typography>
                  ) : null}
                  {fact.attemptsCount ? (
                    <Typography variant="caption" color="text.secondary">
                      {t('problems.statisticsPage.attemptsCount', { count: fact.attemptsCount })}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            );
          })}
          {!statistics?.facts ? (
            <Typography variant="body2" color="text.secondary">
              {t('problems.statisticsPage.noData')}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemsUserStatisticsPageFactsCard;
