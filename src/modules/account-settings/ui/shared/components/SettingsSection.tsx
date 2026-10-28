import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { contentInsetSx } from 'app/theme/styles/content';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

const SettingsSection = ({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description?: string }>) => (
  <Box component="section" sx={{ minWidth: 0, borderBottom: 1, borderColor: 'divider' }}>
    <SectionHeader title={title} description={description} />
    <Box sx={{ ...contentInsetSx, maxWidth: 960, '& > .MuiStack-root': { minWidth: 0 } }}>
      {children}
    </Box>
  </Box>
);

export default SettingsSection;
