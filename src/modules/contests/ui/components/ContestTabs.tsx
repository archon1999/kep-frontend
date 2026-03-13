import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import KepIcon from 'shared/components/base/KepIcon';
import { ContestStatus } from '../../domain/entities/contest-status';

interface ContestTabsProps {
  contestId: number | string;
  status?: ContestStatus;
  isRated?: boolean;
}

const ContestTabs = ({ contestId, status, isRated }: ContestTabsProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      {
        key: 'overview',
        label: t('contests.tabs.overview'),
        icon: 'contest',
        to: getResourceById(resources.Contest, contestId),
        visible: true,
      },
      {
        key: 'registrants',
        label: t('contests.tabs.registrants'),
        icon: 'users',
        to: getResourceById(resources.ContestRegistrants, contestId),
        visible: status === ContestStatus.NotStarted,
      },
      {
        key: 'problems',
        label: t('contests.tabs.problems'),
        icon: 'problem',
        to: getResourceById(resources.ContestProblems, contestId),
        visible: status !== ContestStatus.NotStarted,
      },
      {
        key: 'attempts',
        label: t('contests.tabs.attempts'),
        icon: 'attempt',
        to: getResourceById(resources.ContestAttempts, contestId),
        visible: status !== ContestStatus.NotStarted,
      },
      {
        key: 'standings',
        label: t('contests.tabs.standings'),
        icon: 'ranking',
        to: getResourceById(resources.ContestStandings, contestId),
        visible: status !== ContestStatus.NotStarted,
      },
      {
        key: 'rating-changes',
        label: t('contests.tabs.ratingChanges'),
        icon: 'rating-changes',
        to: getResourceById(resources.ContestRatingChanges, contestId),
        visible: status === ContestStatus.Finished && isRated,
      },
      {
        key: 'statistics',
        label: t('contests.tabs.statistics'),
        icon: 'statistics',
        to: getResourceById(resources.ContestStatistics, contestId),
        visible: status !== ContestStatus.NotStarted,
      },
      {
        key: 'questions',
        label: t('contests.tabs.questions'),
        icon: 'question',
        to: getResourceById(resources.ContestQuestions, contestId),
        visible: status !== ContestStatus.NotStarted,
      },
    ],
    [contestId, isRated, status, t],
  );

  const visibleTabs = tabs.filter((tab) => tab.visible !== false);

  const activeTab = useMemo(() => {
    let matched: string | null = null;
    let matchedLength = -1;

    visibleTabs.forEach((tab) => {
      const doesMatch =
        location.pathname === tab.to ||
        Boolean(
          matchPath(
            {
              path: tab.to,
              end: false,
            },
            location.pathname,
          ),
        );
      if (doesMatch && tab.to.length > matchedLength) {
        matched = tab.key;
        matchedLength = tab.to.length;
      }
    });

    if (!matched && location.pathname.includes('/problem/')) {
      matched = 'problems';
    }

    return matched ?? visibleTabs[0]?.key;
  }, [location.pathname, visibleTabs]);

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={(_, value) => {
          const nextTab = visibleTabs.find((tab) => tab.key === value);
          if (nextTab) {
            navigate(nextTab.to);
          }
        }}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {visibleTabs.map((tab) => (
          <Tab
            key={tab.key}
            value={tab.key}
            icon={<KepIcon name={tab.icon as any} fontSize={18} />}
            iconPosition="start"
            label={tab.label}
            component={RouterLink}
            to={tab.to}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ContestTabs;
