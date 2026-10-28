import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { getResourceById, resources } from 'app/routes/resources';
import { contentGridSx, contentHeadingSx } from 'app/theme/styles/content';
import {
  useAccountTeams,
  useCreateTeam,
  useDeleteTeam,
  useJoinTeam,
  useRefreshTeamCode,
} from 'modules/account-settings/application';
import type { AccountTeam } from 'modules/account-settings/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import DialogHeader from 'shared/components/common/DialogHeader';
import { toast } from 'sonner';
import SettingsSection from './SettingsSection';

const TeamsSection = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const { data, isLoading, error: loadError, mutate } = useAccountTeams();
  const { trigger: createTeam, isMutating: isCreating } = useCreateTeam();
  const { trigger: joinTeam, isMutating: isJoining } = useJoinTeam();
  const { trigger: deleteTeam, isMutating: isDeleting } = useDeleteTeam();
  const { trigger: refreshCode, isMutating: isRefreshing } = useRefreshTeamCode();

  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [pendingDeleteTeam, setPendingDeleteTeam] = useState<AccountTeam | null>(null);

  const isBusy = isCreating || isJoining || isRefreshing || isDeleting;

  useEffect(() => {
    if (!isBusy) {
      mutate();
    }
  }, [isBusy, mutate]);

  const isCreator = (team: AccountTeam) => currentUser?.username === team.createrUsername;

  const handleCopy = async (code: string) => {
    const link = `${window.location.origin}${getResourceById(resources.TeamJoin, code)}`;
    await navigator.clipboard.writeText(link);
    toast.success(t('settings.linkCopied'));
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;
    await createTeam(teamName.trim());
    setTeamName('');
    await mutate();
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) return;
    await joinTeam(joinCode.trim());
    setJoinCode('');
    await mutate();
  };

  const handleConfirmDeleteTeam = async () => {
    if (!pendingDeleteTeam) {
      return;
    }

    await deleteTeam(pendingDeleteTeam.code);
    toast.success(t('settings.teamDeleted'));
    setPendingDeleteTeam(null);
    await mutate();
  };

  const handleRefreshCode = async (code: string) => {
    const updated = await refreshCode(code);
    toast.success(t('settings.saved'));
    await mutate();
    return updated;
  };

  const renderTeamCard = (team: AccountTeam) => (
    <Box key={team.id} sx={{ py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
      >
        <Box>
          <Typography component="h3" sx={contentHeadingSx}>
            {team.name}
          </Typography>
          {isCreator(team) && (
            <Typography variant="caption" color="text.secondary">
              {t('settings.creator')}
            </Typography>
          )}
        </Box>
        <AvatarGroup component="div" max={6}>
          {team.members?.map((member) => (
            <Tooltip key={member.username} title={member.username}>
              <Avatar src={member.avatar} alt={member.username} />
            </Tooltip>
          ))}
        </AvatarGroup>
      </Stack>
      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<IconifyIcon icon="mdi:link-variant" />}
          onClick={() => handleCopy(team.code)}
        >
          {t('settings.linkToJoin')}
        </Button>
        {isCreator(team) && (
          <>
            <Button size="small" onClick={() => handleRefreshCode(team.code)} disabled={isBusy}>
              {t('settings.refreshLink')}
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => setPendingDeleteTeam(team)}
              disabled={isBusy}
            >
              {t('settings.deleteTeam')}
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );

  return (
    <>
      <SettingsSection title={t('settings.teams')}>
        {(isLoading || isBusy) && <LinearProgress sx={{ mb: 3 }} />}
        {loadError ? (
          <Alert
            severity="error"
            action={<Button onClick={() => mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        ) : data?.length ? (
          data.map(renderTeamCard)
        ) : (
          !isLoading && <Typography color="text.secondary">{t('settings.noTeams')}</Typography>
        )}
      </SettingsSection>
      <Box
        sx={{
          ...contentGridSx,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <SettingsSection title={t('settings.createTeam')}>
          <Stack direction="column" gap={2}>
            <TextField
              label={t('settings.teamName')}
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleCreateTeam}
              disabled={!teamName.trim() || isBusy}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('settings.create')}
            </Button>
          </Stack>
        </SettingsSection>
        <SettingsSection title={t('settings.joinTeam')}>
          <Stack direction="column" gap={2}>
            <TextField
              label={t('settings.teamCodeLabel')}
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
            />
            <Button
              variant="outlined"
              onClick={handleJoinTeam}
              disabled={!joinCode.trim() || isBusy}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('settings.join')}
            </Button>
          </Stack>
        </SettingsSection>
      </Box>

      <Dialog
        aria-labelledby="team-delete-title"
        open={Boolean(pendingDeleteTeam)}
        onClose={() => {
          if (!isDeleting) {
            setPendingDeleteTeam(null);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogHeader
          id="team-delete-title"
          title={t('settings.deleteTeam')}
          onClose={() => {
            if (!isDeleting) {
              setPendingDeleteTeam(null);
            }
          }}
          closeDisabled={isDeleting}
        />
        <DialogContent>
          <DialogContentText>
            {t('settings.confirmDeleteTeam', { name: pendingDeleteTeam?.name ?? '' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteTeam(null)} disabled={isDeleting}>
            {t('settings.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => void handleConfirmDeleteTeam()}
            disabled={isDeleting}
          >
            {t('settings.deleteTeam')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamsSection;
