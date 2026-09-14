'use client';

import { Box, BoxProps } from '@mui/material';
import DefaultLoader from './DefaultLoader';

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
    <DefaultLoader />
  </Box>
);

export default PageLoader;
