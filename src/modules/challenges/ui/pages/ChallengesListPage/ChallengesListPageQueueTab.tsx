import { useTranslation } from 'react-i18next';
import { Button, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { ChallengeCall } from 'modules/challenges/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import ChallengeCallCard from './components/ChallengeCallCard.tsx';

type ChallengesListPageQueueTabProps = {
  calls?: ChallengeCall[];
  isLoading: boolean;
  error?: unknown;
  onOpenQuickStart: () => void;
  onRefresh: () => void;
  onAccepted: (challengeId?: number) => void;
  onRemoved: () => void;
};

const ChallengesListPageQueueTab = ({
  calls,
  isLoading,
  error,
  onOpenQuickStart,
  onRefresh,
  onAccepted,
  onRemoved,
}: ChallengesListPageQueueTabProps) => {
  const { t } = useTranslation();
  const safeCalls = Array.isArray(calls) ? calls : [];

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
          {t('challenges.waitingRoom')}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={onRefresh}
          startIcon={<IconifyIcon icon="solar:refresh-linear" fontSize={16} />}
        >
          {t('challenges.refresh')}
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 6 }}>
                <Skeleton variant="rectangular" height={215} />
              </Grid>
            ))
          : safeCalls.map((call) => (
              <Grid key={call.id} size={{ xs: 12, sm: 6, lg: 6 }}>
                <ChallengeCallCard
                  challengeCall={call}
                  onAccepted={onAccepted}
                  onRemoved={onRemoved}
                />
              </Grid>
            ))}
        {!isLoading && !safeCalls.length && (
          <Grid size={{ xs: 12 }}>
            <EmptyState
              compact
              kind={error ? 'error' : 'battles'}
              title={t(error ? 'common.loadFailed' : 'challenges.noCalls')}
              description={error ? undefined : t('challenges.quickStartSubtitle')}
              action={
                <Button variant="contained" onClick={error ? onRefresh : onOpenQuickStart}>
                  {t(error ? 'common.retry' : 'challenges.quickStartTitle')}
                </Button>
              }
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default ChallengesListPageQueueTab;
