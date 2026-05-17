import { PropsWithChildren, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Link } from 'react-router';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const BackToListButtonContext = createContext<string | null>(null);

export const BackToListButtonProvider = ({
  listPath,
  children,
}: PropsWithChildren<{ listPath: string }>) => (
  <BackToListButtonContext.Provider value={listPath}>
    {children}
  </BackToListButtonContext.Provider>
);

const BackToListButton = () => {
  const { t } = useTranslation();
  const listPath = useContext(BackToListButtonContext);

  if (!listPath) {
    return null;
  }

  return (
    <Button
      component={Link}
      to={listPath}
      variant="soft"
      color="neutral"
      startIcon={<IconifyIcon icon="material-symbols:arrow-back-rounded" />}
    >
      {t('admin.actions.backToList')}
    </Button>
  );
};

export default BackToListButton;
