import { Box, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { BackgroundPattern, CardBackground, CardStyle } from 'app/config';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';

interface SurfacePreviewProps {
  pattern?: BackgroundPattern;
  cardStyle?: CardStyle;
  cardBackground?: CardBackground;
  hovered?: boolean;
  active?: boolean;
}

const getPatternStyles = (theme: Theme, pattern: BackgroundPattern, isDark: boolean) => {
  const primary = alpha(theme.palette.primary.main, isDark ? 0.28 : 0.18);
  const divider = alpha(theme.palette.divider, isDark ? 0.5 : 0.8);
  const glow = alpha(theme.palette.primary.main, isDark ? 0.26 : 0.14);

  switch (pattern) {
    case 'grid':
      return {
        opacity: 1,
        backgroundImage: [
          `linear-gradient(${divider} 1.4px, transparent 1.4px)`,
          `linear-gradient(90deg, ${divider} 1.4px, transparent 1.4px)`,
          `radial-gradient(circle at 15% 20%, ${glow} 0, transparent 24%)`,
        ].join(','),
        backgroundSize: '16px 16px, 16px 16px, auto',
      };
    case 'dots':
      return {
        opacity: 1,
        backgroundImage: [
          `radial-gradient(circle, ${primary} 1.45px, transparent 1.45px)`,
          `radial-gradient(circle at 80% 14%, ${glow} 0, transparent 22%)`,
        ].join(','),
        backgroundSize: '12px 12px, auto',
      };
    case 'diagonal':
      return {
        opacity: 1,
        backgroundImage: [
          `repeating-linear-gradient(135deg, ${primary} 0 1.8px, transparent 1.8px 11px)`,
          `linear-gradient(180deg, ${alpha(theme.palette.primary.main, isDark ? 0.14 : 0.08)} 0%, transparent 36%)`,
        ].join(','),
      };
    case 'mesh':
      return {
        opacity: 1,
        backgroundImage: [
          `radial-gradient(circle at 18% 18%, ${alpha(theme.palette.primary.main, isDark ? 0.26 : 0.18)} 0, transparent 22%)`,
          `radial-gradient(circle at 82% 10%, ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12)} 0, transparent 24%)`,
          `linear-gradient(${divider} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${divider} 1px, transparent 1px)`,
        ].join(','),
        backgroundSize: 'auto, auto, 18px 18px, 18px 18px',
      };
    default:
      return {
        opacity: 0,
        backgroundImage: 'none',
      };
  }
};

const getSurfaceStyles = (
  theme: Theme,
  cardStyle: CardStyle,
  cardBackground: CardBackground,
  emphasized: boolean,
  isDark: boolean,
) => {
  const primary = theme.palette.primary.main;
  const borderAlpha = isDark ? (emphasized ? 0.5 : 0.32) : emphasized ? 0.28 : 0.18;
  const base = {
    position: 'relative' as const,
    borderRadius: 1.75,
    minHeight: 18,
    border: `1px solid ${alpha(theme.palette.divider, borderAlpha)}`,
    backgroundColor: theme.vars.palette.background.menuElevation1,
    backgroundImage: 'none',
    transition: theme.transitions.create(['box-shadow', 'border-color', 'background-image'], {
      duration: theme.transitions.duration.shorter,
    }),
    boxShadow: emphasized
      ? `0 12px 22px -16px ${alpha(primary, isDark ? 0.42 : 0.35)}`
      : `0 8px 16px -18px ${alpha(theme.palette.common.black, isDark ? 0.42 : 0.2)}`,
  };

  const styleVariant =
    cardStyle === 'outline'
      ? {
          boxShadow: `${base.boxShadow}, 0 0 0 1px ${alpha(primary, isDark ? 0.26 : 0.18)}`,
        }
      : cardStyle === 'glow'
        ? {
            boxShadow: `${base.boxShadow}, 0 12px 24px -16px ${alpha(primary, isDark ? 0.58 : 0.45)}`,
          }
        : cardStyle === 'corners'
          ? {
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                pointerEvents: 'none',
                background: [
                  `linear-gradient(90deg, ${alpha(primary, 0.7)}, transparent) top left / 16px 1px no-repeat`,
                  `linear-gradient(180deg, ${alpha(primary, 0.7)}, transparent) top left / 1px 16px no-repeat`,
                  `linear-gradient(270deg, ${alpha(primary, 0.7)}, transparent) top right / 16px 1px no-repeat`,
                  `linear-gradient(180deg, ${alpha(primary, 0.7)}, transparent) top right / 1px 16px no-repeat`,
                  `linear-gradient(90deg, ${alpha(primary, 0.7)}, transparent) bottom left / 16px 1px no-repeat`,
                  `linear-gradient(0deg, ${alpha(primary, 0.7)}, transparent) bottom left / 1px 16px no-repeat`,
                  `linear-gradient(270deg, ${alpha(primary, 0.7)}, transparent) bottom right / 16px 1px no-repeat`,
                  `linear-gradient(0deg, ${alpha(primary, 0.7)}, transparent) bottom right / 1px 16px no-repeat`,
                ].join(','),
              },
            }
          : {};

  const backgroundVariant =
    cardBackground === 'tint'
      ? {
          backgroundImage: `linear-gradient(180deg, ${alpha(primary, isDark ? 0.2 : 0.15)} 0%, ${alpha(primary, 0.03)} 100%)`,
        }
      : cardBackground === 'gradient'
        ? {
            backgroundImage: [
              `linear-gradient(135deg, ${alpha(primary, isDark ? 0.24 : 0.18)} 0%, transparent 58%)`,
              `linear-gradient(180deg, ${alpha(theme.palette.common.white, isDark ? 0.05 : 0.48)} 0%, transparent 100%)`,
            ].join(','),
          }
        : cardBackground === 'glass'
          ? {
              backgroundColor: theme.vars.palette.background.paper,
              backgroundImage: [
                `linear-gradient(180deg, ${alpha(theme.palette.common.white, isDark ? 0.07 : 0.55)} 0%, transparent 100%)`,
                `radial-gradient(circle at top left, ${alpha(primary, isDark ? 0.24 : 0.14)} 0, transparent 58%)`,
              ].join(','),
              borderColor: alpha(primary, isDark ? 0.24 : 0.16),
              boxShadow: `${base.boxShadow}, inset 0 1px 0 ${alpha(theme.palette.common.white, isDark ? 0.08 : 0.55)}`,
              backdropFilter: 'blur(14px) saturate(150%)',
            }
          : {};

  return { ...base, ...styleVariant, ...backgroundVariant };
};

const SurfacePreview = ({
  pattern = 'none',
  cardStyle = 'default',
  cardBackground = 'default',
  hovered,
  active,
}: SurfacePreviewProps) => {
  const emphasized = !!active || !!hovered;
  const { isDark } = useResolvedThemeMode();

  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        width: 1,
        height: 1,
        borderRadius: 2.25,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, emphasized ? (isDark ? 0.54 : 0.92) : isDark ? 0.34 : 0.55)}`,
        background: `linear-gradient(180deg, ${theme.vars.palette.background.menuElevation1} 0%, ${theme.vars.palette.background.default} 100%)`,
        boxShadow:
          isDark
            ? `0 18px 32px -26px ${alpha(theme.palette.common.black, 0.7)}, inset 0 1px 0 ${alpha(theme.palette.common.white, 0.06)}`
            : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.7)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          ...getPatternStyles(theme, pattern, isDark),
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isDark ? 0.92 : 0.76,
          backgroundImage: [
            `radial-gradient(circle at 18% 16%, ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.08)} 0, transparent 24%)`,
            `radial-gradient(circle at 80% 88%, ${alpha(theme.palette.secondary.main, isDark ? 0.14 : 0.06)} 0, transparent 26%)`,
          ].join(','),
        },
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          zIndex: 1,
          height: 18,
          px: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.vars.palette.background.menu,
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDark ? 0.42 : 0.5)}`,
        })}
      >
        <Box
          sx={(theme) => ({
            width: 34,
            height: 4.5,
            borderRadius: 999,
            backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.38 : 0.24),
          })}
        />
        <Box
          sx={(theme) => ({
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, emphasized ? 0.75 : 0.55),
          })}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 1.25,
          display: 'grid',
          gap: 1,
        }}
      >
        <Box sx={(theme) => getSurfaceStyles(theme, cardStyle, cardBackground, emphasized, isDark)} />
        <Box
          sx={(theme) => ({
            ...getSurfaceStyles(theme, cardStyle, cardBackground, false, isDark),
            width: '74%',
          })}
        />
      </Box>
    </Box>
  );
};

export default SurfacePreview;
