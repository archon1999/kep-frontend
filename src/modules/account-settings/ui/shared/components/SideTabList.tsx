import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TabList } from '@mui/lab';
import { Tab } from '@mui/material';
import { AccountSettingsTab } from 'modules/account-settings/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const SideTabList = ({
  tabs,
  onChange,
}: {
  tabs: AccountSettingsTab[];
  onChange: (event: SyntheticEvent, value: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <TabList
      orientation="vertical"
      onChange={onChange}
      aria-label={t('settings.navigation')}
      sx={{
        '& .MuiTabs-list': { gap: 0 },
        '& .MuiTabs-indicator': { left: 0, right: 'auto', width: 2 },
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          icon={<IconifyIcon icon={tab.icon} fontSize={19} />}
          iconPosition="start"
          label={tab.label}
          sx={{
            minHeight: 53,
            px: 3,
            justifyContent: 'flex-start',
            textAlign: 'left',
            fontSize: 14,
            fontWeight: 500,
            gap: 1.25,
            borderBottom: 1,
            borderColor: 'divider',
            color: 'text.secondary',
            '&.Mui-selected': { color: 'primary.main', bgcolor: 'action.selected' },
            '&:hover': { color: 'primary.main' },
          }}
        />
      ))}
    </TabList>
  );
};

export default SideTabList;
