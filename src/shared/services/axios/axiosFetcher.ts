import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

const axiosFetcher = async (
  args:
    | string
    | [string, AxiosRequestConfig]
    | [
        string,
        AxiosRequestConfig,
        {
          disableThrowError?: boolean;
          disableErrorToast?: boolean;
        },
      ],
  extraArg?: {
    arg: any;
  },
): Promise<any> => {
  const [url, config, extraConfig] = Array.isArray(args) ? args : [args];
  try {
    const response = await axiosInstance({
      url,
      method: config?.method || 'get',
      data: extraArg?.arg,
      ...config,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    // Error suppression belongs to this request, never the shared Axios instance.
    if (extraConfig?.disableThrowError) return null;
    throw error;
  }
};

export default axiosFetcher;
