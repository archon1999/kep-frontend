import { PropsWithChildren } from 'react';
import { Link as RouterLink } from 'react-router';
import { Button, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { ScrambleText, ScrollReveal } from 'shared/components/motion/InteractionEffects';

export const SectionAction = ({
  children,
  to,
  secondary = false,
}: PropsWithChildren<{ to: string; secondary?: boolean }>) => (
  <Button
    component={RouterLink}
    to={to}
    variant={secondary ? 'outlined' : 'contained'}
    color="primary"
    size="large"
    className="kep-cta"
    endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
  >
    <ScrambleText>{String(children)}</ScrambleText>
  </Button>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) => (
  <ScrollReveal className="kep-section-heading">
    <Typography
      component="div"
      variant="label"
      color="text.secondary"
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      <span className="kep-pixel-cross" aria-hidden="true" />
      {eyebrow}
    </Typography>
    <Typography component="h2" variant="h3" sx={{ mt: 1.5, mb: description ? 1.5 : 0 }}>
      <MixedText>{title}</MixedText>
    </Typography>
    {description && (
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    )}
  </ScrollReveal>
);
