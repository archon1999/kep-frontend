import { useTranslation } from 'react-i18next';
import { Alert, Box, Skeleton } from '@mui/material';
import EmptyState from 'shared/components/common/EmptyState';

interface HackathonAsyncStateProps {
  isLoading?: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingHeight?: number;
}

const HackathonAsyncState = ({
  isLoading,
  error,
  isEmpty,
  emptyTitle,
  emptyMessage,
  loadingHeight = 180,
}: HackathonAsyncStateProps) => {
  const { t } = useTranslation();
  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('hackathons.loadError')}</Alert>
      </Box>
    );
  if (isLoading) return <Skeleton variant="rounded" height={loadingHeight} />;
  if (!isEmpty) return null;

  return (
    <EmptyState
      kind="hackathon"
      title={emptyTitle ?? t('hackathons.emptyTitle')}
      description={emptyMessage}
    />
  );
};
export default HackathonAsyncState;
