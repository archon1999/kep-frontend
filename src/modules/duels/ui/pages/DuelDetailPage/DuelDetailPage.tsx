import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useDuelDetail } from 'modules/duels/application/queries.ts';
import DuelDetailPageHeader, {
  useDuelDetailPageHeaderState,
} from './DuelDetailPageHeader.tsx';
import DuelDetailPageWorkspace, {
  useDuelDetailPageWorkspaceState,
} from './DuelDetailPageWorkspace.tsx';

const DuelDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const duelId = Number(id);
  const {
    data: duel,
    isLoading,
    isValidating,
    mutate: mutateDuel,
  } = useDuelDetail(Number.isNaN(duelId) ? undefined : duelId);

  useDocumentTitle(
    duel?.playerFirst?.username ? 'pageTitles.duel' : undefined,
    duel
      ? {
          playerFirstUsername: duel.playerFirst.username,
          playerSecondUsername: duel.playerSecond?.username ?? '',
        }
      : undefined,
  );

  const workspaceState = useDuelDetailPageWorkspaceState({
    duel,
    isLoading,
    isValidating,
    currentUser,
    mutateDuel,
  });
  const headerState = useDuelDetailPageHeaderState({
    duel,
    navigationProblems: workspaceState.navigationProblems,
  });

  if (isLoading) {
    return (
      <Box
        sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!duel || !headerState || !workspaceState.workspaceProps) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">{t('duels.error')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 1000,
        bgcolor: 'background.elevation1',
      }}
    >
      <DuelDetailPageHeader
        {...headerState}
        hasCurrentUser={Boolean(currentUser)}
        hasCode={workspaceState.hasCode}
        isRunning={workspaceState.isRunning}
        isSubmitting={workspaceState.isSubmitting}
        isWorkspaceLocked={workspaceState.isWorkspaceLocked}
        onRun={workspaceState.onRun}
        onSubmit={workspaceState.onSubmit}
      />
      <DuelDetailPageWorkspace {...workspaceState.workspaceProps} />
    </Box>
  );
};

export default DuelDetailPage;
