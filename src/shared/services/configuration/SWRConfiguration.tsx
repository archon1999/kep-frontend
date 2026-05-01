import { PropsWithChildren } from 'react';
import { redirectDetailRouteToNotFound } from 'shared/lib/detailRouteNotFound';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import { SWRConfig } from 'swr';

const GLOBAL_API_CACHE_TTL_MS = 5_000;

const SWRConfiguration = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: axiosFetcher,
        dedupingInterval: GLOBAL_API_CACHE_TTL_MS,
        onError: (error) => {
          redirectDetailRouteToNotFound(error);
        },
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
