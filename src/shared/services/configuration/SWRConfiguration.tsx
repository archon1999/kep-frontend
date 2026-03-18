import { PropsWithChildren } from 'react';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { SWRConfig } from 'swr';

const GLOBAL_API_CACHE_TTL_MS = 5_000;

const SWRConfiguration = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: axiosFetcher,
        dedupingInterval: GLOBAL_API_CACHE_TTL_MS,
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfiguration;
