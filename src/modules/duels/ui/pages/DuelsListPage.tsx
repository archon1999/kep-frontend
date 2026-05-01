import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources.ts';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam, numberParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils.ts';
import {
  useAcceptDuelCall,
  useCancelDuelCall,
  useConfirmDuelCall,
  useCounterDuelCall,
  useCreateDuelCall,
  useRejectDuelCall,
} from '../../application/mutations.ts';
import {
  useDuelCalls,
  useDuelPresets,
  useDuelTypes,
  useDuelsList,
} from '../../application/queries.ts';
import { DuelInvitation } from '../../domain/index.ts';
import DuelCallComposerCard from '../components/DuelCallComposerCard.tsx';
import DuelCallScheduleDialog from '../components/DuelCallScheduleDialog.tsx';
import DuelInvitationsSection from '../components/DuelInvitationsSection.tsx';
import DuelsListSection from '../components/DuelsListSection.tsx';

type DuelsTab = 'queue' | 'needs_response' | 'my_calls' | 'history';

type DuelsListQueryState = {
  activeTab: DuelsTab | '';
  myDuelsPage: number;
  allDuelsPage: number;
};

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
  queue: 'duels.queueSubtitle',
  needs_response: 'duels.needsResponseSubtitle',
  my_calls: 'duels.myCallsSubtitle',
  history: 'duels.historySubtitle',
};

const DuelsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  useDocumentTitle('pageTitles.duels');

  const { state, setField } = useRouteQueryState<DuelsListQueryState>({
    defaults: {
      activeTab: '',
      myDuelsPage: 1,
      allDuelsPage: 1,
    },
    schema: {
      activeTab: {
        ...enumParam(['queue', 'needs_response', 'my_calls', 'history'] as const),
        param: 'tab',
      },
      myDuelsPage: {
        ...numberParam({ min: 1 }),
        param: 'myPage',
      },
      allDuelsPage: {
        ...numberParam({ min: 1 }),
        param: 'recentPage',
      },
    },
    historyByKey: {
      activeTab: 'push',
      myDuelsPage: 'push',
      allDuelsPage: 'push',
    },
  });
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [actionLoadingKey, setActionLoadingKey] = useState<string | null>(null);
  const [scheduleDialogState, setScheduleDialogState] = useState<{
    mode: 'accept' | 'counter';
    invitation: DuelInvitation | null;
  }>({ mode: 'accept', invitation: null });
  const [scheduleValue, setScheduleValue] = useState('');

  const pageSize = 8;

  const { data: queueCallsPage, mutate: mutateQueueCalls } = useDuelCalls({
    scope: 'queue',
    page: 1,
    pageSize: 20,
  });
  const { data: needsResponsePage, mutate: mutateNeedsResponse } = useDuelCalls({
    scope: 'needs_response',
    page: 1,
    pageSize: 20,
  });
  const { data: myCallsPage, mutate: mutateMyCalls } = useDuelCalls({
    scope: 'mine',
    page: 1,
    pageSize: 20,
  });
  const { data: myDuels, mutate: mutateMyDuels } = useDuelsList({
    my: true,
    page: state.myDuelsPage,
    pageSize,
  });
  const { data: allDuels, mutate: mutateAllDuels } = useDuelsList({
    page: state.allDuelsPage,
    pageSize,
  });
  const { data: presets = [] } = useDuelPresets();
  const { data: duelTypes = [] } = useDuelTypes();

  const { trigger: createDuelCall, isMutating: isCreatingCall } = useCreateDuelCall();
  const { trigger: acceptDuelCall, isMutating: isAccepting } = useAcceptDuelCall();
  const { trigger: confirmDuelCall } = useConfirmDuelCall();
  const { trigger: rejectDuelCall } = useRejectDuelCall();
  const { trigger: cancelDuelCall } = useCancelDuelCall();
  const { trigger: counterDuelCall, isMutating: isCountering } = useCounterDuelCall();

  const minStartTime = useMemo(() => {
    const start = new Date();
    start.setMinutes(start.getMinutes() + 5);
    start.setSeconds(0, 0);
    return formatDateInput(start);
  }, []);

  const queueCalls = queueCallsPage?.data ?? [];
  const needsResponseCalls = needsResponsePage?.data ?? [];
  const myCalls = myCallsPage?.data ?? [];

  useEffect(() => {
    if (!selectedPresetId && presets.length) {
      setSelectedPresetId(String(presets[0]?.id ?? ''));
    }
  }, [presets, selectedPresetId]);

  useEffect(() => {
    if (!selectedTypeId && duelTypes.length) {
      setSelectedTypeId(String(duelTypes[0]?.id ?? ''));
    }
  }, [duelTypes, selectedTypeId]);

  const resolvedActiveTab: DuelsTab =
    state.activeTab ||
    ((needsResponsePage?.total ?? 0) > 0 ? 'needs_response' : (myDuels?.total ?? 0) > 0 ? 'history' : 'queue');

  const refreshAll = async () => {
    await Promise.all([
      mutateQueueCalls(),
      mutateNeedsResponse(),
      mutateMyCalls(),
      mutateMyDuels(),
      mutateAllDuels(),
    ]);
  };

  const summaryCards = [
    {
      label: t('duels.openQueue'),
      value: queueCallsPage?.total ?? 0,
      icon: 'mdi:broadcast',
      color: theme.vars.palette.primary.mainChannel,
    },
    {
      label: t('duels.needsMyResponse'),
      value: needsResponsePage?.total ?? 0,
      icon: 'mdi:message-badge-outline',
      color: theme.vars.palette.warning.mainChannel,
    },
    {
      label: t('duels.myDuelsSection'),
      value: myDuels?.total ?? 0,
      icon: 'mdi:sword-cross',
      color: theme.vars.palette.success.mainChannel,
    },
  ];

  const openScheduleDialog = (mode: 'accept' | 'counter', invitation: DuelInvitation) => {
    setScheduleDialogState({ mode, invitation });
    setScheduleValue(
      invitation.proposedStartTime
        ? formatDateInput(new Date(invitation.proposedStartTime))
        : minStartTime,
    );
  };

  const closeScheduleDialog = () => {
    setScheduleDialogState({ mode: 'accept', invitation: null });
    setScheduleValue(minStartTime);
  };

  const handleCreateCall = async () => {
    if (!selectedPresetId || !selectedTypeId) return;

    try {
      await createDuelCall({
        duelPresetId: Number(selectedPresetId),
        duelTypeId: Number(selectedTypeId),
      });
      toast.success(t('duels.callCreatedToast'));
      setField('activeTab', 'my_calls');
      await refreshAll();
    } catch {
      toast.error(t('duels.error'));
    }
  };

  const handleScheduleSubmit = async () => {
    const invitation = scheduleDialogState.invitation;
    if (!invitation || !scheduleValue) return;

    try {
      if (scheduleDialogState.mode === 'accept') {
        setActionLoadingKey(`accept-${invitation.id}`);
        await acceptDuelCall({
          id: invitation.id,
          payload: { proposedStartTime: toBackendDate(scheduleValue) },
        });
        toast.success(t('duels.acceptedToast'));
      } else {
        setActionLoadingKey(`counter-${invitation.id}`);
        await counterDuelCall({
          id: invitation.id,
          payload: { proposedStartTime: toBackendDate(scheduleValue) },
        });
        toast.success(t('duels.counteredToast'));
      }

      closeScheduleDialog();
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

  const handleView = (duelId: number) => {
    navigate(getResourceById(resources.Duel, duelId));
  };

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
                        {t('duels.queueHeroDescription')}
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
              <DuelCallComposerCard
                presets={presets}
                duelTypes={duelTypes}
                selectedPresetId={selectedPresetId}
                selectedTypeId={selectedTypeId}
                disabled={isCreatingCall}
                onPresetChange={setSelectedPresetId}
                onTypeChange={setSelectedTypeId}
                onSubmit={handleCreateCall}
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
                  onChange={(_, value) => setField('activeTab', value)}
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
                  <Tab value="queue" label={t('duels.tab.queue')} />
                  <Tab value="needs_response" label={t('duels.tab.needsResponse')} />
                  <Tab value="my_calls" label={t('duels.tab.myCalls')} />
                  <Tab value="history" label={t('duels.tab.history')} />
                </Tabs>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  {t(tabSubtitleMap[resolvedActiveTab])}
                </Typography>
              </Stack>
            </Box>

            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {resolvedActiveTab === 'queue' ? (
                <DuelInvitationsSection
                  title={t('duels.openQueue')}
                  invitations={queueCalls}
                  loading={!queueCallsPage}
                  emptyText={t('duels.noQueueCalls')}
                  actionLoadingKey={actionLoadingKey}
                  onAccept={(invitation) => openScheduleDialog('accept', invitation)}
                  onConfirm={handleConfirm}
                  onReject={handleReject}
                  onCancel={handleCancel}
                  onCounter={(invitation) => openScheduleDialog('counter', invitation)}
                  onOpen={(invitation) => invitation.duelId && handleView(invitation.duelId)}
                />
              ) : null}

              {resolvedActiveTab === 'needs_response' ? (
                <DuelInvitationsSection
                  title={t('duels.needsMyResponse')}
                  invitations={needsResponseCalls}
                  loading={!needsResponsePage}
                  emptyText={t('duels.noNeedsResponseCalls')}
                  actionLoadingKey={actionLoadingKey}
                  onAccept={(invitation) => openScheduleDialog('accept', invitation)}
                  onConfirm={handleConfirm}
                  onReject={handleReject}
                  onCancel={handleCancel}
                  onCounter={(invitation) => openScheduleDialog('counter', invitation)}
                  onOpen={(invitation) => invitation.duelId && handleView(invitation.duelId)}
                />
              ) : null}

              {resolvedActiveTab === 'my_calls' ? (
                <DuelInvitationsSection
                  title={t('duels.myCallsTitle')}
                  invitations={myCalls}
                  loading={!myCallsPage}
                  emptyText={t('duels.noMyCalls')}
                  actionLoadingKey={actionLoadingKey}
                  onAccept={(invitation) => openScheduleDialog('accept', invitation)}
                  onConfirm={handleConfirm}
                  onReject={handleReject}
                  onCancel={handleCancel}
                  onCounter={(invitation) => openScheduleDialog('counter', invitation)}
                  onOpen={(invitation) => invitation.duelId && handleView(invitation.duelId)}
                />
              ) : null}

              {resolvedActiveTab === 'history' ? (
                <Stack spacing={3}>
                  <DuelsListSection
                    title={t('duels.myDuelsSection')}
                    duels={myDuels?.data ?? []}
                    total={myDuels?.total ?? 0}
                    page={state.myDuelsPage}
                    pageSize={pageSize}
                    loading={!myDuels}
                    onPageChange={(value) => setField('myDuelsPage', value)}
                    onView={(duel) => handleView(duel.id)}
                  />

                  <DuelsListSection
                    title={t('duels.recentDuelsSection')}
                    duels={allDuels?.data ?? []}
                    total={allDuels?.total ?? 0}
                    page={state.allDuelsPage}
                    pageSize={pageSize}
                    loading={!allDuels}
                    onPageChange={(value) => setField('allDuelsPage', value)}
                    onView={(duel) => handleView(duel.id)}
                  />
                </Stack>
              ) : null}
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <DuelCallScheduleDialog
        open={Boolean(scheduleDialogState.invitation)}
        mode={scheduleDialogState.mode}
        invitation={scheduleDialogState.invitation}
        value={scheduleValue}
        minStartTime={minStartTime}
        loading={isAccepting || isCountering}
        onChange={setScheduleValue}
        onClose={closeScheduleDialog}
        onSubmit={handleScheduleSubmit}
      />
    </Stack>
  );
};

export default DuelsListPage;
