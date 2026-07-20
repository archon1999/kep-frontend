import axios, { type AxiosInstance, type AxiosRequestHeaders, type InternalAxiosRequestConfig } from 'axios';
import { getStoredLocale, toBackendLanguage } from 'app/locales/locale.ts';
import { apiEndpoints } from 'app/routes/route-config';
import { getCurrentReturnUrl, getLoginRedirectPath } from 'shared/lib/authRedirect';

const baseURL = import.meta.env.VITE_API_URL || '';
const basicAuthLogin = import.meta.env.VITE_BASIC_AUTH_LOGIN;
const basicAuthPassword = import.meta.env.VITE_BASIC_AUTH_PASSWORD;
const shouldUseBasicAuth = import.meta.env.DEV;
const authBootstrapEndpoints = new Set([
  apiEndpoints.profile,
  apiEndpoints.login,
  apiEndpoints.logout,
]);

const getBasicAuthHeader = () => {
  if (!basicAuthLogin || !basicAuthPassword) return null;

  const encodedCredentials = btoa(`${basicAuthLogin}:${basicAuthPassword}`);

  return `Basic ${encodedCredentials}`;
};

export const instance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  timeout: 10000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers: AxiosRequestHeaders = config.headers ?? {};
    const params = config.params ?? {};
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    const locale = getStoredLocale();
    const djangoLanguage = toBackendLanguage(locale);
    headers['Accept-Language'] = locale;
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
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';
    const pathname = requestUrl.startsWith('http')
      ? new URL(requestUrl).pathname
      : requestUrl.split('?')[0];
    const shouldRedirectToLogin =
      status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith(apiEndpoints.login.replace('/api', '').replace(/\/$/, '')) &&
      !authBootstrapEndpoints.has(pathname);

    if (shouldRedirectToLogin) {
      window.location.assign(getLoginRedirectPath(getCurrentReturnUrl()));
    }

    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data || error.message,
    });
  },
);

export default instance;
