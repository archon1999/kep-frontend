import { ReactNode } from 'react';
import { Stack, SxProps, Theme, Typography } from '@mui/material';
import MixedText from './MixedText';
import PatternArtwork, { PatternArtworkKind } from './PatternArtwork';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  kind?: PatternArtworkKind;
  compact?: boolean;
  sx?: SxProps<Theme>;
}

const EmptyState = ({
  title,
  description,
  action,
  kind = 'empty',
  compact = false,
  sx,
}: EmptyStateProps) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    spacing={1.5}
    aria-live="polite"
    sx={[
      { px: 3, py: compact ? 3 : 5, minHeight: compact ? 220 : 300, textAlign: 'center' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <PatternArtwork kind={kind} sx={{ width: compact ? 180 : 240 }} />
    <Typography
      component="h2"
      variant="h5"
      sx={{ fontFamily: 'var(--kep-display-font)', fontWeight: 500 }}
    >
      <MixedText>{title}</MixedText>
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.65 }}>
        {description}
      </Typography>
    )}
    {action}
  </Stack>
);

export default EmptyState;
