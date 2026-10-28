import {
  type PropsWithChildren,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';

// Mount once near the viewport, so lazy children do not import or fetch while off screen.
const DeferredContent = ({ children, fallback }: PropsWithChildren<{ fallback: ReactNode }>) => {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!host.current || visible) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={host} style={{ height: '100%' }}>
      {visible ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

export default DeferredContent;
