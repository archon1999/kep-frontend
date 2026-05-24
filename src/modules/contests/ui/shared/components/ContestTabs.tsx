import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import KepIcon from 'shared/components/base/KepIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';

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
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: { xs: '100%', md: 'auto' },
        minWidth: 0,
        flex: 1,
      }}
    >
      <ResponsiveTabs
        value={activeTab}
        onChange={(value) => {
          const nextTab = visibleTabs.find((tab) => tab.key === value);
          if (nextTab) {
            navigate(nextTab.to);
          }
        }}
        items={visibleTabs.map((tab) => ({
          value: tab.key,
          label: tab.label,
          icon: <KepIcon name={tab.icon as any} fontSize={18} />,
          tabProps: {
            iconPosition: 'start',
            component: RouterLink,
            to: tab.to,
            sx: { textTransform: 'none', fontWeight: 500 },
          },
        }))}
        ariaLabel="contest tabs"
        tabsProps={{
          variant: 'scrollable',
          scrollButtons: 'auto',
          allowScrollButtonsMobile: true,
          sx: {
            width: '100%',
            minWidth: 0,
          },
        }}
        selectProps={{
          sx: {
            minHeight: { xs: 38, sm: undefined },
            '& .MuiSelect-select': {
              py: { xs: 0.8, sm: undefined },
              fontSize: { xs: '0.85rem', sm: undefined },
            },
          },
        }}
      />
    </Box>
  );
};

export default ContestTabs;
