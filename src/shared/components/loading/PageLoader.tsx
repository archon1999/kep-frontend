'use client';

import { useEffect, useState } from 'react';
import { Box, Skeleton, Stack, StackOwnProps } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';

interface DelayedPageLoaderProps extends StackOwnProps {
  delay?: number;
}

const pageLoaderSx = {
  ...responsivePagePaddingSx,
  pt: { xs: 2, md: 4 },
  pb: { xs: 4, md: 6 },
  flex: 1,
  minHeight: ({ mixins }) => mixins.contentHeight(mixins.topbar.default),
};

const PageLoader = (props: StackOwnProps) => {
  return (
    <Stack {...props} sx={[pageLoaderSx, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
      <Stack direction="column" spacing={3} sx={{ width: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Box>
            <Skeleton variant="text" width={180} height={42} />
            <Skeleton variant="text" width={260} height={22} />
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
          >
            <Skeleton variant="rounded" width={96} height={36} />
            <Skeleton variant="rounded" width={118} height={36} />
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Skeleton variant="rounded" height={44} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={44} sx={{ width: { xs: 1, md: 180 } }} />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {[0, 1, 2, 3].map((item) => (
            <Stack
              key={item}
              spacing={1.5}
              sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}
            >
              <Skeleton variant="text" width="55%" height={28} />
              <Skeleton variant="text" width="92%" />
              <Skeleton variant="text" width="76%" />
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={72} height={28} />
                <Skeleton variant="rounded" width={96} height={28} />
              </Stack>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
};

export const DelayedPageLoader = ({ delay = 300, ...props }: DelayedPageLoaderProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShow(true), delay);

    return () => window.clearTimeout(timeout);
  }, [delay]);

  if (!show) {
    return (
      <Box
        aria-hidden
        sx={[
          pageLoaderSx,
          {
            p: 0,
          },
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
      />
    );
  }

  return <PageLoader {...props} />;
};

export default PageLoader;
