import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '@mui/material';
import { ScrollSpyOffSet, useScrollSpyContext } from '.';

interface ScrollSpyContentInterface extends BoxProps<'div'> {
  id: string;
  offset?: ScrollSpyOffSet;
}

export const ScrollSpyContent = ({
  id,
  children,
  offset,
  ...rest
}: PropsWithChildren<ScrollSpyContentInterface>) => {
  const { sectionRefs } = useScrollSpyContext();

  return (
    <Box
      id={id}
      ref={(el) => {
        sectionRefs.current[id] = { element: el as HTMLElement, offset };
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

ScrollSpyContent.componentName = 'ScrollSpyContent';
export default ScrollSpyContent;
