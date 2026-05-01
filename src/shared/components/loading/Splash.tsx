import { Box, Stack, StackOwnProps, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import Logo from 'shared/components/common/Logo.tsx';
import { cssVarRgba } from 'shared/lib/utils';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.35;
    transform: scale(0.92);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const Splash = (props: StackOwnProps) => {
  return (
    <Stack
      {...props}
      sx={[
        (theme) => ({
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          bgcolor: 'background.default',
          backgroundImage: [
            `radial-gradient(circle at 20% 18%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)} 0, transparent 28%)`,
            `radial-gradient(circle at 80% 10%, ${cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.1)} 0, transparent 24%)`,
            `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.9)} 0%, ${theme.vars.palette.background.default} 100%)`,
          ].join(','),
          'html[data-kep-color-scheme="dark"] &': {
            backgroundImage: [
              `radial-gradient(circle at 20% 18%, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24)} 0, transparent 28%)`,
              `radial-gradient(circle at 80% 10%, ${cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.18)} 0, transparent 24%)`,
              `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.background.paperChannel, 0.82)} 0%, ${theme.vars.palette.background.default} 100%)`,
            ].join(','),
          },
        }),
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(72px)',
          },
          '&::before': {
            top: '-8%',
            left: '-4%',
            width: 260,
            height: 260,
            backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14),
            'html[data-kep-color-scheme="dark"] &': {
              backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24),
            },
          },
          '&::after': {
            right: '-6%',
            bottom: '-10%',
            width: 300,
            height: 300,
            backgroundColor: cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.12),
            'html[data-kep-color-scheme="dark"] &': {
              backgroundColor: cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.18),
            },
          },
        })}
      >
      </Box>
      <Stack
        sx={(theme) => ({
          position: 'relative',
          zIndex: 1,
          alignItems: 'center',
          gap: 2.5,
          px: { xs: 3.5, sm: 5 },
          py: { xs: 4, sm: 5 },
          borderRadius: 6,
          border: `1px solid ${cssVarRgba(theme.vars.palette.dividerChannel, 0.72)}`,
          backgroundColor: cssVarRgba(theme.vars.palette.background.paperChannel, 0.88),
          backgroundImage: `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.42)} 0%, transparent 100%)`,
          boxShadow: `0 28px 80px -40px ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.28)}`,
          backdropFilter: 'blur(22px)',
          'html[data-kep-color-scheme="dark"] &': {
            border: `1px solid ${cssVarRgba(theme.vars.palette.dividerChannel, 0.88)}`,
            backgroundColor: cssVarRgba(theme.vars.palette.background.paperChannel, 0.76),
            backgroundImage: [
              `linear-gradient(180deg, ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.08)} 0%, transparent 44%)`,
              `linear-gradient(180deg, transparent 48%, ${cssVarRgba(theme.vars.palette.common.blackChannel, 0.18)} 100%)`,
            ].join(','),
            boxShadow: `0 28px 80px -40px ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.62)}`,
          },
        })}
      >
        <Box
          sx={(theme) => ({
            position: 'relative',
            width: 116,
            height: 116,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 5,
            background: `linear-gradient(145deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.12)} 0%, ${cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.08)} 100%)`,
            border: `1px solid ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.14)}`,
            animation: `${float} 3.6s ease-in-out infinite`,
            'html[data-kep-color-scheme="dark"] &': {
              background: `linear-gradient(145deg, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.32)} 0%, ${cssVarRgba(theme.vars.palette.secondary.mainChannel, 0.2)} 100%)`,
              border: `1px solid ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.3)}`,
            },
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'absolute',
              inset: 10,
              borderRadius: 4,
              border: `1px solid ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.35)}`,
              backgroundColor: cssVarRgba(theme.vars.palette.background.paperChannel, 0.92),
              'html[data-kep-color-scheme="dark"] &': {
                border: `1px solid ${cssVarRgba(theme.vars.palette.common.whiteChannel, 0.1)}`,
                backgroundColor: cssVarRgba(theme.vars.palette.background.paperChannel, 0.82),
              },
            })}
          />
          <Box sx={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
            <Logo showName={false} sx={{ width: 72, height: 72 }} />
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={(theme) => ({
            fontWeight: 800,
            letterSpacing: '-0.04em',
            background: `linear-gradient(100deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.light} 38%, ${theme.vars.palette.text.primary} 76%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          })}
        >
          KEP.uz
        </Typography>

        <Stack direction="row" spacing={0.75}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={(theme) => ({
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.vars.palette.primary.main,
                animation: `${pulse} 1.2s ease-in-out ${index * 0.16}s infinite`,
              })}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Splash;
