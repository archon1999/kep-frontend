'use client';

import { Box, BoxProps } from '@mui/material';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const pageLoaderSx = {
  ...responsivePagePaddingSx,
  pt: { xs: 2, md: 4 },
  pb: { xs: 4, md: 6 },
  flex: 1,
  minHeight: ({ mixins }) => mixins.contentHeight(mixins.topbar.default),
};

const PageLoader = (props: BoxProps) => (
  <Box
    {...props}
    aria-hidden
    sx={[pageLoaderSx, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
  />
);

export default PageLoader;
