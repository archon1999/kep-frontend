import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Alert, Box, Button } from '@mui/material';
import { contentInsetSx } from 'app/theme/styles/content';
import { useUserActivityHistory } from 'modules/home/application/queries';
import HomeActivityHistory from 'modules/home/ui/pages/HomePage/components/HomeActivityHistory';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

interface UserProfileActivityHistoryTabProps {
  showTitle?: boolean;
}

const UserProfileActivityHistoryTab = ({
  showTitle = true,
}: UserProfileActivityHistoryTabProps) => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const { data, error, mutate, isLoading, isLoadingMore, hasMore, loadMore } =
    useUserActivityHistory(username, 20);

  return (
    <Box>
      {showTitle && <SectionHeader title={t('homePage.activityHistory.title')} />}
      <Box sx={contentInsetSx}>
        {error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        ) : (
          <HomeActivityHistory
            maxHeight={720}
            username={username}
            history={data ?? undefined}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            showTitle={false}
            compact
          />
        )}
      </Box>
    </Box>
  );
};

export default UserProfileActivityHistoryTab;
