import { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface AdminFormSectionProps {
  title?: string;
  subheader?: string;
  children: ReactNode;
}

const AdminFormSection = ({ title, subheader, children }: AdminFormSectionProps) => (
  <Stack direction="column" spacing={2.5}>
    {title || subheader ? (
      <Box>
        {title ? (
          <Typography variant="h6" sx={{ mb: subheader ? 0.5 : 0 }}>
            {title}
          </Typography>
        ) : null}
        {subheader ? (
          <Typography variant="body2" color="text.secondary">
            {subheader}
          </Typography>
        ) : null}
      </Box>
    ) : null}

    <Stack direction="column" spacing={2.5}>
      {children}
    </Stack>
  </Stack>
);

export default AdminFormSection;
