import axios, { type AxiosInstance, type AxiosRequestHeaders, type InternalAxiosRequestConfig } from 'axios';
import i18n from 'app/locales/i18n.ts';

const baseURL = import.meta.env.VITE_API_URL || '';
const basicAuthLogin = import.meta.env.VITE_BASIC_AUTH_LOGIN;
const basicAuthPassword = import.meta.env.VITE_BASIC_AUTH_PASSWORD;
const shouldUseBasicAuth = import.meta.env.DEV;

const djangoLanguageMap: Record<string, 'en' | 'ru' | 'uz'> = {
  enUS: 'en',
  ruRU: 'ru',
  uzUZ: 'uz',
};

const getBasicAuthHeader = () => {
  if (!basicAuthLogin || !basicAuthPassword) return null;

  const encodedCredentials = btoa(`${basicAuthLogin}:${basicAuthPassword}`);

  return `Basic ${encodedCredentials}`;
};

export const instance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers: AxiosRequestHeaders = config.headers ?? {};
    const params = config.params ?? {};
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    const djangoLanguage = djangoLanguageMap[i18n.language as keyof typeof djangoLanguageMap] ?? 'en';
    headers['Django-Language'] = djangoLanguage;
    params.django_language = djangoLanguage;

    if (isFormData) {
      delete headers['Content-Type'];
    } else if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (shouldUseBasicAuth) {
      const basicAuthHeader = getBasicAuthHeader();

      if (basicAuthHeader) {
        headers.Authorization = basicAuthHeader;
      }
    }

    config.headers = headers;
    config.params = params;

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject({
      status: error.response?.status,
      data: error.response?.data || error.message,
    }),
);

export default instance;
