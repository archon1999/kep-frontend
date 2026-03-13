import { PropsWithChildren } from 'react';
import { TabPanel } from '@mui/lab';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface AccountTabPanelProps extends PropsWithChildren {
  value: string;
  title: string;
  panelIcon?: string;
  description?: string;
  onOpenTabs?: () => void;
}

const AccountTabPanel = ({
  value,
  title,
  panelIcon,
  description,
  children,
  onOpenTabs,
}: AccountTabPanelProps) => (
  <TabPanel value={value} sx={{ p: 0 }}>
    <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        {onOpenTabs ? (
          <IconButton onClick={onOpenTabs} sx={{ display: { md: 'none' }, mr: -1 }}>
            <IconifyIcon
              icon="material-symbols:chevron-left-rounded"
              sx={{ fontSize: 20, color: 'neutral.main' }}
            />
          </IconButton>
        ) : null}

        {panelIcon ? (
          <IconifyIcon icon={panelIcon} sx={{ fontSize: 24, display: { xs: 'none', md: 'inline' } }} />
        ) : null}
        <Typography variant="h5">{title}</Typography>
      </Stack>
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Stack>
    <Box>{children}</Box>
  </TabPanel>
);

export default AccountTabPanel;
