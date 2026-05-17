import { ReactNode, SyntheticEvent, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type AdminLanguageCode = 'uz' | 'en' | 'ru';

const languageCodes: AdminLanguageCode[] = ['uz', 'en', 'ru'];

interface AdminLanguageTabsProps {
  children: (language: AdminLanguageCode) => ReactNode;
}

const AdminLanguageTabs = ({ children }: AdminLanguageTabsProps) => {
  const { t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState<AdminLanguageCode>('uz');

  const handleChange = (_event: SyntheticEvent, value: AdminLanguageCode) => {
    setActiveLanguage(value);
  };

  return (
    <Box>
      <Tabs
        value={activeLanguage}
        onChange={handleChange}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {languageCodes.map((language) => (
          <Tab
            key={language}
            id={`admin-language-tab-${language}`}
            value={language}
            label={t(`admin.form.languages.${language}`)}
          />
        ))}
      </Tabs>
      <Box sx={{ pt: 3 }}>{children(activeLanguage)}</Box>
    </Box>
  );
};

export default AdminLanguageTabs;
