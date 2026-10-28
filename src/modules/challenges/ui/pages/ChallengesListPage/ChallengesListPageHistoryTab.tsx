import { useTranslation } from 'react-i18next';
import { Button, FormControlLabel, Skeleton, Stack, Switch, Typography } from '@mui/material';
import { Challenge } from 'modules/challenges/domain';
import { PageResult } from 'modules/challenges/domain/contracts/challenges.repository.ts';
import ChallengeCard from 'modules/challenges/ui/shared/components/ChallengeCard.tsx';
import EmptyState from 'shared/components/common/EmptyState';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';

type ChallengesListPageHistoryTabProps = {
  challengesPage?: PageResult<Challenge>;
  isLoading: boolean;
  error?: unknown;
  onRetry: () => void;
  page: number;
  onPageChange: (page: number) => void;
  showOnlyMine: boolean;
  onToggleOnlyMine: (checked: boolean) => void;
  isAuthenticated: boolean;
  currentUsername?: string;
};

const ChallengesListPageHistoryTab = ({
  challengesPage,
  isLoading,
  error,
  onRetry,
  page,
  onPageChange,
  showOnlyMine,
  onToggleOnlyMine,
  isAuthenticated,
  currentUsername,
}: ChallengesListPageHistoryTabProps) => {
  const { t } = useTranslation();
  const challenges = challengesPage?.data ?? [];
  const showSkeleton = isLoading && !challenges.length;

  return (
    <Stack spacing={2} direction="column">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Typography component="h2" variant="h6">
          {t('challenges.recent')}
        </Typography>
        {isAuthenticated ? (
          <FormControlLabel
            label={t('challenges.onlyMe')}
            labelPlacement="start"
            sx={{ m: 0, gap: 1, '& .MuiFormControlLabel-label': { fontSize: 14 } }}
            control={
              <Switch
                size="small"
                checked={showOnlyMine}
                onChange={(_, checked) => onToggleOnlyMine(checked)}
              />
            }
          />
        ) : null}
      </Stack>

      <Stack spacing={0} direction="column">
        {showSkeleton
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={140} />
            ))
          : challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                currentUsername={currentUsername}
              />
            ))}

        {!isLoading && !challenges.length && (
          <EmptyState
            compact
            kind={error ? 'error' : 'battles'}
            title={t(error ? 'common.loadFailed' : 'challenges.noChallenges')}
            action={error ? <Button onClick={onRetry}>{t('common.retry')}</Button> : undefined}
          />
        )}
      </Stack>

      {(challengesPage?.pagesCount ?? 0) > 1 && (
        <ListPagination
          page={page}
          count={challengesPage?.pagesCount ?? 0}
          onChange={(value) => onPageChange(value)}
        />
      )}
    </Stack>
  );
};

export default ChallengesListPageHistoryTab;
