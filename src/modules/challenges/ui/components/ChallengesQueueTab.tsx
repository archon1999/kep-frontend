import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { ChallengeCall } from '../../domain';
import ChallengeCallCard from './ChallengeCallCard.tsx';

type ChallengesQueueTabProps = {
  calls?: ChallengeCall[];
  isLoading: boolean;
  onRefresh: () => void;
  onAccepted: (challengeId?: number) => void;
  onRemoved: () => void;
};

const ChallengesQueueTab = ({
  calls,
  isLoading,
  onRefresh,
  onAccepted,
  onRemoved,
}: ChallengesQueueTabProps) => {
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
        <Typography variant="h6">{t('challenges.waitingRoom')}</Typography>
        <Button variant="outlined" size="small" onClick={onRefresh}>
          {t('challenges.refresh')}
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          : safeCalls.map((call) => (
              <Grid key={call.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                <ChallengeCallCard
                  challengeCall={call}
                  onAccepted={onAccepted}
                  onRemoved={onRemoved}
                />
              </Grid>
            ))}
        {!isLoading && !safeCalls.length && (
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {t('challenges.noCalls')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default ChallengesQueueTab;
