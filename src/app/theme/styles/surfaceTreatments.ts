import { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import { BackgroundPattern } from 'app/config';
import { cssVarRgba } from 'shared/lib/utils';

export const coreSurfacePaperClassName = 'kep-surface-paper';

const mergeShadows = (...layers: Array<string | undefined>) => {
  return layers.filter((layer) => layer && layer !== 'none').join(', ') || 'none';
};

const getCanvasBeforeStyles = (theme: Theme, pattern: BackgroundPattern): CSSObject => {
  if (pattern === 'grid') {
    const lightDivider = cssVarRgba(theme.vars.palette.dividerChannel, 0.78);
    const darkDivider = cssVarRgba(theme.vars.palette.dividerChannel, 0.42);
    const lightGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14);
    const darkGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24);

    return {
      opacity: 0.78,
      backgroundImage: [
        `linear-gradient(${lightDivider} 1.5px, transparent 1.5px)`,
        `linear-gradient(90deg, ${lightDivider} 1.5px, transparent 1.5px)`,
        `radial-gradient(circle at 12% 18%, ${lightGlow} 0, transparent 26%)`,
      ].join(','),
      backgroundSize: '32px 32px, 32px 32px, auto',
      ...theme.applyStyles('dark', {
        opacity: 0.95,
        backgroundImage: [
          `linear-gradient(${darkDivider} 1.5px, transparent 1.5px)`,
          `linear-gradient(90deg, ${darkDivider} 1.5px, transparent 1.5px)`,
          `radial-gradient(circle at 12% 18%, ${darkGlow} 0, transparent 26%)`,
        ].join(','),
      }),
    };
  }

  if (pattern === 'dots') {
    const lightPattern = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14);
    const darkPattern = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.2);
    const lightGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14);
    const darkGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24);

    return {
      opacity: 0.8,
      backgroundImage: [
        `radial-gradient(circle, ${lightPattern} 1.55px, transparent 1.55px)`,
        `radial-gradient(circle at 78% 12%, ${lightGlow} 0, transparent 22%)`,
      ].join(','),
      backgroundSize: '18px 18px, auto',
      ...theme.applyStyles('dark', {
        opacity: 0.98,
        backgroundImage: [
          `radial-gradient(circle, ${darkPattern} 1.55px, transparent 1.55px)`,
          `radial-gradient(circle at 78% 12%, ${darkGlow} 0, transparent 22%)`,
        ].join(','),
      }),
    };
  }

  if (pattern === 'diagonal') {
    const lightPattern = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14);
    const darkPattern = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.2);
    const lightFade = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06);
    const darkFade = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12);

    return {
      opacity: 0.74,
      backgroundImage: [
        `repeating-linear-gradient(135deg, ${lightPattern} 0 2.5px, transparent 2.5px 18px)`,
        `linear-gradient(180deg, ${lightFade} 0%, transparent 38%)`,
      ].join(','),
      backgroundSize: '24px 24px, auto',
      ...theme.applyStyles('dark', {
        opacity: 0.96,
        backgroundImage: [
          `repeating-linear-gradient(135deg, ${darkPattern} 0 2.5px, transparent 2.5px 18px)`,
          `linear-gradient(180deg, ${darkFade} 0%, transparent 38%)`,
        ].join(','),
      }),
    };
  }

  if (pattern === 'mesh') {
    const lightDivider = cssVarRgba(theme.vars.palette.dividerChannel, 0.78);
    const darkDivider = cssVarRgba(theme.vars.palette.dividerChannel, 0.42);
    const lightGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14);
    const darkGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24);

    return {
      opacity: 0.88,
      backgroundImage: [
        `radial-gradient(circle at 20% 20%, ${lightGlow} 0, transparent 28%)`,
        `radial-gradient(circle at 80% 0%, ${lightGlow} 0, transparent 32%)`,
        `linear-gradient(${lightDivider} 1px, transparent 1px)`,
        `linear-gradient(90deg, ${lightDivider} 1px, transparent 1px)`,
      ].join(','),
      backgroundSize: 'auto, auto, 36px 36px, 36px 36px',
      ...theme.applyStyles('dark', {
        opacity: 1,
        backgroundImage: [
          `radial-gradient(circle at 20% 20%, ${darkGlow} 0, transparent 28%)`,
          `radial-gradient(circle at 80% 0%, ${darkGlow} 0, transparent 32%)`,
          `linear-gradient(${darkDivider} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${darkDivider} 1px, transparent 1px)`,
        ].join(','),
      }),
    };
  }

  return {
    opacity: 0,
    backgroundImage: 'none',
    backgroundSize: 'auto',
  };
};

const getCanvasAfterStyles = (theme: Theme, pattern: BackgroundPattern): CSSObject => {
  if (pattern === 'none') {
    return {
      opacity: 0,
      backgroundImage: 'none',
      backgroundSize: 'auto',
    };
  }

  return {
    opacity: 0.82,
    backgroundImage: [
      `radial-gradient(circle at top left, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.1)} 0, transparent 30%)`,
      `radial-gradient(circle at bottom right, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)} 0, transparent 28%)`,
    ].join(','),
    backgroundSize: 'auto',
    ...theme.applyStyles('dark', {
      opacity: 0.95,
      backgroundImage: [
        `radial-gradient(circle at top left, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.18)} 0, transparent 30%)`,
        `radial-gradient(circle at bottom right, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14)} 0, transparent 28%)`,
      ].join(','),
    }),
  };
};

export const getCanvasFrameStyles = (theme: Theme, pattern: BackgroundPattern): CSSObject => ({
  position: 'relative',
  isolation: 'isolate',
  backgroundColor: theme.vars.palette.background.default,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
    backgroundRepeat: 'repeat',
    backgroundPosition: 'top left',
    ...getCanvasBeforeStyles(theme, pattern),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
    backgroundRepeat: 'no-repeat',
    ...getCanvasAfterStyles(theme, pattern),
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
});

export const getSurfaceStyles = (theme: Theme, elevation: number = 0): CSSObject => {
  const baseShadow = typeof theme.shadows[elevation] === 'string' ? theme.shadows[elevation] : undefined;
  const primarySoft = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14);
  const primarySoftDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24);
  const primaryGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24);
  const primaryGlowDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.42);
  const cardTint = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08);
  const cardTintDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.18);
  const glassBackground = cssVarRgba(theme.vars.palette.background.paperChannel, 0.82);
  const glassBackgroundDark = cssVarRgba(theme.vars.palette.background.paperChannel, 0.68);
  const glassHighlight = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.48);
  const glassHighlightDark = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.1);
  const glassInset = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.5);
  const glassInsetDark = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.12);
  const glassTint = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08);
  const glassTintDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.22);
  const glassTintFarDark = cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.12);
  const glassOutline = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12);
  const glassOutlineDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.28);
  const glassShadow = cssVarRgba(theme.vars.palette.common.blackChannel, 0.14);
  const glassShadowDark = cssVarRgba(theme.vars.palette.common.blackChannel, 0.42);
  const glassDepthDark = cssVarRgba(theme.vars.palette.common.blackChannel, 0.18);
  const cornerAccent = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.55);
  const cornerAccentDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.75);
  const outlineGlowDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.7);
  const outlineInset = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.65);
  const outlineInsetDark = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.08);
  const gradientGlow = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12);
  const gradientGlowDark = cssVarRgba(theme.vars.palette.primary.mainChannel, 0.18);
  const gradientHighlight = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.42);
  const gradientHighlightDark = cssVarRgba(theme.vars.palette.common.whiteChannel, 0.06);

  return {
    position: 'relative',
    transition: theme.transitions.create(
      ['background-color', 'background-image', 'box-shadow', 'outline-color', 'backdrop-filter'],
      { duration: theme.transitions.duration.shorter },
    ),
    [`html[data-kep-card-style="outline"] &`]: {
      boxShadow: mergeShadows(
        baseShadow,
        `0 0 0 1px ${primarySoft}`,
        `0 18px 36px -30px ${primaryGlow}`,
      ),
      outlineColor: primarySoft,
    },
    [`html[data-kep-color-scheme="dark"][data-kep-card-style="outline"] &`]: {
      boxShadow: mergeShadows(
        baseShadow,
        `0 0 0 1px ${primarySoftDark}`,
        `0 18px 36px -30px ${primaryGlowDark}`,
      ),
      outlineColor: primarySoftDark,
    },
    [`html[data-kep-card-style="corners"] &`]: {
      boxShadow: mergeShadows(baseShadow, `0 0 0 1px ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.08)}`),
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        background: [
          `linear-gradient(90deg, ${cornerAccent}, transparent) top left / 30px 1px no-repeat`,
          `linear-gradient(180deg, ${cornerAccent}, transparent) top left / 1px 30px no-repeat`,
          `linear-gradient(270deg, ${cornerAccent}, transparent) top right / 30px 1px no-repeat`,
          `linear-gradient(180deg, ${cornerAccent}, transparent) top right / 1px 30px no-repeat`,
          `linear-gradient(90deg, ${cornerAccent}, transparent) bottom left / 30px 1px no-repeat`,
          `linear-gradient(0deg, ${cornerAccent}, transparent) bottom left / 1px 30px no-repeat`,
          `linear-gradient(270deg, ${cornerAccent}, transparent) bottom right / 30px 1px no-repeat`,
          `linear-gradient(0deg, ${cornerAccent}, transparent) bottom right / 1px 30px no-repeat`,
        ].join(','),
      },
    },
    [`html[data-kep-color-scheme="dark"][data-kep-card-style="corners"] &`]: {
      boxShadow: mergeShadows(baseShadow, `0 0 0 1px ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)}`),
      '&::before': {
        background: [
          `linear-gradient(90deg, ${cornerAccentDark}, transparent) top left / 30px 1px no-repeat`,
          `linear-gradient(180deg, ${cornerAccentDark}, transparent) top left / 1px 30px no-repeat`,
          `linear-gradient(270deg, ${cornerAccentDark}, transparent) top right / 30px 1px no-repeat`,
          `linear-gradient(180deg, ${cornerAccentDark}, transparent) top right / 1px 30px no-repeat`,
          `linear-gradient(90deg, ${cornerAccentDark}, transparent) bottom left / 30px 1px no-repeat`,
          `linear-gradient(0deg, ${cornerAccentDark}, transparent) bottom left / 1px 30px no-repeat`,
          `linear-gradient(270deg, ${cornerAccentDark}, transparent) bottom right / 30px 1px no-repeat`,
          `linear-gradient(0deg, ${cornerAccentDark}, transparent) bottom right / 1px 30px no-repeat`,
        ].join(','),
      },
    },
    [`html[data-kep-card-style="glow"] &`]: {
      boxShadow: mergeShadows(
        baseShadow,
        `0 16px 38px -26px ${primaryGlow}`,
        `inset 0 1px 0 ${outlineInset}`,
      ),
    },
    [`html[data-kep-color-scheme="dark"][data-kep-card-style="glow"] &`]: {
      boxShadow: mergeShadows(
        baseShadow,
        `0 16px 38px -26px ${outlineGlowDark}`,
        `inset 0 1px 0 ${outlineInsetDark}`,
      ),
    },
    [`html[data-kep-card-background="tint"] &`]: {
      backgroundImage: `linear-gradient(180deg, ${cardTint} 0%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.02)} 100%)`,
      outlineColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.16),
    },
    [`html[data-kep-color-scheme="dark"][data-kep-card-background="tint"] &`]: {
      backgroundImage: `linear-gradient(180deg, ${cardTintDark} 0%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.04)} 100%)`,
      outlineColor: primarySoftDark,
    },
    [`html[data-kep-card-background="gradient"] &`]: {
      backgroundImage: [
        `linear-gradient(135deg, ${gradientGlow} 0%, transparent 58%)`,
        `linear-gradient(180deg, ${gradientHighlight} 0%, transparent 100%)`,
      ].join(','),
      outlineColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.18),
    },
    [`html[data-kep-color-scheme="dark"][data-kep-card-background="gradient"] &`]: {
      backgroundImage: [
        `linear-gradient(135deg, ${gradientGlowDark} 0%, transparent 58%)`,
        `linear-gradient(180deg, ${gradientHighlightDark} 0%, transparent 100%)`,
        `linear-gradient(180deg, transparent 42%, ${glassDepthDark} 100%)`,
      ].join(','),
      outlineColor: glassOutlineDark,
    },
    [`html[data-kep-card-background="glass"] &`]: {
      backgroundColor: glassBackground,
      backgroundImage: [
        `linear-gradient(180deg, ${glassHighlight} 0%, transparent 52%)`,
        `radial-gradient(circle at top left, ${glassTint} 0, transparent 56%)`,
      ].join(','),
      backdropFilter: 'blur(18px) saturate(150%)',
      outlineColor: glassOutline,
      boxShadow: mergeShadows(
        baseShadow,
        `0 18px 38px -30px ${glassShadow}`,
        `inset 0 1px 0 ${glassInset}`,
      ),
    },
    [`html[data-kep-color-scheme="dark"][data-kep-card-background="glass"] &`]: {
      backgroundColor: glassBackgroundDark,
      backgroundImage: [
        `linear-gradient(180deg, ${glassHighlightDark} 0%, transparent 44%)`,
        `linear-gradient(180deg, transparent 38%, ${glassDepthDark} 100%)`,
        `radial-gradient(circle at top left, ${glassTintDark} 0, transparent 54%)`,
        `radial-gradient(circle at bottom right, ${glassTintFarDark} 0, transparent 62%)`,
      ].join(','),
      outlineColor: glassOutlineDark,
      boxShadow: mergeShadows(
        baseShadow,
        `0 24px 46px -32px ${glassShadowDark}`,
        `inset 0 1px 0 ${glassInsetDark}`,
      ),
    },
  };
};
