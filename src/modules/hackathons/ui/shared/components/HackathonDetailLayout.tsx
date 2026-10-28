import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack } from '@mui/material';
import { type Hackathon } from 'modules/hackathons/domain';
import FramedPage from 'shared/components/sections/common/FramedPage';
import HackathonAsyncState from './HackathonAsyncState';
import HackathonPageHeader from './HackathonPageHeader';

interface HackathonDetailLayoutProps {
  hackathon?: Hackathon;
  isLoading?: boolean;
  error?: unknown;
}

const HackathonDetailLayout = ({
  hackathon,
  isLoading,
  error,
  children,
}: PropsWithChildren<HackathonDetailLayoutProps>) => {
  const { t } = useTranslation();
  const content = (
    <Box data-hackathon-layout sx={{ width: 1, minWidth: 0 }}>
      <Stack direction="column" spacing={0}>
        {hackathon ? (
          <HackathonPageHeader hackathon={hackathon} />
        ) : isLoading ? (
          <Skeleton variant="rounded" height={140} />
        ) : null}
        {hackathon ? (
          <Box data-hackathon-content sx={{ minWidth: 0, p: 0 }}>
            {error ? <HackathonAsyncState error={error} /> : null}
            {children}
          </Box>
        ) : (
          <HackathonAsyncState
            isLoading={isLoading}
            error={error}
            isEmpty={!hackathon}
            emptyTitle={t('hackathons.unavailableTitle')}
            emptyMessage={t('hackathons.unavailableMessage')}
            loadingHeight={320}
          />
        )}
      </Stack>
    </Box>
  );
  return <FramedPage>{content}</FramedPage>;
};

export default HackathonDetailLayout;
