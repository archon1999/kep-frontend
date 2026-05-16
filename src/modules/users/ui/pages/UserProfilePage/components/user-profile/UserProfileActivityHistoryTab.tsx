import { useParams } from 'react-router';
import { Card, CardContent, Stack } from '@mui/material';
import { useUserActivityHistory } from 'modules/home/application/queries';
import HomeActivityHistory from 'modules/home/ui/pages/HomePage/components/HomeActivityHistory';

interface UserProfileActivityHistoryTabProps {
  showTitle?: boolean;
}

const UserProfileActivityHistoryTab = ({
  showTitle = true,
}: UserProfileActivityHistoryTabProps) => {
  const { username = '' } = useParams();
  const { data, isLoading, isLoadingMore, hasMore, loadMore } = useUserActivityHistory(
    username,
    20,
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={2}>
          <HomeActivityHistory
            maxHeight={500}
            username={username}
            history={data ?? undefined}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            showTitle={showTitle}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserProfileActivityHistoryTab;
