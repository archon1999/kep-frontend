import { type PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

/** Size the viewport to actual rows, including wrapped translations and font preferences. */
const DashboardFeed = ({
  children,
  label,
  visibleItems = 5,
}: PropsWithChildren<{ label: string; visibleItems?: number }>) => {
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useLayoutEffect(() => {
    const element = content.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      const rows = Array.from(element.querySelectorAll<HTMLElement>('[data-feed-item]'));
      const last = rows[visibleItems - 1];
      setHeight(
        last
          ? Math.ceil(last.getBoundingClientRect().bottom - element.getBoundingClientRect().top)
          : undefined,
      );
    };
    measure();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [children, visibleItems]);
  return (
    <Box
      className="kep-dashboard-feed"
      role="region"
      aria-label={label}
      tabIndex={0}
      sx={{
        maxHeight: height,
        overflowY: 'auto',
        overscrollBehaviorY: 'contain',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--kep-line) transparent',
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 4 },
      }}
    >
      <div ref={content}>{children}</div>
    </Box>
  );
};

export default DashboardFeed;
