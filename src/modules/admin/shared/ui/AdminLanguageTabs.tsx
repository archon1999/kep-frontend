import { ReactNode, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';

export type AdminLanguageCode = 'uz' | 'en' | 'ru';

const languageCodes: AdminLanguageCode[] = ['uz', 'en', 'ru'];

interface AdminLanguageTabsProps {
  children: (language: AdminLanguageCode) => ReactNode;
}

const AdminLanguageTabs = ({ children }: AdminLanguageTabsProps) => {
  const { t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState<AdminLanguageCode>('uz');
  const tabs = useMemo(
    () =>
      languageCodes.map((language) => ({
        value: language,
        label: t(`admin.form.languages.${language}`),
        tabProps: {
          id: `admin-language-tab-${language}`,
        },
      })),
    [t],
  );

  return (
    <Box>
      <ResponsiveTabs
        value={activeLanguage}
        onChange={(value) => setActiveLanguage(value)}
        items={tabs}
        ariaLabel="admin language tabs"
        tabsProps={{
          variant: 'scrollable',
          allowScrollButtonsMobile: true,
          sx: { borderBottom: 1, borderColor: 'divider' },
        }}
      />
      <Box sx={{ pt: 3 }}>{children(activeLanguage)}</Box>
    </Box>
  );
};

export default AdminLanguageTabs;
