import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useSWRConfig } from 'swr';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { useAcceptDuelCall, useCancelDuelCall } from 'modules/duels/application/mutations.ts';
import {
  isDuelsCollectionCacheKey,
  useDuelCalls,
} from 'modules/duels/application/queries.ts';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
import DuelScheduleDialog from './dialogs/DuelScheduleDialog.tsx';
import DuelWaitingRoomCard from './components/DuelWaitingRoomCard.tsx';

const DuelsListPageWaitingRoomTab = () => {
  const { t } = useTranslation();
  const { mutate: mutateCache } = useSWRConfig();
  const [selectedInvitation, setSelectedInvitation] = useState<DuelInvitation | null>(null);
  const [actionLoadingKey, setActionLoadingKey] = useState<string | null>(null);
  const { data: queueCallsPage, mutate: mutateQueueCalls } = useDuelCalls({
    scope: 'queue',
    page: 1,
    pageSize: 20,
  });
  const { trigger: acceptDuelCall, isMutating: isAccepting } = useAcceptDuelCall();
  const { trigger: cancelDuelCall } = useCancelDuelCall();

  const invitations = queueCallsPage?.data ?? [];
  const loading = !queueCallsPage;

  const refreshAll = async () => {
    await mutateCache(isDuelsCollectionCacheKey, undefined, { revalidate: true });
  };

  const handleAccept = async (invitation: DuelInvitation, proposedStartTime: string) => {
    try {
      setActionLoadingKey(`accept-${invitation.id}`);
      await acceptDuelCall({
        id: invitation.id,
        payload: { proposedStartTime },
      });
      toast.success(t('duels.acceptedToast'));
      await refreshAll();
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleCancel = async (invitation: DuelInvitation) => {
    try {
      setActionLoadingKey(`cancel-${invitation.id}`);
      await cancelDuelCall(invitation.id);
      toast.success(t('duels.cancelledToast'));
      await refreshAll();
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setActionLoadingKey(null);
    }
  };

  return (
    <>
      <Stack spacing={2.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          flexWrap="wrap"
          useFlexGap
        >
          <Stack spacing={0.4}>
            <Typography variant="h6" fontWeight={800}>
              {t('duels.waitingRoom')}
              {invitations.length > 0 ? (
                <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
                  ({invitations.length})
                </Typography>
              ) : null}
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            size="small"
            onClick={() => mutateQueueCalls()}
            startIcon={<IconifyIcon icon="mdi:refresh" width={16} height={16} />}
            sx={{ borderRadius: 999 }}
          >
            {t('duels.refresh')}
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {loading
            ? Array.from({ length: 8 }).map((_) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                  <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            : null}

          {!loading && !invitations.length ? (
            <Grid size={12}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {t('duels.noQueueCalls')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : null}

          {!loading &&
            invitations.map((invitation) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                <DuelWaitingRoomCard
                  invitation={invitation}
                  actionLoadingKey={actionLoadingKey}
                  onAccept={() => setSelectedInvitation(invitation)}
                  onCancel={() => handleCancel(invitation)}
                />
              </Grid>
            ))}
        </Grid>
      </Stack>

      <DuelScheduleDialog
        open={Boolean(selectedInvitation)}
        mode="accept"
        invitation={selectedInvitation}
        loading={isAccepting}
        onClose={() => setSelectedInvitation(null)}
        onSubmit={(value) => {
          if (!selectedInvitation) return;
          handleAccept(selectedInvitation, value);
          setSelectedInvitation(null);
        }}
      />
    </>
  );
};

export default DuelsListPageWaitingRoomTab;
