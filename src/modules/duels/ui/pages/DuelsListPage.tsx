import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils.ts';
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

type DuelsTab = 'my' | 'ready' | 'all';

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

const tabSubtitleMap: Record<DuelsTab, string> = {
  my: 'duels.incomingInvitations',
  ready: 'duels.readyPlayersSubtitle',
  all: 'duels.subtitle',
};

const DuelsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<DuelsTab | null>(null);
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

  useEffect(() => {
    if (activeTab !== null || myDuels === undefined) {
      return;
    }

    setActiveTab((myDuels?.total ?? 0) > 0 ? 'my' : 'ready');
  }, [activeTab, myDuels]);

  const resolvedActiveTab: DuelsTab = activeTab ?? ((myDuels?.total ?? 0) > 0 ? 'my' : 'ready');

  const incomingInvitations = useMemo(
    () => (invitationsPage?.data ?? []).filter((invitation) => invitation.viewerRole === 'invitee'),
    [invitationsPage?.data],
  );
  const outgoingInvitations = useMemo(
    () => (invitationsPage?.data ?? []).filter((invitation) => invitation.viewerRole === 'challenger'),
    [invitationsPage?.data],
  );

  const summaryCards = useMemo(
    () => [
      {
        label: t('duels.myDuelsSection'),
        value: myDuels?.total ?? 0,
        icon: 'mdi:sword-cross',
        color: 'primary',
      },
      {
        label: t('duels.incomingInvitations'),
        value: incomingInvitations.length,
        icon: 'mdi:email-fast-outline',
        color: 'warning',
      },
      {
        label: t('duels.readyPlayersTitle'),
        value: readyPlayersPage?.total ?? 0,
        icon: 'mdi:account-group-outline',
        color: 'success',
      },
    ],
    [incomingInvitations.length, myDuels?.total, readyPlayersPage?.total, t],
  );

  const handleToggleReady = async (value: boolean) => {
    try {
      const updatedStatus = await toggleReady(value);
      await mutateReadyStatus(updatedStatus, { revalidate: false });
      await mutateReadyPlayers();

      if (value) {
        setActiveTab('ready');
      }
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
    <Stack direction="column">
      <PageHeader
        title={t('duels.title')}
        breadcrumb={[
          { label: t('menu.battles') },
          { label: t('duels.title'), active: true },
        ]}
        actionComponent={
          <Button
            variant="outlined"
            color="primary"
            startIcon={<IconifyIcon icon="mdi:trophy-outline" />}
            onClick={() => navigate(resources.DuelsRating)}
            sx={{ borderRadius: 999 }}
          >
            {t('duels.ratingTitle')}
          </Button>
        }
      />

      <Box sx={responsivePagePaddingSx}>
        <Stack spacing={3}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  color: 'common.white',
                  background: `linear-gradient(135deg, ${theme.vars.palette.primary.dark}, ${theme.vars.palette.primary.main})`,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                  <Stack spacing={2.5}>
                    <Chip
                      label={t('duels.subtitle')}
                      sx={{
                        alignSelf: 'flex-start',
                        color: 'common.white',
                        backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.16),
                        fontWeight: 700,
                      }}
                    />

                    <Stack spacing={1}>
                      <Typography variant="h3" fontWeight={900}>
                        {t('duels.title')}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.84, maxWidth: 620 }}>
                        {t('duels.subtitle')}
                      </Typography>
                    </Stack>

                    <Grid container spacing={1.5}>
                      {summaryCards.map((item) => (
                        <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
                          <Box
                            sx={{
                              borderRadius: 3,
                              p: 2,
                              height: '100%',
                              border: '1px solid',
                              borderColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.12),
                              backgroundColor: cssVarRgba(theme.vars.palette.common.whiteChannel, 0.08),
                            }}
                          >
                            <Stack spacing={1.2}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" sx={{ opacity: 0.76 }}>
                                  {item.label}
                                </Typography>
                                <IconifyIcon icon={item.icon} sx={{ fontSize: 18, opacity: 0.76 }} />
                              </Stack>
                              <Typography variant="h4" fontWeight={900}>
                                {item.value}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <DuelReadyStatusCard
                ready={readyStatus?.ready ?? false}
                readyUntil={readyStatus?.readyUntil}
                loading={isTogglingReady}
                onToggle={handleToggleReady}
              />
            </Grid>
          </Grid>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              borderColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14),
            }}
          >
            <Box
              sx={{
                px: { xs: 1.5, md: 2.5 },
                pt: 2,
                pb: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                background: `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.05)}, transparent)`,
              }}
            >
              <Stack spacing={1}>
                <Tabs
                  value={resolvedActiveTab}
                  onChange={(_, value) => setActiveTab(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: 52,
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: 999,
                    },
                    '& .MuiTab-root': {
                      minHeight: 52,
                      fontWeight: 700,
                    },
                  }}
                >
                  <Tab value="my" label={t('duels.tab.my')} />
                  <Tab value="ready" label={t('duels.tab.ready')} />
                  <Tab value="all" label={t('duels.tab.all')} />
                </Tabs>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  {t(tabSubtitleMap[resolvedActiveTab])}
                </Typography>
              </Stack>
            </Box>

            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {resolvedActiveTab === 'my' ? (
                <Stack spacing={3}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, xl: 6 }}>
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
                    </Grid>
                    <Grid size={{ xs: 12, xl: 6 }}>
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
                    </Grid>
                  </Grid>

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

              {resolvedActiveTab === 'ready' ? (
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

              {resolvedActiveTab === 'all' ? (
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
            </CardContent>
          </Card>
        </Stack>
      </Box>

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
            sx={{ borderRadius: 999 }}
          >
            {t('duels.sendCounterOffer')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default DuelsListPage;
