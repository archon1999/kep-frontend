import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources.ts';
import {
  ProblemAttemptSummary,
  ProblemListItem,
} from 'modules/problems/domain/entities/problem.entity.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import { cssVarRgba } from 'shared/lib/utils';

type ProblemTabValue = 'lastContest' | 'attempts' | 'mostViewed';

interface TabsCardProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  attempts: { isLoading: boolean; items: ProblemAttemptSummary[] };
  lastContest: { isLoading: boolean; data: any };
  mostViewed: { isLoading: boolean; items: ProblemListItem[] };
}

interface TabConfig {
  icon: string;
  label: string;
  value: ProblemTabValue;
}

interface ProblemRow {
  href: string;
  key: string | number;
  symbol?: string | number;
  title: string;
}

const getActiveTab = (activeTab: string): ProblemTabValue => {
  if (activeTab === 'attempts' || activeTab === 'mostViewed') return activeTab;
  return 'lastContest';
};

const EmptyState = ({ children }: { children: ReactNode }) => (
  <Box
    sx={(theme) => ({
      borderRadius: 2,
      border: '1px dashed',
      borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.2),
      p: 2,
    })}
  >
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </Box>
);

const LoadingState = () => (
  <Stack spacing={1.25}>
    {Array.from({ length: 4 }).map((_, index) => (
      <Stack key={index} direction="row" spacing={1} alignItems="center">
        <Skeleton variant="text" width={34} />
        <Skeleton variant="text" width="72%" />
      </Stack>
    ))}
  </Stack>
);

const ProblemLinkRow = ({ index, row }: { index: number; row: ProblemRow }) => {
  const symbol = row.symbol ?? index + 1;

  return (
    <Box
      component={RouterLink}
      to={row.href}
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
        py: 0.75,
        color: 'text.primary',
        textDecoration: 'none',
        borderBottom: '1px solid',
        borderBottomColor: cssVarRgba(theme.vars.palette.grey['500Channel'], 0.12),
        '&:hover': {
          color: 'primary.main',
        },
      })}
    >
      <Typography
        variant="caption"
        color="primary.main"
        fontWeight={900}
        sx={{ width: 34, flexShrink: 0 }}
      >
        {symbol}
      </Typography>
      <Typography variant="body2" fontWeight={700} noWrap>
        {row.title}
      </Typography>
    </Box>
  );
};

const RowsList = ({ rows }: { rows: ProblemRow[] }) => (
  <Stack spacing={0.5}>
    {rows.map((row, index) => (
      <ProblemLinkRow key={row.key} index={index} row={row} />
    ))}
  </Stack>
);

const TabsNav = ({
  activeTab,
  onTabChange,
  tabs,
}: {
  activeTab: ProblemTabValue;
  onTabChange: (value: string) => void;
  tabs: TabConfig[];
}) => (
  <ResponsiveTabs
    value={activeTab}
    onChange={onTabChange}
    items={tabs.map((tab) => ({
      value: tab.value,
      label: tab.label,
      icon: <IconifyIcon icon={tab.icon} />,
      tabProps: {
        iconPosition: 'start',
      },
    }))}
    ariaLabel="problem summary tabs"
    containerSx={{ flex: 1, minWidth: 0 }}
    tabsProps={{
      orientation: 'vertical',
      variant: 'scrollable',
      scrollButtons: false,
      sx: {
        '& .MuiTabs-list': {
          gap: 1,
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
        '& .MuiTab-root': {
          justifyContent: 'flex-start',
          minHeight: 42,
          borderRadius: 1.5,
          fontWeight: 800,
          textTransform: 'none',
        },
        '& .Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText !important',
        },
      },
    }}
  />
);

const ProblemTabsCard = ({
  activeTab,
  onTabChange,
  attempts,
  lastContest,
  mostViewed,
}: TabsCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const resolvedTab = getActiveTab(activeTab);

  const tabs = useMemo<TabConfig[]>(
    () => [
      {
        icon: 'mdi:trophy-outline',
        label: t('problems.lastContestProblems'),
        value: 'lastContest',
      },
      {
        icon: 'mdi:history',
        label: t('problems.lastAttempts'),
        value: 'attempts',
      },
      {
        icon: 'mdi:eye-outline',
        label: t('problems.mostViewed'),
        value: 'mostViewed',
      },
    ],
    [t],
  );

  const renderAttempts = () => {
    if (attempts.isLoading) return <LoadingState />;

    if (!attempts.items.length) {
      return <EmptyState>{t('problems.noAttempts')}</EmptyState>;
    }

    const rows = attempts.items.map((attempt) => ({
      href: getResourceById(resources.Problem, attempt.problemId),
      key: attempt.id,
      symbol: attempt.problemId,
      title: attempt.problemTitle,
    }));

    return (
      <Stack spacing={1.5}>
        <RowsList rows={rows} />

        <Button
          component={RouterLink}
          to={resources.Attempts}
          variant="text"
          color="primary"
          size="small"
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
          sx={{ alignSelf: 'flex-start', px: 0, textTransform: 'none' }}
        >
          {t('problems.attemptsButton')}
        </Button>
      </Stack>
    );
  };

  const renderLastContest = () => {
    if (lastContest.isLoading) return <LoadingState />;

    if (!lastContest.data) {
      return <EmptyState>{t('problems.noLastContest')}</EmptyState>;
    }

    const rows = (lastContest.data.problems ?? []).map((problem: any) => ({
      href: getResourceByParams(resources.ContestProblem, {
        id: lastContest.data.id,
        symbol: problem.symbol,
      }),
      key: problem.id,
      symbol: problem.symbol,
      title: problem.title,
    }));

    return (
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" fontWeight={900} noWrap>
          {lastContest.data.title}
        </Typography>

        <RowsList rows={rows} />

        <Button
          component={RouterLink}
          to={getResourceById(resources.Contest, lastContest.data.id)}
          variant="text"
          color="primary"
          size="small"
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
          sx={{ alignSelf: 'flex-start', px: 0, textTransform: 'none' }}
        >
          {t('problems.goToContest')}
        </Button>
      </Stack>
    );
  };

  const renderMostViewed = () => {
    if (mostViewed.isLoading) return <LoadingState />;

    if (!mostViewed.items.length) {
      return <EmptyState>{t('problems.noMostViewed')}</EmptyState>;
    }

    const rows = mostViewed.items.map((problem) => ({
      href: getResourceById(resources.Problem, problem.id),
      key: problem.id,
      symbol: problem.id,
      title: problem.title,
    }));

    const handlePickOne = () => {
      const problem = mostViewed.items[Math.floor(Math.random() * mostViewed.items.length)];
      if (problem) {
        navigate(getResourceById(resources.Problem, problem.id));
      }
    };

    return (
      <Stack spacing={1.5}>
        <RowsList rows={rows} />

        <Button
          onClick={handlePickOne}
          variant="text"
          color="primary"
          size="small"
          endIcon={<IconifyIcon icon="mdi:shuffle-variant" />}
          sx={{ alignSelf: 'flex-start', px: 0, textTransform: 'none' }}
        >
          {t('problems.pickOne')}
        </Button>
      </Stack>
    );
  };

  const renderContent = () => {
    if (resolvedTab === 'attempts') return renderAttempts();
    if (resolvedTab === 'mostViewed') return renderMostViewed();
    return renderLastContest();
  };

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.09)}, ${theme.vars.palette.background.paper} 48%)`,
        borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14),
      })}
    >
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems="stretch">
          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <TabsNav activeTab={resolvedTab} onTabChange={onTabChange} tabs={tabs} />
          </Stack>
          <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>{renderContent()}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProblemTabsCard;
