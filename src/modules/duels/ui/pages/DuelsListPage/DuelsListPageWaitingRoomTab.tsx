import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack } from '@mui/material';
import { contentGridSx } from 'app/theme/styles/content';
import { useAcceptDuelCall, useCancelDuelCall } from 'modules/duels/application/mutations';
import { isDuelsCollectionCacheKey, useDuelCalls } from 'modules/duels/application/queries';
import { DuelInvitation } from 'modules/duels/domain';
import { getDuelErrorMessage } from 'modules/duels/ui/shared/helpers/getDuelErrorMessage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { ListFeedback } from 'shared/components/sections/common/FramedListPage';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import DuelWaitingRoomCard, { DuelWaitingRoomCardSkeleton } from './components/DuelWaitingRoomCard';
import DuelScheduleDialog from './dialogs/DuelScheduleDialog';

const DuelsListPageWaitingRoomTab = () => {
  const { t } = useTranslation();
  const { mutate: mutateCache } = useSWRConfig();
  const [selectedInvitation, setSelectedInvitation] = useState<DuelInvitation | null>(null);
  const [actionLoadingKey, setActionLoadingKey] = useState<string | null>(null);
  const {
    data: queueCallsPage,
    error,
    isLoading,
    mutate: mutateQueueCalls,
  } = useDuelCalls({ scope: 'queue', page: 1, pageSize: 20 });
  const { trigger: acceptDuelCall, isMutating: isAccepting } = useAcceptDuelCall();
  const { trigger: cancelDuelCall } = useCancelDuelCall();
  const invitations = queueCallsPage?.data ?? [];
  const loading = isLoading && !queueCallsPage;
  const refreshAll = () => mutateCache(isDuelsCollectionCacheKey, undefined, { revalidate: true });
  const handleAccept = async (invitation: DuelInvitation, proposedStartTime: string) => {
    try {
      setActionLoadingKey(`accept-${invitation.id}`);
      await acceptDuelCall({ id: invitation.id, payload: { proposedStartTime } });
      toast.success(t('duels.acceptedToast'));
      await refreshAll();
    } catch (error) {
      toast.error(getDuelErrorMessage(error, t('duels.error')));
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
    } catch (error) {
      toast.error(getDuelErrorMessage(error, t('duels.error')));
    } finally {
      setActionLoadingKey(null);
    }
  };
  return (
    <>
      <Box component="section" className="kep-duel-waiting-room">
        <SectionHeader
          title={t('duels.waitingRoom')}
          action={
            <Stack direction="row" gap={2} alignItems="center">
              <PatternArtwork
                kind="battles"
                sx={{ width: 100, opacity: 0.4, display: { xs: 'none', sm: 'block' } }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => void mutateQueueCalls()}
                startIcon={<IconifyIcon icon="mdi:refresh" />}
              >
                {t('duels.refresh')}
              </Button>
            </Stack>
          }
        />
        <ListFeedback
          loading={loading}
          error={error}
          empty={!invitations.length}
          emptyTitle={t('duels.noQueueCalls')}
          emptyMessage=""
          kind="battles"
          errorMessage={t('duels.error')}
          onRetry={() => void mutateQueueCalls()}
          loadingContent={
            <Box
              sx={{
                ...contentGridSx,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2,minmax(0,1fr))',
                  lg: 'repeat(4,minmax(0,1fr))',
                },
              }}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <DuelWaitingRoomCardSkeleton key={i} />
              ))}
            </Box>
          }
        />
        {!loading && !error && invitations.length > 0 && (
          <Box
            sx={{
              ...contentGridSx,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2,minmax(0,1fr))',
                lg: 'repeat(4,minmax(0,1fr))',
              },
            }}
          >
            {invitations.map((invitation) => (
              <DuelWaitingRoomCard
                key={invitation.id}
                invitation={invitation}
                actionLoadingKey={actionLoadingKey}
                onAccept={() => setSelectedInvitation(invitation)}
                onCancel={() => void handleCancel(invitation)}
              />
            ))}
          </Box>
        )}
      </Box>
      <DuelScheduleDialog
        open={Boolean(selectedInvitation)}
        mode="accept"
        invitation={selectedInvitation}
        loading={isAccepting}
        onClose={() => setSelectedInvitation(null)}
        onSubmit={(value) => {
          if (!selectedInvitation) return;
          void handleAccept(selectedInvitation, value);
          setSelectedInvitation(null);
        }}
      />
    </>
  );
};
export default DuelsListPageWaitingRoomTab;
