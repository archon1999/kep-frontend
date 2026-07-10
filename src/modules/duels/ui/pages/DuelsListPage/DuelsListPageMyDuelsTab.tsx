import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
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
import { getDuelErrorMessage } from 'modules/duels/ui/shared/helpers/getDuelErrorMessage.ts';
import DuelInvitationCard from './components/DuelInvitationCard.tsx';
import DuelListSection from './components/DuelListSection.tsx';
import DuelScheduleDialog from './dialogs/DuelScheduleDialog.tsx';

type DuelsListPageCallsSectionProps = {
  title: string;
  description: string;
  invitations: DuelInvitation[];
  loading?: boolean;
  emptyText: string;
  actionLoadingKey?: string | null;
  onAccept: (invitation: DuelInvitation) => void;
  onConfirm: (invitation: DuelInvitation) => void;
  onReject: (invitation: DuelInvitation) => void;
  onCancel: (invitation: DuelInvitation) => void;
  onCounter: (invitation: DuelInvitation) => void;
  onOpen: (invitation: DuelInvitation) => void;
};

const DuelsListPageCallsSection = ({
  title,
  description,
  invitations,
  loading,
  emptyText,
  actionLoadingKey,
  onAccept,
  onConfirm,
  onReject,
  onCancel,
  onCounter,
  onOpen,
}: DuelsListPageCallsSectionProps) => (
  <Stack spacing={2}>
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
          {title}
          {invitations.length > 0 ? (
            <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
              ({invitations.length})
            </Typography>
          ) : null}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Stack>

    {loading
      ? Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Skeleton width="50%" />
                <Skeleton width="80%" />
                <Skeleton width="40%" />
              </Stack>
            </CardContent>
          </Card>
        ))
      : null}

    {!loading && !invitations.length ? (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {emptyText}
          </Typography>
        </CardContent>
      </Card>
    ) : null}

    {!loading &&
      invitations.map((invitation) => (
        <DuelInvitationCard
          key={invitation.id}
          invitation={invitation}
          actionLoadingKey={actionLoadingKey}
          onAccept={() => onAccept(invitation)}
          onConfirm={() => onConfirm(invitation)}
          onReject={() => onReject(invitation)}
          onCancel={() => onCancel(invitation)}
          onCounter={() => onCounter(invitation)}
          onOpen={() => onOpen(invitation)}
        />
      ))}
  </Stack>
);

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
  const { data: myCallsPage, error: myCallsError, isLoading: isMyCallsLoading } = useDuelCalls({
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
  const activeCalls = (myCallsPage?.data ?? []).filter(
    (invitation) => invitation.status <= 3 && !needsResponseIds.has(invitation.id),
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
      <Stack spacing={4}>
        {callsError ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="error.main">
                {t('duels.error')}
              </Typography>
            </CardContent>
          </Card>
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

        {!callsError && (isMyCallsLoading || activeCalls.length > 0) ? (
          <DuelsListPageCallsSection
            title={t('duels.myCallsTitle')}
            description={t('duels.myCallsSubtitle')}
            invitations={activeCalls}
            loading={isMyCallsLoading}
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
