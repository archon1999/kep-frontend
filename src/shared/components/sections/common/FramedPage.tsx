import { PropsWithChildren } from 'react';
import { Box, keyframes, styled } from '@mui/material';
import { useNavContext } from 'app/layouts/main-layout/NavProvider';
import { listContentStyles, listFrameStyles } from 'app/theme/styles/listPage';

const Frame = styled(Box)(() => listFrameStyles);
const reveal = keyframes`from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); }`;
const Content = styled(Box)(() => ({
  ...listContentStyles,
  animation: `${reveal} 320ms ease-out both`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
}));

/** The shared page boundary, including the side rails and closing edge. */
const FramedPage = ({ children }: PropsWithChildren) => {
  const { topbarHeight } = useNavContext();
  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        minWidth: 0,
        height: theme.mixins.contentHeight(topbarHeight),
        overflowY: 'auto',
        scrollbarGutter: 'stable',
      })}
    >
      <Frame>
        <Content>{children}</Content>
      </Frame>
    </Box>
  );
};

export default FramedPage;
