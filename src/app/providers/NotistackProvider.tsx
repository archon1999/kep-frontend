import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

const NotistackProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};

export default NotistackProvider;
