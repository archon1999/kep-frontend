import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Button, Stack } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources.ts';
import { contentGridSx } from 'app/theme/styles/content';
import {
  useAcceptDuelCall,
  useCancelDuelCall,
  useConfirmDuelCall,
  useCounterDuelCall,
  useRejectDuelCall,
} from 'modules/duels/application/mutations.ts';
import { isDuelsCollectionCacheKey, useDuelCalls } from 'modules/duels/application/queries.ts';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
import { getDuelErrorMessage } from 'modules/duels/ui/shared/helpers/getDuelErrorMessage.ts';
import EmptyState from 'shared/components/common/EmptyState';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import DuelInvitationCard, {
  DuelInvitationCardSkeleton,
} from './components/DuelInvitationCard.tsx';
import DuelListSection from './components/DuelListSection.tsx';
import DuelWaitingRoomCard, {
  DuelWaitingRoomCardSkeleton,
} from './components/DuelWaitingRoomCard.tsx';
import DuelScheduleDialog from './dialogs/DuelScheduleDialog.tsx';

type CallActions = {
  actionLoadingKey?: string | null;
  onAccept: (invitation: DuelInvitation) => void;
  onConfirm: (invitation: DuelInvitation) => void;
  onReject: (invitation: DuelInvitation) => void;
  onCancel: (invitation: DuelInvitation) => void;
  onCounter: (invitation: DuelInvitation) => void;
  onOpen: (invitation: DuelInvitation) => void;
};
const InvitationRow = ({
  invitation,
  ...actions
}: CallActions & { invitation: DuelInvitation }) => (
  <DuelInvitationCard
    invitation={invitation}
    actionLoadingKey={actions.actionLoadingKey}
    onAccept={() => actions.onAccept(invitation)}
    onConfirm={() => actions.onConfirm(invitation)}
    onReject={() => actions.onReject(invitation)}
    onCancel={() => actions.onCancel(invitation)}
    onCounter={() => actions.onCounter(invitation)}
    onOpen={() => actions.onOpen(invitation)}
  />
);
const DuelsListPageCallsSection = ({
  title,
  description,
  invitations,
  loading,
  emptyText,
  ...actions
}: CallActions & {
  title: string;
  description: string;
  invitations: DuelInvitation[];
  loading?: boolean;
  emptyText: string;
}) => (
  <Box component="section">
    <SectionHeader
      title={title}
      description={description}
      action={<PatternArtwork kind="notifications" sx={{ width: 100, opacity: 0.4 }} />}
    />
    {loading ? (
      Array.from({ length: 2 }, (_, i) => <DuelInvitationCardSkeleton key={i} />)
    ) : invitations.length ? (
      invitations.map((invitation) => (
        <InvitationRow key={invitation.id} invitation={invitation} {...actions} />
      ))
    ) : (
      <EmptyState kind="battles" compact title={emptyText} />
    )}
  </Box>
);

const DuelsListPageMyCallsSection = ({
  createdInvitations,
  activeInvitations,
  loading,
  ...actions
}: CallActions & {
  createdInvitations: DuelInvitation[];
  activeInvitations: DuelInvitation[];
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Box component="section">
      <SectionHeader
        title={t('duels.myCallsTitle')}
        description={t('duels.myCallsSubtitle')}
        action={<PatternArtwork kind="battles" sx={{ width: 100, opacity: 0.4 }} />}
      />
      {loading || createdInvitations.length > 0 ? (
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
          {loading
            ? Array.from({ length: 4 }, (_, i) => <DuelWaitingRoomCardSkeleton key={i} />)
            : createdInvitations.map((invitation) => (
                <DuelWaitingRoomCard
                  key={invitation.id}
                  invitation={invitation}
                  actionLoadingKey={actions.actionLoadingKey}
                  onCancel={() => actions.onCancel(invitation)}
                />
              ))}
        </Box>
      ) : null}
      {!loading &&
        activeInvitations.map((invitation) => (
          <InvitationRow key={invitation.id} invitation={invitation} {...actions} />
        ))}
      {!loading && !createdInvitations.length && !activeInvitations.length && (
        <EmptyState kind="battles" compact title={t('duels.noMyCalls')} />
      )}
    </Box>
  );
};

const DuelsListPageMyDuelsTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: mutateCache } = useSWRConfig();
  const [actionLoadingKey, setActionLoadingKey] = useState<string | null>(null);
  const [scheduleDialogState, setScheduleDialogState] = useState<{
    mode: 'accept' | 'counter';
    invitation: DuelInvitation | null;
  }>({ mode: 'accept', invitation: null });

  const {
    data: needsResponsePage,
    error: needsResponseError,
    isLoading: isNeedsResponseLoading,
  } = useDuelCalls({
    scope: 'needs_response',
    page: 1,
    pageSize: 20,
  });
  const {
    data: myCallsPage,
    error: myCallsError,
    isLoading: isMyCallsLoading,
  } = useDuelCalls({
    scope: 'mine',
    page: 1,
    pageSize: 20,
  });

  const { trigger: acceptDuelCall, isMutating: isAccepting } = useAcceptDuelCall();
  const { trigger: confirmDuelCall } = useConfirmDuelCall();
  const { trigger: rejectDuelCall } = useRejectDuelCall();
  const { trigger: cancelDuelCall } = useCancelDuelCall();
  const { trigger: counterDuelCall, isMutating: isCountering } = useCounterDuelCall();

  const needsResponseCalls = needsResponsePage?.data ?? [];
  const needsResponseIds = new Set(needsResponseCalls.map((invitation) => invitation.id));
  const myCalls = myCallsPage?.data ?? [];
  const createdOpenCalls = myCalls.filter(
    (invitation) => invitation.status === 1 && invitation.viewerRole === 'challenger',
  );
  const createdOpenCallIds = new Set(createdOpenCalls.map((invitation) => invitation.id));
  const activeCalls = myCalls.filter(
    (invitation) =>
      invitation.status <= 3 &&
      !needsResponseIds.has(invitation.id) &&
      !createdOpenCallIds.has(invitation.id),
  );
  const callsError = needsResponseError || myCallsError;

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
    } catch (error) {
      toast.error(getDuelErrorMessage(error, t('duels.error')));
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
    } catch (error) {
      toast.error(getDuelErrorMessage(error, t('duels.error')));
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
    } catch (error) {
      toast.error(getDuelErrorMessage(error, t('duels.error')));
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
      <Stack spacing={0}>
        {callsError ? (
          <EmptyState
            kind="error"
            compact
            title={t('duels.error')}
            action={
              <Button variant="outlined" onClick={() => void refreshAll()}>
                {t('common.retry')}
              </Button>
            }
          />
        ) : null}

        {!callsError && (isNeedsResponseLoading || needsResponseCalls.length > 0) ? (
          <DuelsListPageCallsSection
            title={t('duels.needsMyResponse')}
            description={t('duels.needsResponseSubtitle')}
            invitations={needsResponseCalls}
            loading={isNeedsResponseLoading}
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
        ) : null}

        {!callsError &&
        (isMyCallsLoading || createdOpenCalls.length > 0 || activeCalls.length > 0) ? (
          <DuelsListPageMyCallsSection
            createdInvitations={createdOpenCalls}
            activeInvitations={activeCalls}
            loading={isMyCallsLoading}
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
        ) : null}

        <DuelListSection scope="my" />
      </Stack>

      <DuelScheduleDialog
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
