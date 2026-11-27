import { type FormEvent, useState } from 'react';
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
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { getApiErrorMessage } from 'shared/lib/apiError';
import { copyText } from 'shared/lib/clipboard';
import { toast } from 'sonner';
import SettingsSection from './SettingsSection';

const errorMessages = {
  create: 'settings.teamCreateFailed',
  join: 'settings.teamJoinFailed',
  refresh: 'settings.teamRefreshFailed',
  delete: 'settings.teamDeleteFailed',
} as const;

type TeamAction = keyof typeof errorMessages;

const TeamsSection = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const { data, isLoading, error: loadError, mutate } = useAccountTeams();
  const { trigger: createTeam } = useCreateTeam();
  const { trigger: joinTeam } = useJoinTeam();
  const { trigger: deleteTeam } = useDeleteTeam();
  const { trigger: refreshCode } = useRefreshTeamCode();
  const { isPending: isBusy, run } = useScopedAsyncTask(currentUser?.username ?? '');

  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [pendingDeleteTeam, setPendingDeleteTeam] = useState<AccountTeam | null>(null);
  const [actionError, setActionError] = useState<{
    action: TeamAction;
    message: string;
    teamId?: number;
  } | null>(null);

  const isDeleting = isBusy && pendingDeleteTeam !== null;

  const runTeamAction = <T,>(
    action: TeamAction,
    request: () => Promise<T>,
    onSuccess: (result: T) => void | Promise<void>,
    teamId?: number,
  ) => {
    if (isBusy) return;
    setActionError(null);
    void run(request, {
      onSuccess,
      onError: (error) =>
        setActionError({
          action,
          teamId,
          message: getApiErrorMessage(error, t(errorMessages[action])),
        }),
    });
  };

  const updateTeam = (updated: AccountTeam) =>
    mutate((current = []) =>
      current.some((team) => team.id === updated.id)
        ? current.map((team) => (team.id === updated.id ? updated : team))
        : [...current, updated],
    );

  const isCreator = (team: AccountTeam) => currentUser?.username === team.createrUsername;

  const handleCopy = async (code: string, trigger: HTMLButtonElement) => {
    const link = `${window.location.origin}${getResourceById(resources.TeamJoin, code)}`;
    if (await copyText(link, trigger)) {
      toast.success(t('settings.linkCopied'));
    } else {
      toast.error(t('common.copyFailed'));
    }
  };

  const handleCreateTeam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = teamName.trim();
    if (!name) return;
    runTeamAction('create', () => createTeam(name), async (team) => {
      await updateTeam(team);
      setTeamName((current) => (current.trim() === name ? '' : current));
    });
  };

  const handleJoinTeam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = joinCode.trim();
    if (!code) return;
    runTeamAction('join', () => joinTeam(code), async (team) => {
      await updateTeam(team);
      setJoinCode((current) => (current.trim() === code ? '' : current));
    });
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setPendingDeleteTeam(null);
    setActionError((error) => (error?.action === 'delete' ? null : error));
  };

  const handleConfirmDeleteTeam = () => {
    if (!pendingDeleteTeam) {
      return;
    }

    const { id, code } = pendingDeleteTeam;
    runTeamAction('delete', () => deleteTeam(code), async () => {
      await mutate((current = []) => current.filter((team) => team.id !== id));
      toast.success(t('settings.teamDeleted'));
      setPendingDeleteTeam(null);
    });
  };

  const handleRefreshCode = (team: AccountTeam) => {
    runTeamAction(
      'refresh',
      () => refreshCode(team.code),
      async (updated) => {
        await updateTeam(updated);
        toast.success(t('settings.saved'));
      },
      team.id,
    );
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
          disabled={isBusy}
          onClick={(event) => void handleCopy(team.code, event.currentTarget)}
        >
          {t('settings.linkToJoin')}
        </Button>
        {isCreator(team) && (
          <>
            <Button size="small" onClick={() => handleRefreshCode(team)} disabled={isBusy}>
              {t('settings.refreshLink')}
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => {
                setActionError(null);
                setPendingDeleteTeam(team);
              }}
              disabled={isBusy}
            >
              {t('settings.deleteTeam')}
            </Button>
          </>
        )}
      </Stack>
      {actionError?.action === 'refresh' && actionError.teamId === team.id && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {actionError.message}
        </Alert>
      )}
    </Box>
  );

  return (
    <>
      <SettingsSection title={t('settings.teams')}>
        {(isLoading || isBusy) && <LinearProgress sx={{ mb: 3 }} aria-label={t('common.loading')} />}
        {loadError && (
          <Alert
            severity="error"
            action={<Button onClick={() => mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        )}
        {data?.length ? (
          data.map(renderTeamCard)
        ) : (
          !isLoading && !loadError && (
            <Typography color="text.secondary">{t('settings.noTeams')}</Typography>
          )
        )}
      </SettingsSection>
      <Box
        sx={{
          ...contentGridSx,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <SettingsSection title={t('settings.createTeam')}>
          <Stack component="form" onSubmit={handleCreateTeam} direction="column" gap={2}>
            {actionError?.action === 'create' && <Alert severity="error">{actionError.message}</Alert>}
            <TextField
              label={t('settings.teamName')}
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={!teamName.trim() || isBusy}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('settings.create')}
            </Button>
          </Stack>
        </SettingsSection>
        <SettingsSection title={t('settings.joinTeam')}>
          <Stack component="form" onSubmit={handleJoinTeam} direction="column" gap={2}>
            {actionError?.action === 'join' && <Alert severity="error">{actionError.message}</Alert>}
            <TextField
              label={t('settings.teamCodeLabel')}
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
            />
            <Button
              variant="outlined"
              type="submit"
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
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogHeader
          id="team-delete-title"
          title={t('settings.deleteTeam')}
          onClose={closeDeleteDialog}
          closeDisabled={isDeleting}
        />
        <DialogContent aria-busy={isDeleting}>
          <DialogContentText>
            {t('settings.confirmDeleteTeam', { name: pendingDeleteTeam?.name ?? '' })}
          </DialogContentText>
          {actionError?.action === 'delete' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>
            {t('settings.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteTeam}
            aria-disabled={isDeleting}
            sx={{ '&[aria-disabled="true"]': { opacity: 0.65 } }}
          >
            {t('settings.deleteTeam')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamsSection;
