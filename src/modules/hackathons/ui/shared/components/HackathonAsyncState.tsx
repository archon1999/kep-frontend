import { useTranslation } from 'react-i18next';
import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';

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
  if (error) return <Alert severity="error">{t('hackathons.loadError')}</Alert>;
  if (isLoading) return <Skeleton variant="rounded" height={loadingHeight} />;
  if (!isEmpty) return null;

  return (
    <Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
      <Stack direction="column" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          {emptyTitle ?? t('hackathons.emptyTitle')}
        </Typography>
        {emptyMessage ? (
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

export default HackathonAsyncState;
