import { apiEndpoints } from 'app/routes/route-config';
import axiosFetcher from 'shared/services/axios/axiosFetcher';

export const preferencesApiClient = {
  setLanguage: (language: string) =>
    axiosFetcher([
      apiEndpoints.setLanguage,
      {
        method: 'post',
        data: { language },
      },
    ]) as Promise<void>,
};
