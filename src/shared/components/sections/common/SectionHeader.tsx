import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { contentHeadingSx, contentInsetSx } from 'app/theme/styles/content';
import MixedText from 'shared/components/common/MixedText';

const SectionHeader = ({
  title,
  description,
  action,
  id,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}) => (
  <Stack
    direction="row"
    gap={2}
    alignItems="center"
    justifyContent="space-between"
    sx={{ ...contentInsetSx, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}
  >
    <Box sx={{ minWidth: 0 }}>
      <Typography component="h2" id={id} sx={contentHeadingSx}>
        <MixedText>{title}</MixedText>
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 640 }}>
          {description}
        </Typography>
      )}
    </Box>
    {action}
  </Stack>
);

export default SectionHeader;
