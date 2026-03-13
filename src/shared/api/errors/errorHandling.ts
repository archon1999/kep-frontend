import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export type ValidationError = {
  field: string;
  message: string;
};

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  validationErrors?: ValidationError[];
};

export function normalizeError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    const responseData = err.response?.data as any;

    const validationErrors = Array.isArray(responseData?.errors)
      ? responseData.errors.filter(
          (error: unknown): error is ValidationError =>
            typeof error === 'object' && error !== null && 'field' in error && 'message' in error,
        )
      : undefined;

    return {
      status: responseData?.status,
      message: (responseData?.message as string) || err.message || 'Unknown error',
      code: responseData?.code,
      details: responseData?.errors,
      validationErrors,
    };
  }

  if (err instanceof Error) {
    return { message: err.message };
  }

  return { message: 'Unknown error' };
}

export function isCanceled(error: unknown) {
  return (error as { code?: string })?.code === 'ERR_CANCELED';
}

export function notifyError(error: ApiError) {
  if (error.validationErrors && error.validationErrors.length > 0) {
    const validationMessages = error.validationErrors.map((err) => `${err.message}`).join('\n');

    toast.error(error.message, {
      description: validationMessages,
      richColors: true,
    });
  } else {
    toast.error(error.message, {
      description: typeof error.details === 'object' ? JSON.stringify(error.details) : null,
      richColors: true,
    });
  }

  console.error('[RQ ERROR]', error);
}
