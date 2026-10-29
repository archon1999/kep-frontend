import type { AxiosRequestConfig } from 'axios';
import { axiosMutator } from 'shared/api/http/axiosMutator';
import { mapAdminFailure } from '../mappers/admin-error.mapper';

export const adminRequest = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosMutator<T>(config).catch((error) => {
    throw mapAdminFailure(error);
  });
