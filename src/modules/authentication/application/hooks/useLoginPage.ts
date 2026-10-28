import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useLoginUser } from 'modules/authentication/application';
import { toast } from 'sonner';

export const useLoginPage = () => {
  const { t } = useTranslation();

  const { setCurrentUser, refreshCurrentUser } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [searchParams] = useSearchParams();

  const { trigger: login } = useLoginUser();

  useEffect(() => {
    const socialAuthError = searchParams.get('socialAuthError');

    if (!socialAuthError) {
      return;
    }

    const messageKey = `auth.socialErrors.${socialAuthError}`;
    const fallbackMessage = t('auth.socialErrors.unknown');
    const message = t(messageKey, { defaultValue: fallbackMessage });

    toast.error(message);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('socialAuthError');
    nextParams.delete('backend');
    nextParams.delete('message');

    navigate(
      {
        pathname: location.pathname,
        search: nextParams.toString() ? `?${nextParams.toString()}` : '',
      },
      { replace: true },
    );
  }, [location.pathname, navigate, searchParams, t]);
  return { setCurrentUser, refreshCurrentUser, navigate, location, searchParams, login };
};
