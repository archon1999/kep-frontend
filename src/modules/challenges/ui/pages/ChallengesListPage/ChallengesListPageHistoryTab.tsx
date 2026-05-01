import { useTranslation } from 'react-i18next';
import { Box, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { Challenge } from 'modules/challenges/domain';
import { PageResult } from 'modules/challenges/domain/ports/challenges.repository.ts';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch.tsx';
import ChallengeCard from 'modules/challenges/ui/shared/components/ChallengeCard.tsx';

type ChallengesListPageHistoryTabProps = {
  challengesPage?: PageResult<Challenge>;
  isLoading: boolean;
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
        <Typography variant="h6">{t('challenges.recent')}</Typography>
        {isAuthenticated ? (
          <OnlyMeSwitch
            label={t('challenges.onlyMe')}
            checked={showOnlyMine}
            onChange={(_, checked) => onToggleOnlyMine(checked)}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          />
        ) : null}
      </Stack>

      <Stack spacing={1.5} direction="column">
        {showSkeleton
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
            ))
          : challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} currentUsername={currentUsername} />
            ))}

        {!isLoading && !challenges.length && (
          <Typography variant="body2" color="text.secondary">
            {t('challenges.noChallenges')}
          </Typography>
        )}
      </Stack>

      {(challengesPage?.pagesCount ?? 0) > 1 && (
        <Box display="flex" justifyContent="flex-end">
          <Pagination
            color="primary"
            shape="rounded"
            page={page}
            count={challengesPage?.pagesCount ?? 0}
            onChange={(_, value) => onPageChange(value)}
          />
        </Box>
      )}
    </Stack>
  );
};

export default ChallengesListPageHistoryTab;
