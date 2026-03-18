import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import DuelReadyStatusCard from '../components/DuelReadyStatusCard.tsx';
import DuelReadyPlayersSection from '../components/DuelReadyPlayersSection.tsx';
import DuelInvitationsSection from '../components/DuelInvitationsSection.tsx';
import DuelsListSection from '../components/DuelsListSection.tsx';
import {
  useDuelInvitations,
  useDuelPresets,
  useDuelsList,
  useReadyPlayers,
  useReadyStatus,
} from '../../application/queries.ts';
import {
  useAcceptInvitation,
  useCounterInvitation,
  useCreateInvitation,
  useRejectInvitation,
  useUpdateReadyStatus,
} from '../../application/mutations.ts';
import { DuelInvitation, DuelReadyPlayer } from '../../domain/index.ts';
import DuelPresetDialog from '../components/DuelPresetDialog.tsx';

const formatDateInput = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toBackendDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (num: number) => num.toString().padStart(2, '0');
  const local = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);
  return `${local}${sign}${offsetHours}:${offsetMinutes}`;
};

const DuelsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'my' | 'ready' | 'all'>('my');
  const [myPage, setMyPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [readyPage, setReadyPage] = useState(1);
  const [invitationActionKey, setInvitationActionKey] = useState<string | null>(null);
  const [counterInvitationTarget, setCounterInvitationTarget] = useState<DuelInvitation | null>(null);
  const [counterStartTime, setCounterStartTime] = useState('');

  const pageSize = 10;
  const readyPageSize = 12;

  const { data: readyStatus, mutate: mutateReadyStatus } = useReadyStatus();
  const { trigger: toggleReady, isMutating: isTogglingReady } = useUpdateReadyStatus();

  const { data: readyPlayersPage, mutate: mutateReadyPlayers } = useReadyPlayers({
    page: readyPage,
    pageSize: readyPageSize,
  });

  const { data: myDuels, mutate: mutateMyDuels } = useDuelsList({
    my: true,
    page: myPage,
    pageSize,
  });
  const { data: invitationsPage, mutate: mutateInvitations } = useDuelInvitations({
    page: 1,
    pageSize: 20,
  });
  const { data: allDuels, mutate: mutateAllDuels } = useDuelsList({
    page: allPage,
    pageSize,
  });

  const { trigger: createInvitation, isMutating: isCreatingInvitation } = useCreateInvitation();
  const { trigger: acceptInvitation } = useAcceptInvitation();
  const { trigger: rejectInvitation } = useRejectInvitation();
  const { trigger: counterInvitation, isMutating: isCounteringInvitation } = useCounterInvitation();

  const [selectedOpponent, setSelectedOpponent] = useState<DuelReadyPlayer | null>(null);
  const isPresetDialogOpen = Boolean(selectedOpponent);
  const { data: presets = [], isLoading: isPresetsLoading } = useDuelPresets(selectedOpponent?.username ?? null);

  const minStartTime = useMemo(() => {
    const start = new Date();
    start.setMinutes(start.getMinutes() + 5);
    start.setSeconds(0, 0);
    return formatDateInput(start);
  }, []);
  const defaultStartTime = minStartTime;

  const incomingInvitations = useMemo(
    () => (invitationsPage?.data ?? []).filter((invitation) => invitation.viewerRole === 'invitee'),
    [invitationsPage?.data],
  );
  const outgoingInvitations = useMemo(
    () => (invitationsPage?.data ?? []).filter((invitation) => invitation.viewerRole === 'challenger'),
    [invitationsPage?.data],
  );

  const handleToggleReady = async (value: boolean) => {
    try {
      await toggleReady(value);
      await mutateReadyStatus();
      await mutateReadyPlayers();
    } catch {
      toast.error(t('duels.error'));
    }
  };

  const handleCreateDuel = async (payload: { presetId: number; startTime: string }) => {
    if (!selectedOpponent) return;
    try {
      await createInvitation({
        duelUsername: selectedOpponent.username,
        duelPresetId: payload.presetId,
        startTime: toBackendDate(payload.startTime),
      });
      toast.success(t('duels.invitationSentToast'));
      setSelectedOpponent(null);
      await Promise.all([mutateReadyPlayers(), mutateInvitations(), mutateMyDuels(), mutateAllDuels()]);
    } catch {
      toast.error(t('duels.error'));
    }
  };

  const handleAccept = async (invitation: DuelInvitation) => {
    try {
      setInvitationActionKey(`accept-${invitation.id}`);
      const updatedInvitation = await acceptInvitation(invitation.id);
      await Promise.all([mutateInvitations(), mutateMyDuels(), mutateAllDuels(), mutateReadyPlayers()]);
      toast.success(t('duels.acceptedToast'));
      if (updatedInvitation?.duelId) {
        navigate(getResourceById(resources.Duel, updatedInvitation.duelId));
      }
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setInvitationActionKey(null);
    }
  };

  const handleReject = async (invitation: DuelInvitation) => {
    try {
      setInvitationActionKey(`reject-${invitation.id}`);
      await rejectInvitation(invitation.id);
      await Promise.all([mutateInvitations(), mutateMyDuels(), mutateAllDuels(), mutateReadyPlayers()]);
      toast.success(t('duels.rejectedToast'));
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setInvitationActionKey(null);
    }
  };

  const openCounterDialog = (invitation: DuelInvitation) => {
    setCounterInvitationTarget(invitation);
    setCounterStartTime(
      invitation.proposedStartTime
        ? formatDateInput(new Date(invitation.proposedStartTime))
        : defaultStartTime,
    );
  };

  const closeCounterDialog = () => {
    setCounterInvitationTarget(null);
    setCounterStartTime(defaultStartTime);
  };

  const handleCounter = async () => {
    if (!counterInvitationTarget || !counterStartTime) return;
    try {
      setInvitationActionKey(`counter-${counterInvitationTarget.id}`);
      await counterInvitation({
        id: counterInvitationTarget.id,
        payload: { startTime: toBackendDate(counterStartTime) },
      });
      await Promise.all([mutateInvitations(), mutateReadyPlayers()]);
      toast.success(t('duels.counteredToast'));
      closeCounterDialog();
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setInvitationActionKey(null);
    }
  };

  const handleView = (duelId: number) => {
    navigate(getResourceById(resources.Duel, duelId));
  };

  const openPresetDialog = (player: DuelReadyPlayer) => {
    setSelectedOpponent(player);
  };

  const closePresetDialog = () => setSelectedOpponent(null);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack direction="column" spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="column" spacing={0.5}>
            <Typography variant="h4" fontWeight={800}>
              {t('duels.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('duels.subtitle')}
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<KepIcon name="rating" fontSize={20} />}
            onClick={() => navigate(resources.DuelsRating)}
          >
            {t('duels.ratingTitle')}
          </Button>
        </Stack>

        <DuelReadyStatusCard
          ready={readyStatus?.ready ?? false}
          loading={isTogglingReady}
          onToggle={handleToggleReady}
        />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="my" label={t('duels.tab.my')} />
            <Tab value="ready" label={t('duels.tab.ready')} />
            <Tab value="all" label={t('duels.tab.all')} />
          </Tabs>
        </Box>

        {activeTab === 'my' ? (
          <Stack spacing={3}>
            <DuelInvitationsSection
              title={t('duels.incomingInvitations')}
              invitations={incomingInvitations}
              loading={!invitationsPage}
              emptyText={t('duels.noIncomingInvitations')}
              actionLoadingKey={invitationActionKey}
              onAccept={handleAccept}
              onReject={handleReject}
              onCounter={openCounterDialog}
              onOpen={(invitation) => invitation.duelId && handleView(invitation.duelId)}
            />

            <DuelInvitationsSection
              title={t('duels.outgoingInvitations')}
              invitations={outgoingInvitations}
              loading={!invitationsPage}
              emptyText={t('duels.noOutgoingInvitations')}
              actionLoadingKey={invitationActionKey}
              onAccept={handleAccept}
              onReject={handleReject}
              onCounter={openCounterDialog}
              onOpen={(invitation) => invitation.duelId && handleView(invitation.duelId)}
            />

            <DuelsListSection
              title={t('duels.myDuelsSection')}
              duels={myDuels?.data ?? []}
              total={myDuels?.total ?? 0}
              page={myPage}
              pageSize={pageSize}
              loading={!myDuels}
              onPageChange={setMyPage}
              onView={(duel) => handleView(duel.id)}
            />
          </Stack>
        ) : null}

        {activeTab === 'ready' ? (
          <DuelReadyPlayersSection
            players={readyPlayersPage?.data ?? []}
            total={readyPlayersPage?.total ?? 0}
            page={readyPage}
            pageSize={readyPageSize}
            loading={!readyPlayersPage}
            currentUsername={currentUser?.username}
            onPageChange={setReadyPage}
            onChallenge={openPresetDialog}
          />
        ) : null}

        {activeTab === 'all' ? (
          <DuelsListSection
            title={t('duels.tab.all')}
            duels={allDuels?.data ?? []}
            total={allDuels?.total ?? 0}
            page={allPage}
            pageSize={pageSize}
            loading={!allDuels}
            onPageChange={setAllPage}
            onView={(duel) => handleView(duel.id)}
          />
        ) : null}
      </Stack>

      <DuelPresetDialog
        open={isPresetDialogOpen}
        presets={presets ?? []}
        loading={isPresetsLoading || isCreatingInvitation}
        opponent={selectedOpponent}
        minStartTime={minStartTime}
        defaultStartTime={defaultStartTime}
        onClose={closePresetDialog}
        onSubmit={handleCreateDuel}
      />

      <Dialog open={Boolean(counterInvitationTarget)} onClose={closeCounterDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{t('duels.suggestNewTime')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography variant="body2" color="text.secondary">
              {t('duels.suggestNewTimeDescription', {
                username: counterInvitationTarget?.otherUser?.username ?? '',
              })}
            </Typography>
            <TextField
              label={t('duels.startTime')}
              type="datetime-local"
              value={counterStartTime}
              onChange={(event) => setCounterStartTime(event.target.value)}
              inputProps={{ min: minStartTime }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" color="inherit" onClick={closeCounterDialog}>
            {t('duels.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleCounter}
            disabled={!counterStartTime || isCounteringInvitation}
          >
            {t('duels.sendCounterOffer')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DuelsListPage;
