export const getDuelErrorMessage = (error: unknown, fallback: string) => {
  const payload = (error as any)?.response?.data ?? (error as any)?.data;
  if (typeof payload?.detail === 'string') return payload.detail;
  if (typeof payload?.message === 'string') return payload.message;

  if (payload && typeof payload === 'object') {
    for (const value of Object.values(payload)) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
  }

  return (error as any)?.message || fallback;
};
