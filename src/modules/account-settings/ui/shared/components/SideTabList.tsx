import { Stack, Typography, tabClasses } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { AccountSettingsTab } from 'modules/account-settings/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import { responsivePagePaddingSx } from 'shared/lib/styles.ts';

interface SideTabListProps {
  tabs: AccountSettingsTab[];
  activeValue: string;
  onChange: (newValue: string) => void;
  onTabClick?: () => void;
}

const SideTabList = ({ tabs, activeValue, onChange, onTabClick }: SideTabListProps) => {
  const { t } = useTranslation();

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

      <ResponsiveTabs
        value={activeValue}
        onChange={(value) => {
          onChange(value);
          onTabClick?.();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        ariaLabel="account settings tabs"
        items={tabs.map((tab) => ({
          value: tab.value,
          label: (
            <Typography noWrap fontWeight={700} sx={{ textAlign: 'left' }}>
              {tab.label}
            </Typography>
          ),
          selectLabel: tab.label,
          icon: <IconifyIcon icon={tab.icon} sx={{ fontSize: 24, flexShrink: 0 }} />,
          tabProps: {
            iconPosition: 'start',
          },
        }))}
        mobileBreakpoint="sm"
        tabsProps={{
          orientation: 'vertical',
          variant: 'scrollable',
          scrollButtons: false,
          sx: (theme) => ({
            '& .MuiTabs-list': {
              gap: 1,
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              justifyContent: 'flex-start',
              textTransform: 'none',
              p: 2,
              px: 3,
              borderRadius: Number(theme.shape.borderRadius) * 1.5,
              backgroundColor:
                theme.vars?.palette.background.elevation2 ?? theme.palette.background.elevation2,
              color: theme.vars?.palette.text.primary ?? theme.palette.text.primary,
              minHeight: 56,
              '&:hover': {
                backgroundColor:
                  theme.vars?.palette.background.elevation3 ?? theme.palette.background.elevation3,
              },
              '&.Mui-selected': {
                backgroundColor:
                  theme.vars?.palette.background.elevation3 ?? theme.palette.background.elevation3,
                color: theme.vars?.palette.text.primary ?? theme.palette.text.primary,
              },
              [`& .${tabClasses.iconWrapper}`]: {
                color: theme.vars?.palette.text.secondary ?? theme.palette.text.secondary,
              },
              [`&.${tabClasses.selected} .${tabClasses.iconWrapper}`]: {
                color: theme.vars?.palette.primary.main ?? theme.palette.primary.main,
              },
            },
          }),
        }}
      />
    </Stack>
  );
};

export default SideTabList;
