import { Card, CardContent, Stack } from '@mui/material';
import { useParams } from 'react-router';
import HomeActivityHistory from 'modules/home/ui/components/HomeActivityHistory';
import { useUserActivityHistory } from 'modules/home/application/queries';

const UserProfileActivityHistoryTab = () => {
  const { username = '' } = useParams();
  const { data, isLoading, isLoadingMore, hasMore, loadMore } = useUserActivityHistory(username, 20);

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
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserProfileActivityHistoryTab;
