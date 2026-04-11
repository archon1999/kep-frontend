import { ReactNode } from 'react';
import { Paper, Stack, Typography } from '@mui/material';

interface AdminFormSectionProps {
  title: string;
  children: ReactNode;
}

const AdminFormSection = ({ title, children }: AdminFormSectionProps) => (
  <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 1 }}>
    <Stack spacing={2.5}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Stack>
  </Paper>
);

export default AdminFormSection;
