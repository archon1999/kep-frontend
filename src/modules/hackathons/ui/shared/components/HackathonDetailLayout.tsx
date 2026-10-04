import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack } from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { type Hackathon } from 'modules/hackathons/domain';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import HackathonAsyncState from './HackathonAsyncState';
import HackathonPageHeader from './HackathonPageHeader';

interface HackathonDetailLayoutProps {
  hackathon?: Hackathon;
  isLoading?: boolean;
  error?: unknown;
  workspace?: boolean;
}

const HackathonDetailLayout = ({
  hackathon,
  isLoading,
  error,
  workspace = false,
  children,
}: PropsWithChildren<HackathonDetailLayoutProps>) => {
  const { topbarHeight } = useNavContext();
  const { t } = useTranslation();
  return (
    <Box
      data-hackathon-layout
      sx={(theme) => ({
        ...responsivePagePaddingSx,
        width: 1,
        minWidth: 0,
        ...(workspace && {
          height: theme.mixins.contentHeight(topbarHeight, theme.mixins.footer.sm),
          minHeight: { xs: 640, md: 600 },
        }),
      })}
    >
      <Stack
        direction="column"
        spacing={3}
        sx={workspace ? { height: 1, minHeight: 0 } : undefined}
      >
        {hackathon ? (
          <HackathonPageHeader hackathon={hackathon} />
        ) : isLoading ? (
          <Skeleton variant="rounded" height={140} />
        ) : null}
        {hackathon ? (
          <Box
            data-hackathon-content
            sx={{ minWidth: 0, ...(workspace && { flex: 1, minHeight: 0 }) }}
          >
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
};

export default HackathonDetailLayout;
