import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Snackbar, Stack } from '@mui/material';
import { initialConfig } from 'app/config.ts';
import { useCurrentUser, useLogOutUser } from 'modules/authentication/application';
import type { AuthUser } from 'modules/authentication/domain';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { removeItemFromStore } from 'shared/lib/utils';
import { SESSION_REQUIRED_EVENT } from 'shared/services/axios/session';
import { wsService } from 'shared/services/websocket';

interface AuthContextInterface {
  currentUser: AuthUser | null;
  isAuthLoading: boolean;
  authError: unknown;
  sessionExpired: boolean;
  setCurrentUser: Dispatch<SetStateAction<AuthUser | null>>;
  refreshCurrentUser: () => Promise<AuthUser | null | undefined>;
  signout: () => Promise<void>;
}

const avatar = (index: number) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;

export const demoUser: AuthUser = {
  id: 0,
  username: 'guest',
  email: 'guest@mail.com',
  name: 'Guest',
  avatar: avatar(14),
  designation: 'Merchant Captain',
};

export const AuthContext = createContext({} as AuthContextInterface);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sessionRecoveryRequired, setSessionExpired] = useState(false);
  const { t } = useTranslation();
  const redirectToLogin = useLoginRedirect();

  const {
    data,
    error: authError,
    isLoading,
    mutate,
  } = useCurrentUser({
    suspense: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const { trigger: logoutUser } = useLogOutUser();

  useEffect(() => {
    if (data) {
      setCurrentUser(data);
      setSessionExpired(false);
    }
  }, [data]);

  useEffect(() => {
    const requireSession = (event: Event) => {
      // SessionAuthentication also returns 403; confirm it against the profile.
      if ((event as CustomEvent<{ status: number }>).detail?.status !== 403)
        setSessionExpired(true);
      void mutate().catch(() => {});
    };
    window.addEventListener(SESSION_REQUIRED_EVENT, requireSession);
    return () => window.removeEventListener(SESSION_REQUIRED_EVENT, requireSession);
  }, [mutate]);

  const resolvedCurrentUser = currentUser ?? data ?? null;
  const sessionExpired = sessionRecoveryRequired || (data === null && currentUser !== null);

  const refreshCurrentUser = useCallback(async () => {
    const user = await mutate();
    if (user) setSessionExpired(false);
    return user;
  }, [mutate]);

  const signout = useCallback(async () => {
    await logoutUser().catch(() => {});
    setCurrentUser(null);
    setSessionExpired(false);
    await mutate(null, { revalidate: false });
    removeItemFromStore('current_user');
  }, [logoutUser, mutate]);

  const isAuthLoading =
    currentUser === null && (isLoading || (data !== undefined && data !== null));
  const isAuthenticated = Boolean(resolvedCurrentUser?.username) && !sessionExpired;

  useLayoutEffect(() => {
    wsService.setEnabled(isAuthenticated);

    return () => wsService.setEnabled(false);
  }, [isAuthenticated]);

  const contextValue = useMemo(
    () => ({
      currentUser: resolvedCurrentUser,
      isAuthLoading,
      authError,
      sessionExpired,
      setCurrentUser,
      refreshCurrentUser,
      signout,
    }),
    [resolvedCurrentUser, isAuthLoading, authError, sessionExpired, refreshCurrentUser, signout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {sessionExpired && resolvedCurrentUser && (
        <Snackbar open anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert
            severity="warning"
            sx={{ width: '100%', alignItems: 'center' }}
            action={
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
                <Button color="inherit" onClick={() => void refreshCurrentUser().catch(() => {})}>
                  {t('common.retry')}
                </Button>
                <Button color="inherit" onClick={() => redirectToLogin()}>
                  {t('common.session.signIn')}
                </Button>
              </Stack>
            }
          >
            {t('common.session.expired')}
          </Alert>
        </Snackbar>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => use(AuthContext);

export default AuthProvider;
