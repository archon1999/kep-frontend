import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import useResolvedThemeMode from 'shared/hooks/useResolvedThemeMode';
import { Toaster } from 'sonner';

const NotistackProvider = ({ children }: PropsWithChildren) => {
  const { mode } = useResolvedThemeMode();
  const { t, i18n } = useTranslation();
  return (
    <>
      {children}
      <Toaster
        className="kep-toaster"
        theme={mode}
        dir={i18n.dir()}
        position="top-right"
        closeButton
        gap={12}
        offset={24}
        mobileOffset={16}
        containerAriaLabel={t('notifications.title')}
        toastOptions={{ closeButtonAriaLabel: t('common.close') }}
      />
    </>
  );
};

export default NotistackProvider;
