import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { toast } from 'sonner';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useCreateTeam, useJoinTeam, useRefreshTeamCode } from '../../application/mutations';
import { useAccountTeams } from '../../application/queries';
import type { AccountTeam } from '../../domain/entities/account-settings.entity';

const TeamsSection = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const { data, isLoading, mutate } = useAccountTeams();
  const { trigger: createTeam, isMutating: isCreating } = useCreateTeam();
  const { trigger: joinTeam, isMutating: isJoining } = useJoinTeam();
  const { trigger: refreshCode, isMutating: isRefreshing } = useRefreshTeamCode();

  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const isBusy = isCreating || isJoining || isRefreshing;

  useEffect(() => {
    if (!isBusy) {
      mutate();
    }
  }, [isBusy]);

  const isCreator = (team: AccountTeam) => currentUser?.username === team.createrUsername;

  const handleCopy = async (code: string) => {
    const link = `${window.location.origin}/team/${code}`;
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

  const handleRefreshCode = async (code: string) => {
    const updated = await refreshCode(code);
    toast.success(t('settings.saved'));
    await mutate();
    return updated;
  };

  const renderTeamCard = (team: AccountTeam) => (
    <Grid size={12} key={team.id}>
      <Card sx={{ outline: 'none', borderRadius: 3 }} background={2}>
        <CardHeader
          title={team.name}
          subheader={isCreator(team) ? t('settings.creator') : undefined}
        />
        <CardContent>
          <Stack direction="row" spacing={1.5}>
            <AvatarGroup>
              {team.members?.map((member) => (
                <Tooltip key={member.username} title={member.username}>
                  <Avatar src={member.avatar} alt={member.username} />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<IconifyIcon icon="material-symbols:content-copy-outline" />}
              onClick={() => handleCopy(team.code)}
            >
              {t('settings.linkToJoin')}
            </Button>
            {isCreator(team) ? (
              <Button
                size="small"
                startIcon={<IconifyIcon icon="material-symbols:refresh-rounded" />}
                onClick={() => handleRefreshCode(team.code)}
                disabled={isRefreshing}
              >
                {t('settings.refreshLink')}
              </Button>
            ) : null}
          </Stack>
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.teams')} />
      <CardContent>
        {(isLoading || isBusy) && <LinearProgress sx={{ mb: 3 }} />}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Stack direction="column" spacing={2}>
              {data?.length ? (
                data.map(renderTeamCard)
              ) : (
                <Typography color="text.secondary">{t('settings.noTeams')}</Typography>
              )}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Stack direction="column" spacing={2}>
              <Typography variant="h6">{t('settings.createTeam')}</Typography>
              <TextField
                label={t('settings.teamName')}
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
              />
              <Button variant="contained" onClick={handleCreateTeam} disabled={!teamName.trim()}>
                {t('settings.create')}
              </Button>

              <Typography variant="h6">{t('settings.joinTeam')}</Typography>
              <TextField
                label={t('settings.teamCodeLabel')}
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value)}
              />
              <Button variant="outlined" onClick={handleJoinTeam} disabled={!joinCode.trim()}>
                {t('settings.join')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeamsSection;
