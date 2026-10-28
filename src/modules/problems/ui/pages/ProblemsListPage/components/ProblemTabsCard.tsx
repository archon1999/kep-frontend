import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router';
import { Alert, Box, Button, Paper, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources';
import type {
  ProblemAttemptSummary,
  ProblemContestPreview,
  ProblemListItem,
} from 'modules/problems/domain/entities/problem.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';

type ProblemTabValue = 'lastContest' | 'attempts' | 'mostViewed';
type SourceState = { isLoading: boolean; error?: unknown; onRetry?: () => void };
interface TabsCardProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  attempts: SourceState & { items: ProblemAttemptSummary[] };
  lastContest: SourceState & { data?: ProblemContestPreview | null };
  mostViewed: SourceState & { items: ProblemListItem[] };
}
interface ProblemRow {
  href: string;
  key: string | number;
  symbol: string | number;
  title: string;
}

const previewRowCount = 10;
const rowHeight = 48;

const ProblemTabsCard = ({
  activeTab,
  onTabChange,
  attempts,
  lastContest,
  mostViewed,
}: TabsCardProps) => {
  const { t } = useTranslation();
  const id = useId();
  const navigate = useNavigate();
  const tab: ProblemTabValue =
    activeTab === 'attempts' || activeTab === 'mostViewed' ? activeTab : 'lastContest';
  const source = tab === 'attempts' ? attempts : tab === 'mostViewed' ? mostViewed : lastContest;
  const tabs = [
    { value: 'lastContest', label: t('problems.lastContestProblems') },
    { value: 'attempts', label: t('problems.lastAttempts') },
    { value: 'mostViewed', label: t('problems.mostViewed') },
  ];
  const rows: ProblemRow[] =
    tab === 'attempts'
      ? attempts.items.map((attempt) => ({
          href: getResourceById(resources.Problem, attempt.problemId),
          key: attempt.id,
          symbol: attempt.problemId,
          title: attempt.problemTitle,
        }))
      : tab === 'mostViewed'
        ? mostViewed.items.map((problem) => ({
            href: getResourceById(resources.Problem, problem.id),
            key: problem.id,
            symbol: problem.id,
            title: problem.title,
          }))
        : (lastContest.data?.problems ?? []).map((problem) => ({
            href: problem.symbol
              ? getResourceByParams(resources.ContestProblem, {
                  id: lastContest.data!.id,
                  symbol: problem.symbol,
                })
              : getResourceById(resources.Contest, lastContest.data!.id),
            key: problem.id,
            symbol: problem.symbol ?? '—',
            title: problem.title,
          }));
  const visibleRows = tab === 'lastContest' ? rows : rows.slice(0, previewRowCount);
  const title =
    tab === 'lastContest'
      ? lastContest.data?.title
      : tabs.find((item) => item.value === tab)?.label;
  const emptyText =
    tab === 'attempts'
      ? t('problems.noAttempts')
      : tab === 'mostViewed'
        ? t('problems.noMostViewed')
        : t('problems.noLastContest');
  const href =
    tab === 'attempts'
      ? resources.Attempts
      : lastContest.data
        ? getResourceById(resources.Contest, lastContest.data.id)
        : resources.Contests;
  const pickOne = () => {
    const problem = mostViewed.items[Math.floor(Math.random() * mostViewed.items.length)];
    if (problem) navigate(getResourceById(resources.Problem, problem.id));
  };
  return (
    <Paper component={PointerSpotlight} variant="section" className="kep-problems-quick-access">
      <Tabs
        value={tab}
        onChange={(_, value: string) => onTabChange(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        scrollButtons="auto"
        aria-label={t('problems.sidebar.explore')}
        sx={{
          px: 1,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTabs-list': { gap: 0 },
          '& .MuiTab-root': {
            minWidth: 0,
            px: 1.25,
            fontFamily: 'var(--kep-display-font)',
            fontWeight: 500,
            fontSize: 13,
            borderRadius: 0,
          },
          '& .Mui-selected': { bgcolor: 'transparent', color: 'primary.main' },
        }}
      >
        {tabs.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            label={
              <span>
                <MixedText>{item.label}</MixedText>
              </span>
            }
            id={`${id}-${item.value}`}
            aria-controls={`${id}-content`}
          />
        ))}
      </Tabs>
      <Box
        role="tabpanel"
        id={`${id}-content`}
        aria-labelledby={`${id}-${tab}`}
        aria-busy={source.isLoading}
        sx={{ px: 'var(--kep-content-inset)', py: 2.5 }}
      >
        <Typography
          component="h3"
          variant="body2"
          sx={{
            minHeight: 24,
            mb: 1.5,
            fontFamily: 'var(--kep-display-font)',
            fontSize: 17,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
          title={title}
        >
          {source.isLoading && tab === 'lastContest' ? (
            <Skeleton width="70%" height={24} />
          ) : (
            title && <MixedText>{title}</MixedText>
          )}
        </Typography>
        <Box sx={{ minHeight: previewRowCount * rowHeight }}>
          {source.isLoading ? (
            Array.from({ length: previewRowCount }, (_, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{ height: rowHeight, borderBottom: 1, borderColor: 'divider' }}
              >
                <Skeleton width={34} height={20} />
                <Skeleton width="70%" height={20} sx={{ flex: 1 }} />
                <Skeleton width={14} height={16} />
              </Stack>
            ))
          ) : source.error ? (
            <Alert
              severity="error"
              action={
                source.onRetry && <Button onClick={source.onRetry}>{t('common.retry')}</Button>
              }
            >
              {t('common.loadFailed')}
            </Alert>
          ) : visibleRows.length ? (
            visibleRows.map((row) => (
              <Box
                key={row.key}
                component={RouterLink}
                to={row.href}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '34px minmax(0, 1fr) 14px',
                  gap: 1.5,
                  alignItems: 'center',
                  minHeight: rowHeight,
                  color: 'text.primary',
                  textDecoration: 'none',
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:hover, &:focus-visible': { color: 'primary.main' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: -2,
                  },
                }}
              >
                <Typography
                  component="span"
                  variant="metric"
                  color="primary.main"
                  sx={{ fontSize: 14 }}
                >
                  {row.symbol}
                </Typography>
                <Typography variant="body2" noWrap title={row.title} sx={{ fontSize: 13 }}>
                  {row.title}
                </Typography>
                <IconifyIcon
                  icon="mdi:arrow-top-right"
                  sx={{ fontSize: 14, color: 'text.secondary' }}
                />
              </Box>
            ))
          ) : (
            <EmptyState
              compact
              kind="search"
              title={emptyText}
              sx={{
                minHeight: previewRowCount * rowHeight,
                px: 0,
                py: 2,
                '& svg': { maxHeight: 110 },
              }}
            />
          )}
        </Box>
        <Button
          {...(tab === 'mostViewed' ? { onClick: pickOne } : { component: RouterLink, to: href })}
          variant="text"
          size="small"
          disabled={source.isLoading || (tab === 'mostViewed' && !rows.length)}
          endIcon={
            <IconifyIcon icon={tab === 'mostViewed' ? 'mdi:shuffle-variant' : 'mdi:arrow-right'} />
          }
          sx={{ mt: 1.5, px: 0 }}
        >
          {t(
            tab === 'mostViewed'
              ? 'problems.pickOne'
              : tab === 'attempts'
                ? 'problems.attemptsButton'
                : 'problems.goToContest',
          )}
        </Button>
      </Box>
    </Paper>
  );
};
export default ProblemTabsCard;
