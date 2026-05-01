import { FC, useEffect, useRef } from 'react';
import { Box, BoxProps } from '@mui/material';

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: Element[]) => Promise<void>;
      typesetClear?: (elements?: Element[]) => void;
    };
  }
}

interface MathJaxViewProps extends BoxProps {
  rawHtml: string | null | undefined;
}

const MathJaxView: FC<MathJaxViewProps> = ({ rawHtml, ...props }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = rawHtml ?? '';

    const mj = window.MathJax;

    if (!mj || !mj.typesetPromise) return;

    if (mj.typesetClear) {
      mj.typesetClear([ref.current]);
    }

    mj.typesetPromise([ref.current]).catch(() => {});
  }, [rawHtml]);

  return <Box ref={ref} {...props} />;
};

export default MathJaxView;
