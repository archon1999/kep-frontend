import { PropsWithChildren } from 'react';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { SWRConfig } from 'swr';


function createTTLCache(ttlMs: number) {
  const map = new Map();

  return {
    get(key: any) {
      const item = map.get(key);
      if (!item) return undefined;

      const { value, expiresAt } = item;

      if (Date.now() > expiresAt) {
        map.delete(key);
        return undefined;
      }

      return value;
    },
    set(key: any, value: any) {
      map.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
    },
    delete(key: any) {
      map.delete(key);
    },
    keys() {
      return map.keys();
    }
  };
}

const SWRConfiguration = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: axiosFetcher,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        provider: () => createTTLCache(1000 * 1660)
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfiguration;
