import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultAuthCredentials } from 'app/config.ts';
import { authPaths, rootPaths } from 'app/routes/route-config';
import { useLoginPage } from 'modules/authentication/application/hooks/useLoginPage';
import LoginForm, {
  type LoginFormValues,
} from 'shared/components/sections/authentications/default/LoginForm';
import { toast } from 'sonner';

const LoginPage = () => {
  const { setCurrentUser, refreshCurrentUser, navigate, location, searchParams, login } =
    useLoginPage();

  const { t } = useTranslation();

  const normalizeReturnUrl = useCallback((url?: string | null) => {
    const fallbackUrl = rootPaths.root;

    if (!url) {
      return fallbackUrl;
    }

    let sanitizedUrl = url.trim();
    if (!sanitizedUrl) {
      return fallbackUrl;
    }

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      const parsedUrl = new URL(sanitizedUrl, baseUrl);
      sanitizedUrl = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
      sanitizedUrl = sanitizedUrl.startsWith('/') ? sanitizedUrl : `/${sanitizedUrl}`;
    }

    if (sanitizedUrl.startsWith(authPaths.login)) {
      return fallbackUrl;
    }

    return sanitizedUrl;
  }, []);

  const returnUrl = useMemo(() => {
    const searchParamUrl = searchParams.get('returnUrl') ?? searchParams.get('next');
    const state = location.state as {
      from?: { pathname?: string; search?: string; hash?: string };
    } | null;
    const stateUrl = state?.from?.pathname
      ? `${state.from.pathname}${state.from.search ?? ''}${state.from.hash ?? ''}`
      : null;

    return normalizeReturnUrl(searchParamUrl ?? stateUrl);
  }, [location.state, normalizeReturnUrl, searchParams]);

  const handleLogin = async (data: LoginFormValues) => {
    try {
      const res = await login(data);

      if (res) {
        setCurrentUser(res);
        await refreshCurrentUser();

        const welcomeName = res.firstName || res.username || '';
        const welcomeText = welcomeName
          ? `${t('auth.greeting')}, ${welcomeName}!`
          : t('auth.loginSuccess');

        toast.success(welcomeText);

        navigate(returnUrl, { replace: true });
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || (error as Error)?.message || t('auth.loginError');
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getSocialLoginUrl = useCallback(
    (provider: 'google-oauth2' | 'github') => {
      const normalizedProvider = provider.endsWith('/') ? provider : `${provider}/`;

      return `/login/${normalizedProvider}?next=${encodeURIComponent(returnUrl)}`;
    },
    [returnUrl],
  );

  return (
    <LoginForm
      handleLogin={handleLogin}
      defaultCredential={defaultAuthCredentials ?? undefined}
      getSocialLoginUrl={getSocialLoginUrl}
    />
  );
};

export default LoginPage;
