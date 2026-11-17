import type { PropsWithChildren } from 'react';
import { Box, Typography } from '@mui/material';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork, { type PatternArtworkKind } from 'shared/components/common/PatternArtwork';

const artwork: Record<string, PatternArtworkKind> = {
  schedule: 'daily-tasks',
  prizes: 'competitions',
  nominations: 'kepcoin',
  results: 'competitions',
  rules: 'writing',
};

export const EventSection = ({
  id,
  title,
  children,
}: PropsWithChildren<{ id: string; title: string }>) => (
  <Box component="section" id={id} className="event-section" aria-labelledby={`${id}-title`}>
    <div className="event-section-heading">
      <Typography component="h2" id={`${id}-title`}>
        <MixedText>{title}</MixedText>
      </Typography>
      {artwork[id] && (
        <PatternArtwork kind={artwork[id]} sx={{ width: 116, height: 72, opacity: 0.8 }} />
      )}
    </div>
    {children}
  </Box>
);
