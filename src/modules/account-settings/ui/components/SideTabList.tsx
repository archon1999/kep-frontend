import { SyntheticEvent } from 'react';
import { TabList } from '@mui/lab';
import { Stack, Tab, Typography, styled, tabClasses, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { AccountSettingsTab } from './accountSettingsTabs';

interface SideTabListProps {
  tabs: AccountSettingsTab[];
  onChange: (event: SyntheticEvent, newValue: string) => void;
  onTabClick?: () => void;
}

const AccountTab = styled(Tab)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.vars?.palette.background.elevation2 ?? theme.palette.background.elevation2,
  color: theme.vars?.palette.text.primary ?? theme.palette.text.primary,
  minHeight: 56,
  '&:hover': {
    backgroundColor: theme.vars?.palette.background.elevation3 ?? theme.palette.background.elevation3,
  },
  '&.Mui-selected': {
    backgroundColor: theme.vars?.palette.background.elevation3 ?? theme.palette.background.elevation3,
    color: theme.vars?.palette.text.primary ?? theme.palette.text.primary,
  },
  [`& .${tabClasses.iconWrapper}`]: {
    color: theme.vars?.palette.text.secondary ?? theme.palette.text.secondary,
  },
  [`&.${tabClasses.selected} .${tabClasses.iconWrapper}`]: {
    color: theme.vars?.palette.primary.main ?? theme.palette.primary.main,
  },
}));

const SideTabList = ({ tabs, onChange, onTabClick }: SideTabListProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack direction="column" spacing={3} sx={responsivePagePaddingSx}>
      <Typography
        variant="h4"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: { xs: 'h5.fontSize', md: 'h6.fontSize', lg: 'h4.fontSize' },
        }}
      >
        <IconifyIcon
          icon="material-symbols:settings-outline"
          sx={{ fontSize: { xs: 22, lg: 24 } }}
        />
        {t('pageTitles.accountSettings')}
      </Typography>

      <TabList
        orientation="vertical"
        variant="scrollable"
        scrollButtons={false}
        onChange={onChange}
      >
        {tabs.map((tab) => (
          <AccountTab
            key={tab.id}
            value={tab.value}
            icon={
              <IconifyIcon
                icon={tab.icon}
                sx={{ fontSize: 24, flexShrink: 0 }}
              />
            }
            iconPosition="start"
            label={
              <Typography noWrap fontWeight={700} sx={{ textAlign: 'left' }}>
                {tab.label}
              </Typography>
            }
            onClick={() => {
              if (downMd) {
                onTabClick?.();
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ))}
      </TabList>
    </Stack>
  );
};

export default SideTabList;
