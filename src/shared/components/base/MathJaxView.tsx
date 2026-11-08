import { FC, useEffect, useRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { clearMath, hasMathMarkup, typesetMath } from 'shared/lib/mathJax';
import { sanitizeRichHtml } from 'shared/lib/safeHtml';

interface MathJaxViewProps extends BoxProps {
  rawHtml: string | null | undefined;
}

const MathJaxView: FC<MathJaxViewProps> = ({ rawHtml, ...props }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // A new detached generation prevents a slow typeset from modifying newer
    // content or a Quill editor. Only this read-only subtree is ever typeset.
    const content = document.createElement('div');
    content.innerHTML = sanitizeRichHtml(rawHtml);
    ref.current.replaceChildren(content);
    let active = true;
    if (hasMathMarkup(rawHtml))
      void typesetMath(content, () => active && content.isConnected).catch(() => {});
    return () => {
      active = false;
      void clearMath(content);
    };
  }, [rawHtml]);

  return <Box ref={ref} {...props} />;
};

export default MathJaxView;
