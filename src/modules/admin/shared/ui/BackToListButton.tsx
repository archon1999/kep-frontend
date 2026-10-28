import { PropsWithChildren, createContext, useContext } from 'react';
import PageBackToListButton from 'shared/components/sections/common/BackToListButton';

const BackToListButtonContext = createContext<string | null>(null);

export const BackToListButtonProvider = ({
  listPath,
  children,
}: PropsWithChildren<{ listPath: string }>) => (
  <BackToListButtonContext.Provider value={listPath}>{children}</BackToListButtonContext.Provider>
);

const BackToListButton = () => {
  const listPath = useContext(BackToListButtonContext);

  if (!listPath) {
    return null;
  }

  return <PageBackToListButton to={listPath} />;
};

export default BackToListButton;
