import { useMemo, useState } from 'react';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources.ts';
import KepIcon from 'shared/components/base/KepIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import DuelReadyStatusCard from '../components/DuelReadyStatusCard.tsx';
import DuelReadyPlayersSection from '../components/DuelReadyPlayersSection.tsx';
import DuelsListSection from '../components/DuelsListSection.tsx';
import { useDuelPresets, useDuelsList, useReadyPlayers, useReadyStatus } from '../../application/queries.ts';
import { useConfirmDuel, useCreateDuel, useUpdateReadyStatus } from '../../application/mutations.ts';
import { DuelReadyPlayer } from '../../domain/index.ts';
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
  const [confirmLoadingId, setConfirmLoadingId] = useState<number | null>(null);

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
  const { data: allDuels, mutate: mutateAllDuels } = useDuelsList({
    page: allPage,
    pageSize,
  });

  const { trigger: createDuel, isMutating: isCreatingDuel } = useCreateDuel();
  const { trigger: confirmDuel } = useConfirmDuel();

  const [selectedOpponent, setSelectedOpponent] = useState<DuelReadyPlayer | null>(null);
  const isPresetDialogOpen = Boolean(selectedOpponent);
  const { data: presets = [], isLoading: isPresetsLoading } = useDuelPresets(selectedOpponent?.username ?? null);

  const defaultStartTime = useMemo(() => {
    const start = new Date();
    start.setMinutes(start.getMinutes() + 5);
    start.setSeconds(0, 0);
    return formatDateInput(start);
  }, []);

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
      const response = await createDuel({
        duelUsername: selectedOpponent.username,
        duelPresetId: payload.presetId,
        startTime: toBackendDate(payload.startTime),
      });
      toast.success(t('duels.createdToast'));
      setSelectedOpponent(null);
      await Promise.all([mutateReadyPlayers(), mutateMyDuels(), mutateAllDuels()]);
      const duelId = (response as any)?.id;
      if (duelId) {
        navigate(getResourceById(resources.Duel, duelId));
      }
    } catch {
      toast.error(t('duels.error'));
    }
  };

  const handleConfirm = async (duelId: number) => {
    try {
      setConfirmLoadingId(duelId);
      await confirmDuel(duelId);
      await Promise.all([mutateMyDuels(), mutateAllDuels()]);
      toast.success(t('duels.confirmedToast'));
    } catch {
      toast.error(t('duels.error'));
    } finally {
      setConfirmLoadingId(null);
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
          <DuelsListSection
            title={t('duels.tab.my')}
            duels={myDuels?.data ?? []}
            total={myDuels?.total ?? 0}
            page={myPage}
            pageSize={pageSize}
            loading={!myDuels}
            confirmLoadingId={confirmLoadingId}
            currentUsername={currentUser?.username}
            onPageChange={setMyPage}
            onConfirm={(duel) => handleConfirm(duel.id)}
            onView={(duel) => handleView(duel.id)}
          />
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
            confirmLoadingId={confirmLoadingId}
            currentUsername={currentUser?.username}
            onPageChange={setAllPage}
            onConfirm={(duel) => handleConfirm(duel.id)}
            onView={(duel) => handleView(duel.id)}
          />
        ) : null}
      </Stack>

      <DuelPresetDialog
        open={isPresetDialogOpen}
        presets={presets ?? []}
        loading={isPresetsLoading || isCreatingDuel}
        opponent={selectedOpponent}
        minStartTime={formatDateInput(new Date())}
        defaultStartTime={defaultStartTime}
        onClose={closePresetDialog}
        onSubmit={handleCreateDuel}
      />
    </Box>
  );
};

export default DuelsListPage;
