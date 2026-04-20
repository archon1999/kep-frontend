import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources.ts';
import {
  ProblemAttemptSummary,
  ProblemListItem,
} from 'modules/problems/domain/entities/problem.entity.ts';

interface ProblemsListPageTabsCardProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  attempts: { isLoading: boolean; items: ProblemAttemptSummary[] };
  lastContest: { isLoading: boolean; data: any };
  mostViewed: { isLoading: boolean; items: ProblemListItem[] };
}

const ProblemsListPageTabsCard = ({
  activeTab,
  onTabChange,
  attempts,
  lastContest,
  mostViewed,
}: ProblemsListPageTabsCardProps) => {
  const { t } = useTranslation();

  const renderAttempts = () => {
    if (attempts.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!attempts.items.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noAttempts')}
        </Typography>
      );
    }

    return (
      <List dense>
        {attempts.items.map((attempt) => (
          <ListItemButton
            key={attempt.id}
            component={RouterLink}
            to={getResourceById(resources.Problem, attempt.problemId)}
          >
            <ListItemText primary={`${attempt.problemId}. ${attempt.problemTitle}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  const renderLastContest = () => {
    if (lastContest.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!lastContest.data) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noLastContest')}
        </Typography>
      );
    }

    return (
      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle2" fontWeight={700}>
          {lastContest.data.title}
        </Typography>
        <List dense>
          {(lastContest.data.problems ?? []).map((problem: any) => (
            <ListItemButton
              key={problem.id}
              component={RouterLink}
              to={getResourceById(resources.Problem, problem.id)}
            >
              <ListItemText primary={`${problem.symbol ? `${problem.symbol}. ` : ''}${problem.title}`} />
            </ListItemButton>
          ))}
        </List>
        <Button
          component={RouterLink}
          to={getResourceById(resources.Contest, lastContest.data.id)}
          variant="contained"
          color="primary"
          fullWidth
          size="small"
          sx={{ textTransform: 'none' }}
        >
          {t('problems.goToContest')}
        </Button>
      </Stack>
    );
  };

  const renderMostViewed = () => {
    if (mostViewed.isLoading) {
      return <Skeleton variant="rectangular" height={120} />;
    }

    if (!mostViewed.items.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('problems.noMostViewed')}
        </Typography>
      );
    }

    return (
      <List dense>
        {mostViewed.items.map((problem) => (
          <ListItemButton
            key={problem.id}
            component={RouterLink}
            to={getResourceById(resources.Problem, problem.id)}
          >
            <ListItemText primary={`${problem.id}. ${problem.title}`} />
          </ListItemButton>
        ))}
      </List>
    );
  };

  return (
    <Card variant="outlined">
      <Tabs
        value={activeTab}
        onChange={(_, value) => onTabChange(value)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="lastContest" label={t('problems.lastContestProblems')} />
        <Tab value="attempts" label={t('problems.lastAttempts')} />
        <Tab value="mostViewed" label={t('problems.mostViewed')} />
      </Tabs>
      <Divider />
      <CardContent>
        {activeTab === 'lastContest' && renderLastContest()}
        {activeTab === 'attempts' && renderAttempts()}
        {activeTab === 'mostViewed' && renderMostViewed()}
      </CardContent>
    </Card>
  );
};

export default ProblemsListPageTabsCard;
