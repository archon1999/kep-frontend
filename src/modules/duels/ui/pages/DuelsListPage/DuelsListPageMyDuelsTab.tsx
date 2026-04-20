import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { getResourceById, resources } from 'app/routes/resources.ts';
import {
  useAcceptDuelCall,
  useCancelDuelCall,
  useConfirmDuelCall,
  useCounterDuelCall,
  useRejectDuelCall,
} from 'modules/duels/application/mutations.ts';
import {
  isDuelsCollectionCacheKey,
  useDuelCalls,
} from 'modules/duels/application/queries.ts';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
import DuelsListPageScheduleDialog from './dialogs/DuelsListPageScheduleDialog.tsx';
import DuelsListPageCallsTab from './DuelsListPageCallsTab.tsx';
import DuelsListPageListSection from './components/DuelsListPageListSection.tsx';

const DuelsListPageMyDuelsTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: mutateCache } = useSWRConfig();
  const [actionLoadingKey, setActionLoadingKey] = useState<string | null>(null);
  const [scheduleDialogState, setScheduleDialogState] = useState<{
    mode: 'accept' | 'counter';
    invitation: DuelInvitation | null;
  }>({ mode: 'accept', invitation: null });

  const { data: needsResponsePage } = useDuelCalls({
    scope: 'needs_response',
    page: 1,
    pageSize: 20,
  });
  const { data: myCallsPage } = useDuelCalls({
    scope: 'mine',
    page: 1,
    pageSize: 20,
  });

  const { trigger: acceptDuelCall, isMutating: isAccepting } = useAcceptDuelCall();
  const { trigger: confirmDuelCall } = useConfirmDuelCall();
  const { trigger: rejectDuelCall } = useRejectDuelCall();
  const { trigger: cancelDuelCall } = useCancelDuelCall();
  const { trigger: counterDuelCall, isMutating: isCountering } = useCounterDuelCall();

  const refreshAll = async () => {
    await mutateCache(isDuelsCollectionCacheKey, undefined, { revalidate: true });
  };

  const openScheduleDialog = (mode: 'accept' | 'counter', invitation: DuelInvitation) => {
    setScheduleDialogState({ mode, invitation });
  };

  const closeScheduleDialog = () => {
    setScheduleDialogState({ mode: 'accept', invitation: null });
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

  const handleCounter = async (invitation: DuelInvitation, proposedStartTime: string) => {
    try {
      setActionLoadingKey(`counter-${invitation.id}`);
      await counterDuelCall({
        id: invitation.id,
        payload: { proposedStartTime },
      });
      toast.success(t('duels.counteredToast'));
      await refreshAll();
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleConfirm = async (invitation: DuelInvitation) => {
    try {
      setActionLoadingKey(`confirm-${invitation.id}`);
      const updatedInvitation = await confirmDuelCall(invitation.id);
      toast.success(t('duels.confirmedToast'));
      await refreshAll();

      if (updatedInvitation?.duelId) {
        navigate(getResourceById(resources.Duel, updatedInvitation.duelId));
      }
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setActionLoadingKey(null);
    }
  };

  const handleReject = async (invitation: DuelInvitation) => {
    try {
      setActionLoadingKey(`reject-${invitation.id}`);
      await rejectDuelCall(invitation.id);
      toast.success(t('duels.rejectedToast'));
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
      <Stack spacing={4}>
        <DuelsListPageCallsTab
          title={t('duels.needsMyResponse')}
          description={t('duels.needsResponseSubtitle')}
          invitations={needsResponsePage?.data ?? []}
          loading={!needsResponsePage}
          emptyText={t('duels.noNeedsResponseCalls')}
          actionLoadingKey={actionLoadingKey}
          onAccept={(invitation) => openScheduleDialog('accept', invitation)}
          onConfirm={handleConfirm}
          onReject={handleReject}
          onCancel={handleCancel}
          onCounter={(invitation) => openScheduleDialog('counter', invitation)}
          onOpen={(invitation) =>
            invitation.duelId && navigate(getResourceById(resources.Duel, invitation.duelId))
          }
        />

        <DuelsListPageCallsTab
          title={t('duels.myCallsTitle')}
          description={t('duels.myCallsSubtitle')}
          invitations={myCallsPage?.data ?? []}
          loading={!myCallsPage}
          emptyText={t('duels.noMyCalls')}
          actionLoadingKey={actionLoadingKey}
          onAccept={(invitation) => openScheduleDialog('accept', invitation)}
          onConfirm={handleConfirm}
          onReject={handleReject}
          onCancel={handleCancel}
          onCounter={(invitation) => openScheduleDialog('counter', invitation)}
          onOpen={(invitation) =>
            invitation.duelId && navigate(getResourceById(resources.Duel, invitation.duelId))
          }
        />

        <DuelsListPageListSection
          scope="my"
        />
      </Stack>

      <DuelsListPageScheduleDialog
        open={Boolean(scheduleDialogState.invitation)}
        mode={scheduleDialogState.mode}
        invitation={scheduleDialogState.invitation}
        loading={isAccepting || isCountering}
        onClose={closeScheduleDialog}
        onSubmit={(value) => {
          const invitation = scheduleDialogState.invitation;
          if (!invitation) return;
          if (scheduleDialogState.mode === 'accept') {
            handleAccept(invitation, value);
          } else {
            handleCounter(invitation, value);
          }
          closeScheduleDialog();
        }}
      />
    </>
  );
};

export default DuelsListPageMyDuelsTab;
