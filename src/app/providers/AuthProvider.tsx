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
import { removeItemFromStore } from 'shared/lib/utils';
import { useCurrentUser, useLogOutUser } from 'modules/authentication/application';
import type { AuthUser } from 'modules/authentication/domain';

interface AuthContextInterface {
  currentUser: AuthUser | null;
  isAuthLoading: boolean;
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

  const resolvedCurrentUser = currentUser ?? data ?? null;

  const refreshCurrentUser = useCallback(() => mutate(), [mutate]);

  const signout = useCallback(async () => {
    await logoutUser().catch(() => {});
    setCurrentUser(null);
    await mutate(null, { revalidate: false });
    removeItemFromStore('current_user');
  }, [logoutUser, mutate]);

  const isAuthLoading =
    currentUser === null && (isLoading || (data !== undefined && data !== null));

  const contextValue = useMemo(
    () => ({
      currentUser: resolvedCurrentUser,
      isAuthLoading,
      setCurrentUser,
      refreshCurrentUser,
      signout,
    }),
    [resolvedCurrentUser, isAuthLoading, refreshCurrentUser, signout],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => use(AuthContext);

export default AuthProvider;
