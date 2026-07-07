import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { keyframes, useTheme } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';

const KEP_BIRTHDAY_MONTH = 7;
const KEP_BIRTHDAY_DAY = 7;
const TASHKENT_TIME_ZONE = 'Asia/Tashkent';
const EXIT_ANIMATION_MS = 420;
const AUTO_DISMISS_MS = 7600;

const confettiColors = ['#2f80ed', '#00b894', '#f2c94c', '#eb5757', '#9b51e0', '#56ccf2'];

const confettiPieces = Array.from({ length: 58 }, (_, index) => ({
  id: index,
  left: (index * 17) % 100,
  delay: (index % 13) * 0.22,
  duration: 4.8 + (index % 7) * 0.28,
  rotate: (index * 37) % 180,
  width: 7 + (index % 4) * 2,
  height: 10 + (index % 5) * 3,
  color: confettiColors[index % confettiColors.length],
}));

const balloonColors = ['#2f80ed', '#f2994a', '#00b894', '#eb5757', '#9b51e0'];

const balloonItems = balloonColors.map((color, index) => ({
  id: color,
  color,
  left: [8, 24, 68, 82, 92][index],
  top: [24, 70, 18, 58, 34][index],
  delay: index * 0.35,
  scale: [0.88, 0.72, 0.86, 0.7, 0.78][index],
}));

const overlayEnter = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const overlayExit = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const panelEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const confettiFall = keyframes`
  0% {
    transform: translate3d(0, -12vh, 0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate3d(28px, 112vh, 0) rotate(680deg);
    opacity: 0.88;
  }
`;

const balloonFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-18px) rotate(3deg);
  }
`;

const logoPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(47, 128, 237, 0.24);
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 0 0 18px rgba(47, 128, 237, 0);
  }
`;

type BirthdayRuntimeStatus = 'idle' | 'active' | 'done';

let birthdayRuntimeStatus: BirthdayRuntimeStatus = 'idle';

const getTashkentDateParts = () => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TASHKENT_TIME_ZONE,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).formatToParts(new Date());

    const getPart = (type: string) => Number(parts.find((part) => part.type === type)?.value);

    return {
      year: getPart('year'),
      month: getPart('month'),
      day: getPart('day'),
    };
  } catch {
    const now = new Date();

    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }
};

const getBirthdaySessionKey = (year: number) => `kep:birthday-effect:${year}`;

const canUseSessionStorage = () => {
  try {
    return typeof window !== 'undefined' && Boolean(window.sessionStorage);
  } catch {
    return false;
  }
};

const KepBirthdayEffect = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dismissTimerRef = useRef<number | undefined>(undefined);
  const exitTimerRef = useRef<number | undefined>(undefined);

  const shouldRenderMotion = visible && !reduceMotion;

  const dismiss = useCallback(() => {
    if (birthdayRuntimeStatus === 'done') {
      return;
    }

    birthdayRuntimeStatus = 'done';
    window.clearTimeout(dismissTimerRef.current);
    window.clearTimeout(exitTimerRef.current);
    setLeaving(true);

    exitTimerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, EXIT_ANIMATION_MS);
  }, []);

  useEffect(() => {
    if (birthdayRuntimeStatus === 'done') {
      return undefined;
    }

    if (birthdayRuntimeStatus === 'active') {
      setVisible(true);
      return undefined;
    }

    const { year, month, day } = getTashkentDateParts();
    const isBirthdayToday = month === KEP_BIRTHDAY_MONTH && day === KEP_BIRTHDAY_DAY;

    if (!isBirthdayToday) {
      return undefined;
    }

    const sessionKey = getBirthdaySessionKey(year);

    if (canUseSessionStorage() && window.sessionStorage.getItem(sessionKey)) {
      return undefined;
    }

    birthdayRuntimeStatus = 'active';
    setVisible(true);

    if (canUseSessionStorage()) {
      window.sessionStorage.setItem(sessionKey, 'shown');
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    dismissTimerRef.current = window.setTimeout(dismiss, reduceMotion ? 5200 : AUTO_DISMISS_MS);

    return () => {
      window.clearTimeout(dismissTimerRef.current);
    };
  }, [dismiss, reduceMotion, visible]);

  useEffect(
    () => () => {
      window.clearTimeout(dismissTimerRef.current);
      window.clearTimeout(exitTimerRef.current);
    },
    [],
  );

  const portalTarget = useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    return document.body;
  }, []);

  if (!visible || !portalTarget) {
    return null;
  }

  return createPortal(
    <Box
      role="presentation"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.tooltip + 20,
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, sm: 3 },
        py: 3,
        overflow: 'hidden',
        color: '#fff',
        background:
          'linear-gradient(135deg, rgba(7, 12, 24, 0.82), rgba(13, 28, 56, 0.64) 48%, rgba(47, 128, 237, 0.4))',
        backdropFilter: 'blur(10px)',
        animation: `${leaving ? overlayExit : overlayEnter} ${EXIT_ANIMATION_MS}ms ease forwards`,
      }}
      onClick={dismiss}
    >
      {shouldRenderMotion &&
        confettiPieces.map((piece) => (
          <Box
            key={piece.id}
            sx={{
              position: 'absolute',
              top: 0,
              left: `${piece.left}%`,
              width: piece.width,
              height: piece.height,
              borderRadius: piece.id % 3 === 0 ? '50%' : '2px',
              backgroundColor: piece.color,
              opacity: 0,
              transform: `rotate(${piece.rotate}deg)`,
              animation: `${confettiFall} ${piece.duration}s linear ${piece.delay}s infinite`,
            }}
          />
        ))}

      {shouldRenderMotion &&
        balloonItems.map((balloon) => (
          <Box
            key={balloon.id}
            sx={{
              position: 'absolute',
              left: `${balloon.left}%`,
              top: `${balloon.top}%`,
              width: 42,
              height: 54,
              borderRadius: '50% 50% 46% 46%',
              background: `linear-gradient(145deg, rgba(255, 255, 255, 0.42), ${balloon.color} 42%, ${balloon.color})`,
              opacity: 0.78,
              transform: `scale(${balloon.scale})`,
              animation: `${balloonFloat} 4.8s ease-in-out ${balloon.delay}s infinite`,
              '&::after': {
                content: '""',
                position: 'absolute',
                left: '50%',
                bottom: -56,
                width: 1,
                height: 58,
                backgroundColor: 'rgba(255, 255, 255, 0.42)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '50%',
                bottom: -7,
                width: 10,
                height: 8,
                borderRadius: '0 0 8px 8px',
                backgroundColor: balloon.color,
                transform: 'translateX(-50%)',
              },
            }}
          />
        ))}

      <Stack
        onClick={(event) => event.stopPropagation()}
        sx={(muiTheme) => ({
          position: 'relative',
          width: 'min(520px, 100%)',
          minHeight: { xs: 330, sm: 360 },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 2.5, sm: 3 },
          px: { xs: 3, sm: 5 },
          py: { xs: 4.5, sm: 5.5 },
          overflow: 'hidden',
          textAlign: 'center',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.32)',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.35)',
          animation: reduceMotion
            ? undefined
            : `${panelEnter} 520ms cubic-bezier(0.22, 1, 0.36, 1) both`,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 18% 20%, rgba(242, 201, 76, 0.22), transparent 30%), radial-gradient(circle at 82% 6%, rgba(86, 204, 242, 0.2), transparent 26%)',
            pointerEvents: 'none',
          },
          [muiTheme.breakpoints.down('sm')]: {
            minHeight: 310,
          },
        })}
      >
        <IconButton
          aria-label={t('common.close')}
          onClick={dismiss}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: 'rgba(255, 255, 255, 0.86)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <IconifyIcon icon="material-symbols:close-rounded" width={22} height={22} />
        </IconButton>

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: { xs: 104, sm: 122 },
            height: { xs: 104, sm: 122 },
            display: 'grid',
            placeItems: 'center',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.34)',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            animation: reduceMotion ? undefined : `${logoPulse} 2.6s ease-in-out infinite`,
            '& a': {
              pointerEvents: 'none',
            },
          }}
        >
          <Logo showName={false} sx={{ width: { xs: 72, sm: 86 }, height: { xs: 72, sm: 86 } }} />
        </Box>

        <Stack sx={{ position: 'relative', zIndex: 1, gap: 1.25, alignItems: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              maxWidth: 440,
              color: '#fff',
              fontWeight: 900,
              lineHeight: 1.04,
              letterSpacing: 0,
              fontSize: { xs: '2.15rem', sm: '3rem' },
              textShadow: '0 10px 30px rgba(0, 0, 0, 0.28)',
            }}
          >
            {t('common.birthdayEffect.title')}
          </Typography>

          <Typography
            sx={{
              maxWidth: 380,
              color: 'rgba(255, 255, 255, 0.82)',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              lineHeight: 1.55,
              fontWeight: 600,
            }}
          >
            {t('common.birthdayEffect.subtitle')}
          </Typography>
        </Stack>
      </Stack>
    </Box>,
    portalTarget,
  );
};

export default KepBirthdayEffect;
