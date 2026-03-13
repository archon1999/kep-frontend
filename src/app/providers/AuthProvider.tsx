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
import Splash from 'shared/components/loading/Splash';
import { removeItemFromStore } from 'shared/lib/utils';
import { useCurrentUser } from 'modules/authentication/application/queries';
import { useLogOutUser } from 'modules/authentication/application/mutations';
import type { AuthUser } from 'modules/authentication/domain/entities/auth.entity';

interface AuthContextInterface {
  currentUser: AuthUser | null;
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
    return <Splash />;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => use(AuthContext);

export default AuthProvider;
