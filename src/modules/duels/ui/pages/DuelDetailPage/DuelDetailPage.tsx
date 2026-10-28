import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useDuelDetailPage } from 'modules/duels/application/hooks/useDuelDetailPage';
import { Page404 } from 'modules/errors/ui/pages';
import EmptyState from 'shared/components/common/EmptyState';
import { WorkspaceRoot } from 'shared/components/sections/common/Workspace';
import { isNotFoundError } from 'shared/lib/detailRouteNotFound';
import DuelDetailPageHeader, { useDuelDetailPageHeaderState } from './DuelDetailPageHeader.tsx';
import DuelDetailPageWorkspace, {
  useDuelDetailPageWorkspaceState,
} from './DuelDetailPageWorkspace.tsx';
import DuelWorkspaceSkeleton from './components/DuelWorkspaceSkeleton';

const DuelDetailPage = () => {
  const { currentUser, duel, duelError, isLoading, isValidating, mutateDuel } = useDuelDetailPage();

  const { t } = useTranslation();

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

  if (isNotFoundError(duelError)) {
    return <Page404 />;
  }

  if (isLoading) return <DuelWorkspaceSkeleton />;

  if (!duel || !headerState || !workspaceState.workspaceProps) {
    return (
      <EmptyState
        kind="error"
        title={t('duels.error')}
        action={<Button onClick={() => void mutateDuel()}>{t('common.retry')}</Button>}
      />
    );
  }

  return (
    <WorkspaceRoot>
      <DuelDetailPageHeader
        {...headerState}
        hasCurrentUser={Boolean(currentUser)}
        hasCode={workspaceState.hasCode}
        isRunning={workspaceState.isRunning}
        isSubmitting={workspaceState.isSubmitting}
        isWorkspaceLocked={workspaceState.isWorkspaceLocked}
        isSubmitLocked={workspaceState.isSubmitLocked}
        onRun={workspaceState.onRun}
        onSubmit={workspaceState.onSubmit}
      />
      <DuelDetailPageWorkspace {...workspaceState.workspaceProps} />
    </WorkspaceRoot>
  );
};

export default DuelDetailPage;
