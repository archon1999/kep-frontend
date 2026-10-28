import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '@mui/lab';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import MixedText from 'shared/components/common/MixedText';

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
}: AccountTabPanelProps) => {
  const { t } = useTranslation();
  return (
    <TabPanel value={value} sx={{ p: 0 }}>
      <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {onOpenTabs ? (
            <IconButton
              onClick={onOpenTabs}
              aria-label={t('pageTitles.accountSettings')}
              sx={{ display: { md: 'none' }, mr: -1 }}
            >
              <IconifyIcon
                icon="material-symbols:menu-rounded"
                sx={{ fontSize: 20, color: 'neutral.main' }}
              />
            </IconButton>
          ) : null}

          {panelIcon ? (
            <IconifyIcon
              icon={panelIcon}
              sx={{ fontSize: 24, display: { xs: 'none', md: 'inline' } }}
            />
          ) : null}
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontFamily: 'var(--kep-display-font)', fontWeight: 500 }}
          >
            <MixedText>{title}</MixedText>
          </Typography>
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
};

export default AccountTabPanel;
