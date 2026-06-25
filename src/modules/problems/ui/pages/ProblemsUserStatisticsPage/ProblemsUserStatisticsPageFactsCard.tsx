import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { ProblemsUserStatistics } from 'modules/problems/domain/entities/problem.entity';
import KepIcon from 'shared/components/base/KepIcon';
import { formatMachineDateTime } from 'shared/lib/dateTime';

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
      icon: 'attempt',
      fallbackIcon: 'mdi:target',
    },
    {
      key: 'firstAccepted',
      label: t('problems.statisticsPage.facts.firstAccepted'),
      icon: 'solved',
      fallbackIcon: 'mdi:check-circle-outline',
    },
    {
      key: 'lastAttempt',
      label: t('problems.statisticsPage.facts.lastAttempt'),
      icon: 'attempt',
      fallbackIcon: 'mdi:history',
    },
    {
      key: 'lastAccepted',
      label: t('problems.statisticsPage.facts.lastAccepted'),
      icon: 'check',
      fallbackIcon: 'mdi:trophy-outline',
    },
    {
      key: 'mostAttemptedProblem',
      label: t('problems.statisticsPage.facts.mostAttempted'),
      icon: 'attempts',
      fallbackIcon: 'mdi:repeat-variant',
    },
    {
      key: 'mostAttemptedForSolveProblem',
      label: t('problems.statisticsPage.facts.mostAttemptedForSolve'),
      icon: 'ranking',
      fallbackIcon: 'mdi:chart-line-variant',
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
                  <KepIcon name={item.icon as any} fallbackIcon={item.fallbackIcon} fontSize={20} />
                  <Typography variant="body2">{item.label}</Typography>
                </Stack>
                <Stack direction="column" spacing={0.25} alignItems="flex-end">
                  {fact.problemId ? (
                    <Link
                      component={RouterLink}
                      to={getResourceById(resources.Problem, fact.problemId)}
                      variant="subtitle2"
                      underline="hover"
                      color="text.primary"
                      sx={{ fontWeight: 700, textAlign: 'right' }}
                    >
                      {fact.problemTitle ?? t('problems.statisticsPage.emptyValue')}
                    </Link>
                  ) : (
                    <Typography variant="subtitle2" textAlign="right">
                      {fact.problemTitle ?? t('problems.statisticsPage.emptyValue')}
                    </Typography>
                  )}
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
