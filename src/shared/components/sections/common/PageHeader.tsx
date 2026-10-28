import { ComponentProps, JSX, PropsWithChildren, ReactNode } from 'react';
import { Box, Paper, Stack, SxProps, Typography, styled, useTheme } from '@mui/material';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { pageHeaderStyles } from 'app/theme/styles/pageHeader';
import { coreSurfacePaperClassName } from 'app/theme/styles/surfaceTreatments';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import BackToListButton from './BackToListButton';

const HeroRoot = styled('div')(() => [{ display: 'contents' }, pageHeaderStyles]);

export const PageHeroPattern = ({ immersive = false }: { immersive?: boolean }) => (
  <HeroRoot>
    <Box
      className={`kep-page-hero-pattern${immersive ? ' kep-page-hero-pattern-immersive' : ''}`}
      aria-hidden="true"
    >
      {immersive && <Box className="kep-page-hero-pointer" />}
    </Box>
  </HeroRoot>
);

export const PageHeroSurface = ({
  children,
  className = '',
  element = 'header',
  ...props
}: ComponentProps<typeof PointerSpotlight>) => (
  <PointerSpotlight
    {...props}
    element={element}
    className={`kep-page-hero-interactive ${className}`}
  >
    <PageHeroPattern immersive />
    {children}
  </PointerSpotlight>
);

interface PageHeaderProps {
  title: string;
  variant?: 'standard' | 'hero' | 'detail';
  subtitle?: string;
  badge?: string;
  titleId?: string;
  backTo?: string;
  backLabel?: string;
  actionComponent?: JSX.Element;
  navigationComponent?: ReactNode;
  sx?: SxProps;
  paperSx?: SxProps;
}

const PageHeader = ({
  title,
  variant = 'standard',
  subtitle,
  badge,
  titleId,
  backTo,
  backLabel,
  actionComponent,
  navigationComponent,
  sx,
  paperSx,
}: PropsWithChildren<PageHeaderProps>) => {
  const { down } = useBreakpoints();
  const downLg = down('lg');
  const theme = useTheme();
  const isDetail = variant === 'detail' || variant === 'standard';
  const actions = backTo ? (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={1.5}
      sx={{ flexWrap: 'wrap', minWidth: 0, maxWidth: '100%' }}
    >
      <BackToListButton to={backTo} label={backLabel} />
      {actionComponent}
    </Stack>
  ) : (
    actionComponent
  );

  if (variant !== 'standard' || theme.preset === 'default')
    return (
      <HeroRoot>
        <Box
          component={isDetail ? 'header' : PageHeroSurface}
          className={`kep-page-hero${isDetail ? ' kep-page-detail' : ''}${navigationComponent ? ' kep-page-header-with-navigation' : ''}`}
          aria-labelledby={titleId}
          sx={[
            ...(Array.isArray(paperSx) ? paperSx : [paperSx]),
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          {isDetail && <PageHeroPattern />}
          <Box className="kep-page-hero-copy">
            {badge && (
              <Box component="span" className="kep-page-hero-badge">
                {badge}
              </Box>
            )}
            <Typography component="h1" variant="h1" id={titleId}>
              <MixedText>{title}</MixedText>
            </Typography>
            {subtitle && <Typography component="p">{subtitle}</Typography>}
          </Box>
          {actions && <Box className="kep-page-header-actions">{actions}</Box>}
          {navigationComponent && (
            <Box component="nav" className="kep-page-header-navigation" aria-labelledby={titleId}>
              {navigationComponent}
            </Box>
          )}
        </Box>
        <Box className="kep-page-hero-rule" aria-hidden="true" />
      </HeroRoot>
    );

  return (
    <Paper
      className={coreSurfacePaperClassName}
      sx={[{ px: { xs: 3, md: 5 }, py: 3 }, ...(Array.isArray(paperSx) ? paperSx : [paperSx])]}
    >
      <Stack
        sx={{
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'flex-end' },
          justifyContent: 'space-between',
          ...sx,
        }}
      >
        <div>
          <Typography
            component="h1"
            variant="h4"
            sx={[{ fontWeight: 500 }, downLg && { fontSize: 'h5.fontSize' }]}
          >
            {title}
          </Typography>
        </div>

        {actions}
      </Stack>
    </Paper>
  );
};

export default PageHeader;
