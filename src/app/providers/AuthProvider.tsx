import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initialConfig } from 'app/config.ts';
import { useCurrentUser, useLogOutUser } from 'modules/authentication/application';
import type { AuthUser } from 'modules/authentication/domain';
import { removeItemFromStore } from 'shared/lib/utils';

interface AuthContextInterface {
  currentUser: AuthUser | null;
  setCurrentUser: Dispatch<SetStateAction<AuthUser | null>>;
  refreshCurrentUser: () => Promise<AuthUser | null | undefined>;
  signout: () => Promise<void>;
}

const avatar = (index: number) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;
const SPLASH_MIN_VISIBLE_MS = 1400;
const SPLASH_FADE_MS = 420;

const hideInitialSplash = () => {
  const splash = document.getElementById('loading-bg');
  if (!splash) return undefined;

  const splashStartedAt = (window as Window & { __kepSplashStartedAt?: number })
    .__kepSplashStartedAt;
  const elapsedMs = Date.now() - (splashStartedAt ?? Date.now());
  const remainingMs = Math.max(SPLASH_MIN_VISIBLE_MS - elapsedMs, 0);

  const timeoutId = window.setTimeout(() => {
    splash.classList.add('kep-splash-hidden');
    window.setTimeout(() => splash.remove(), SPLASH_FADE_MS);
  }, remainingMs);

  return () => window.clearTimeout(timeoutId);
};

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

  const { data, isLoading, mutate } = useCurrentUser({
    suspense: false,
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { trigger: logoutUser } = useLogOutUser();

  useEffect(() => {
    if (data !== undefined) {
      setCurrentUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (isLoading) return undefined;
    return hideInitialSplash();
  }, [isLoading]);

  const refreshCurrentUser = useCallback(() => mutate(), [mutate]);

  const signout = useCallback(async () => {
    await logoutUser().catch(() => {});
    setCurrentUser(null);
    removeItemFromStore('current_user');
  }, [logoutUser]);

  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      refreshCurrentUser,
      signout,
    }),
    [currentUser, refreshCurrentUser, signout],
  );

  if (isLoading && !currentUser) {
    return null;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => use(AuthContext);

export default AuthProvider;
