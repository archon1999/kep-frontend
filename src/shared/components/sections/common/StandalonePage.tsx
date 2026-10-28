import { PropsWithChildren } from 'react';
import { Box, Paper } from '@mui/material';

/** Full viewport frame for authentication and recovery screens without navigation. */
const StandalonePage = ({
  children,
  maxWidth = 1120,
}: PropsWithChildren<{ maxWidth?: number }>) => (
  <Box
    component="main"
    sx={{
      minHeight: '100dvh',
      display: 'grid',
      alignItems: 'center',
      p: { xs: 2, sm: 4, lg: 6 },
      bgcolor: 'background.default',
    }}
  >
    <Paper
      variant="panel"
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
        backgroundColor: 'background.default',
        '&::after': { opacity: 0 },
      }}
    >
      {children}
    </Paper>
  </Box>
);

export default StandalonePage;
