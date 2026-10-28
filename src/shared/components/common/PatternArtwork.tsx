import { useId } from 'react';
import { Box, SxProps, Theme, keyframes } from '@mui/material';

export type PatternArtworkKind =
  | 'activity'
  | 'empty'
  | 'search'
  | 'error'
  | 'auth'
  | 'loading'
  | 'settings'
  | 'notifications'
  | 'daily-tasks'
  | 'battles'
  | 'competitions'
  | 'more'
  | 'kepcoin'
  | 'profile'
  | 'language'
  | 'hackathon'
  | 'blog'
  | 'writing';

const breathe = keyframes`
  0%, 100% { opacity: .45; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-4px); }
`;
const scan = keyframes`
  from { transform: translateX(-120px); opacity: 0; }
  30%, 70% { opacity: .7; }
  to { transform: translateX(120px); opacity: 0; }
`;
const trace = keyframes`
  from { stroke-dashoffset: 1; opacity: 0; }
  to { stroke-dashoffset: 0; opacity: 1; }
`;

const outlines: Record<PatternArtworkKind, string> = {
  activity:
    'M72 48v120h184 M96 148v-28h24v28 M144 148v-48h24v48 M192 148V80h24v68 M88 100l44-28 32 12 56-40 M200 44h20v20',
  settings:
    'M88 64h144 M88 104h144 M88 144h144 M120 52h24v24h-24z M184 92h24v24h-24z M136 132h24v24h-24z',
  battles:
    'M76 64h48l20 36-20 36H76z M244 64h-48l-20 36 20 36h48z M92 84l16 16-16 16 M228 84l-16 16 16 16 M160 64l8 24 24 12-24 12-8 24-8-24-24-12 24-12z',
  competitions:
    'M136 40h48v28c0 32-48 32-48 0z M136 48h-16v20c0 16 20 16 20 16 M184 48h16v20c0 16-20 16-20 16 M160 92v20 M144 112h32 M72 168v-40h56v40 M128 168v-40h64v40 M192 168v-24h56v24 M64 168h192',
  more: 'M96 48h48v48H96z M176 48h48v48h-48z M96 128h48v48H96z M176 128h48v48h-48z M144 72h32 M120 96v32 M200 96v32 M144 152h32',
  kepcoin:
    'M88 72h144v96H88z M88 72V56h112v16 M200 104h48v40h-48z M212 124h12 M128 96v48 M152 96l-24 24 24 24 M120 120h40',
  profile:
    'M80 48h160v120H80z M160 72h24v24h-24z M144 120v-12h56v32h-56 M96 72h28 M96 88h16 M96 132h28 M96 148h104',
  language:
    'M160 44a60 60 0 1 0 0 120a60 60 0 1 0 0-120 M100 104h120 M112 68h96 M112 140h96 M160 44c-40 32-40 88 0 120 M160 44c40 32 40 88 0 120 M160 44v120',
  hackathon:
    'M72 52h176v112H72z M72 76h176 M88 64h4 M100 64h4 M112 64h4 M116 96l-20 20 20 20 M204 96l20 20-20 20 M172 92l-24 48 M56 100H40v40h16 M264 100h16v40h-16',
  blog: 'M88 52h104v108H88z M104 72h72v32h-72z M104 120h72 M104 136h48 M208 76h24v84h-24 M216 92h8 M216 108h8 M216 124h8 M216 140h8',
  writing:
    'M88 48h96v116H88z M104 72h56 M104 88h40 M104 140h32 M156 128l12-28 56-56 16 16-56 56z M168 100l16 16 M212 56l16 16',

  notifications:
    'M136 148h48 M148 160h24 M112 132h96l-12-20V84l-20-20h-32l-20 20v28z M152 64V52h16v12 M100 72l-12 12v28 M220 72l12 12v28 M236 48h12v12h-12z',
  'daily-tasks':
    'M104 48h112v112H104z M132 48v-8h56v16h-56z M120 80l8 8 16-16 M156 80h44 M120 112l8 8 16-16 M156 112h44 M120 140h16 M156 140h28 M228 120h12v40h-12z M248 100h12v60h-12z',
  empty: 'M100 65h44l12 12h64v67H100z M116 96h88 M116 112h60 M116 128h36',
  search: 'M120 56h56l20 20v48l-20 20h-56l-20-20V76z M188 136l38 38 M116 88h64 M116 104h40',
  error: 'M80 120h48V72h40v32h28 M220 104h32 M184 88l24 32 M208 88l-24 32 M80 108v24 M252 92v24',
  auth: 'M76 54h168v108H76z M76 78h168 M128 100l-16 16 16 16 M192 100l16 16-16 16 M168 96l-16 40',
  loading:
    'M80 80h160v48H80z M96 96h16v16H96z M128 96h16v16h-16z M160 96h16v16h-16z M192 96h16v16h-16z',
};

/** Vector artwork derived from the theme's grid, corner marks and cyan/sand accents. */
const PatternArtwork = ({
  kind = 'empty',
  sx,
}: {
  kind?: PatternArtworkKind;
  sx?: SxProps<Theme>;
}) => {
  const id = useId().replace(/:/g, '');
  return (
    <Box
      component="svg"
      viewBox="0 0 320 200"
      aria-hidden="true"
      focusable="false"
      sx={[
        {
          width: 280,
          maxWidth: '100%',
          height: 'auto',
          color: 'primary.main',
          flexShrink: 0,
          '& .kep-pattern-signal': {
            animation: `${breathe} 3.6s ease-in-out infinite`,
            transformOrigin: 'center',
          },
          '& .kep-pattern-scan': { animation: `${scan} 3.2s ease-in-out infinite` },
          '& .kep-pattern-outline': { animation: `${trace} 900ms ease-out backwards` },
          '@media (prefers-reduced-motion: reduce)': {
            '& .kep-pattern-signal, & .kep-pattern-scan, & .kep-pattern-outline': {
              animation: 'none',
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <defs>
        <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="1.5" height="1.5" fill="currentColor" opacity=".22" />
        </pattern>
        <linearGradient id={`${id}-ink`} x1="0" x2="1">
          <stop stopColor="var(--kep-logo-ice)" />
          <stop offset="1" stopColor="var(--kep-logo-sand)" />
        </linearGradient>
      </defs>
      <rect x="16" y="16" width="288" height="168" fill={`url(#${id}-dots)`} />
      <path
        d="M16 44V16h28 M276 16h28v28 M16 156v28h28 M276 184h28v-28"
        fill="none"
        stroke="currentColor"
        opacity=".25"
      />
      <path
        d="M48 100h24 M248 100h24 M160 28v16 M160 172v12"
        stroke="currentColor"
        strokeDasharray="2 4"
        opacity=".5"
      />
      <g className="kep-pattern-signal">
        <path
          className="kep-pattern-outline"
          pathLength={1}
          strokeDasharray={1}
          d={outlines[kind]}
          fill="none"
          stroke={`url(#${id}-ink)`}
          strokeWidth="2"
          strokeLinejoin="miter"
        />
        <rect x="76" y="50" width="4" height="4" fill="var(--kep-logo-sand)" />
        <rect x="240" y="158" width="4" height="4" fill="currentColor" />
      </g>
      <path
        className="kep-pattern-scan"
        d="M160 40v120"
        stroke="currentColor"
        strokeDasharray="2 6"
        opacity=".3"
      />
    </Box>
  );
};

export default PatternArtwork;
