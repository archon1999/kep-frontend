import {
  CSSProperties,
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMediaQuery } from '@mui/material';
import MixedText from 'shared/components/common/MixedText';

export const ScrambleText = ({
  children,
  className = '',
  mixed = false,
}: {
  children: string;
  className?: string;
  mixed?: boolean;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [scrambled, setScrambled] = useState<string | null>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    const span = ref.current;
    const control = span?.closest('a,button');
    if (!span || !control || reduced) return;
    let frame = 0;
    const chars = Array.from(children);
    const stop = () => {
      cancelAnimationFrame(frame);
      setScrambled(null);
    };
    const play = (event: Event) => {
      if (event instanceof PointerEvent && event.pointerType === 'touch') return;
      stop();
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / 380);
        setScrambled(
          chars
            .map((char, i) =>
              /\s/.test(char) || i < Math.floor(progress * chars.length)
                ? char
                : '01/<>_+'[Math.floor(Math.random() * 7)],
            )
            .join(''),
        );
        if (progress < 1) frame = requestAnimationFrame(step);
        else stop();
      };
      frame = requestAnimationFrame(step);
    };
    control.addEventListener('pointerenter', play);
    control.addEventListener('focus', play);
    control.addEventListener('pointerleave', stop);
    control.addEventListener('blur', stop);
    control.addEventListener('click', stop);
    return () => {
      cancelAnimationFrame(frame);
      setScrambled(null);
      control.removeEventListener('pointerenter', play);
      control.removeEventListener('focus', play);
      control.removeEventListener('pointerleave', stop);
      control.removeEventListener('blur', stop);
      control.removeEventListener('click', stop);
    };
  }, [children, reduced]);
  return (
    <span className={`kep-scramble ${className}`}>
      <span className="kep-scramble-size">
        {mixed ? <MixedText>{children}</MixedText> : children}
      </span>
      <span ref={ref} aria-hidden="true" className="kep-scramble-visual">
        {mixed ? <MixedText>{scrambled ?? children}</MixedText> : (scrambled ?? children)}
      </span>
    </span>
  );
};

export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { delay?: number }>) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced || !('IntersectionObserver' in window)) return;
    element.classList.add('kep-reveal-pending');
    const reveal = () => element.classList.remove('kep-reveal-pending');
    element.addEventListener('focusin', reveal);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.classList.remove('kep-reveal-pending');
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener('focusin', reveal);
      element.classList.remove('kep-reveal-pending');
    };
  }, [reduced]);
  return (
    <div
      {...props}
      ref={ref}
      className={`kep-reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...props.style } as CSSProperties}
    >
      {children}
    </div>
  );
};

export const PointerSpotlight = ({
  children,
  className = '',
  element: Component = 'div',
  ...props
}: PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & { element?: 'div' | 'header' | 'section' }
>) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const box = element.getBoundingClientRect();
      x = event.clientX - box.left;
      y = event.clientY - box.top;
      if (!frame)
        frame = requestAnimationFrame(() => {
          element.style.setProperty('--pointer-x', `${x}px`);
          element.style.setProperty('--pointer-y', `${y}px`);
          frame = 0;
        });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      element.style.removeProperty('--pointer-x');
      element.style.removeProperty('--pointer-y');
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    return () => {
      leave();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
    };
  }, [reduced]);
  return (
    <Component {...props} ref={ref} className={`kep-spotlight ${className}`}>
      {children}
    </Component>
  );
};
