import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import type { LottieRefCurrentProps } from 'lottie-react';

const Lottie = lazy(() => import('lottie-react'));
export type KepperPose =
  | 'welcome'
  | 'thinking'
  | 'coding'
  | 'loading'
  | 'success'
  | 'celebrate'
  | 'coffee'
  | 'confused'
  | 'debug'
  | 'gg'
  | 'coin';
type Motion = 'static' | 'once' | 'loop';
const animations = new Map<string, Promise<Record<string, unknown>>>();

interface KepperProps {
  pose?: KepperPose;
  motion?: Motion;
  size?: number | { xs: number; sm?: number; md?: number };
}

/** Decorative mascot: meaningful status and actions remain in adjacent localized UI. */
const Kepper = ({ pose = 'welcome', motion = 'static', size = 100 }: KepperProps) => {
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<LottieRefCurrentProps>(null);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(!document.hidden);
  const [loaded, setLoaded] = useState<{ pose: string; data: Record<string, unknown> }>();
  const animated = motion !== 'static' && pose !== 'coin' && !reduceMotion;
  const base = `${import.meta.env.BASE_URL}mascot/kepper/${pose}`;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (container.current) observer.observe(container.current);
    const onVisibility = () => setForeground(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!animated || !visible) return;
    let active = true;
    if (!animations.has(base)) {
      animations.set(
        base,
        fetch(`${base}.json`).then((response) => {
          if (!response.ok) throw new Error('Mascot asset unavailable');
          return response.json();
        }),
      );
    }
    animations
      .get(base)
      ?.then((data) => {
        if (active) setLoaded({ pose, data });
      })
      .catch(() => {
        animations.delete(base);
      });
    return () => {
      active = false;
    };
  }, [animated, base, pose, visible]);

  useEffect(() => {
    if (visible && foreground) player.current?.play();
    else player.current?.pause();
  }, [visible, foreground, loaded]);

  const poster = (
    <Box
      component="img"
      src={`${base}.${pose === 'coin' ? 'webp' : 'png'}`}
      alt=""
      width={512}
      height={512}
      loading="lazy"
      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
  return (
    <Box
      ref={container}
      aria-hidden="true"
      data-kepper={pose}
      sx={{
        width: size,
        height: size,
        maxWidth: '100%',
        flexShrink: 0,
        pointerEvents: 'none',
        '& svg': { width: '100%', height: '100%' },
      }}
    >
      {animated && loaded?.pose === pose ? (
        <Suspense fallback={poster}>
          <Lottie
            key={pose}
            lottieRef={player}
            animationData={loaded.data}
            loop={motion === 'loop'}
            autoplay={visible && foreground}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      ) : (
        poster
      )}
    </Box>
  );
};

export default Kepper;
