'use client';

import { Box, BoxProps, CircularProgress } from '@mui/material';

const pageLoaderSx = {
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  minHeight: '100dvh',
  width: 1,
};

const PageLoader = (props: BoxProps) => (
  <Box
    {...props}
    role="status"
    sx={[pageLoaderSx, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
  >
    <CircularProgress size={76} thickness={4} />
  </Box>
);

export default PageLoader;
