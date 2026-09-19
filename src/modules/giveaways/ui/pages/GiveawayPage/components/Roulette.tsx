import { useLayoutEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, useMediaQuery } from '@mui/material';
import gsap from 'gsap';
import type { Giveaway } from '../../../../domain/entities/giveaway.types';
import { buildWheel } from '../../../../domain/utils/roulette';

const COLORS = ['#7655bc', '#315c8e', '#307b83', '#8e4d83', '#5555a0', '#936345'];
const CENTER = 250;
const RADIUS = 226;

function point(angle: number) {
  const radians = (angle * Math.PI) / 180;
  return `${CENTER + RADIUS * Math.cos(radians)} ${CENTER + RADIUS * Math.sin(radians)}`;
}

export default function Roulette({
  data,
  playing,
  onComplete,
}: {
  data: Giveaway;
  playing: boolean;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const rotor = useRef<HTMLDivElement>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { segments, rotation } = useMemo(
    () => buildWheel(data.participants, data.winner),
    [data.participants, data.winner],
  );
  const fontSize = Math.max(10, Math.min(17, 420 / segments.length));

  useLayoutEffect(() => {
    if (!rotor.current || !segments.length) return;
    const context = gsap.context(() => {
      gsap.set(rotor.current, { rotation: 0 });
      if (playing) {
        gsap.to(rotor.current, {
          rotation,
          duration: reducedMotion ? 0.3 : data.animationDurationMs / 1000,
          ease: 'power4.out',
          onComplete: () => complete.current(),
        });
      }
    });
    return () => context.revert();
  }, [playing, rotation, segments.length, data.animationDurationMs, reducedMotion]);

  return (
    <Box
      className="giveaway-wheel-stage"
      aria-label={t(playing ? 'giveaways.spinning' : 'giveaways.waiting')}
    >
      <Box className="giveaway-wheel">
        <svg className="giveaway-wheel-rim" viewBox="0 0 500 500" aria-hidden="true">
          <circle cx="250" cy="250" r="239" fill="none" stroke="#a78bfa45" />
          {Array.from({ length: 48 }, (_, index) => (
            <circle
              key={index}
              cx={250 + 239 * Math.cos((index * Math.PI) / 24)}
              cy={250 + 239 * Math.sin((index * Math.PI) / 24)}
              r="2.3"
              fill={index % 4 === 0 ? '#e3d7ff' : '#8b74b6'}
            />
          ))}
        </svg>
        <Box className="giveaway-wheel-pointer" aria-hidden="true" />
        {segments.length ? (
          <>
            <Box ref={rotor} className="giveaway-wheel-rotor" aria-hidden="true">
              <svg viewBox="0 0 500 500">
                {segments.map(({ person, angle, startAngle, endAngle }, index) => {
                  const flipped = angle > 90 && angle < 270;
                  const label = `@${person.username}`;
                  return (
                    <g key={person.id}>
                      <title>{label}</title>
                      {segments.length === 1 ? (
                        <circle cx="250" cy="250" r={RADIUS} fill={COLORS[0]} />
                      ) : (
                        <path
                          d={`M250 250 L${point(startAngle)} A${RADIUS} ${RADIUS} 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${point(endAngle)} Z`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff35"
                          strokeWidth="1"
                        />
                      )}
                      <g transform={`rotate(${flipped ? angle + 180 : angle} 250 250)`}>
                        <text
                          x={flipped ? 48 : 452}
                          y="250"
                          dominantBaseline="central"
                          textAnchor={flipped ? 'start' : 'end'}
                          fill="#fff"
                          fontSize={fontSize}
                          fontWeight="700"
                          textLength={label.length * fontSize * 0.62 > 146 ? 146 : undefined}
                          lengthAdjust="spacingAndGlyphs"
                        >
                          {label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </Box>
            <Box className="giveaway-wheel-hub" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="42%" fill="currentColor">
                <path d="m12 2 2.9 6.2 6.8.9-5 4.7 1.3 6.8-6-3.3-6 3.3 1.3-6.8-5-4.7 6.8-.9Z" />
              </svg>
            </Box>
          </>
        ) : (
          <Typography className="giveaway-wheel-empty">{t('giveaways.noEntriesYet')}</Typography>
        )}
      </Box>
    </Box>
  );
}
