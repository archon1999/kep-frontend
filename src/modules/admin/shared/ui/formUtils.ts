export const toNumberOrNull = (value: string | number | null | undefined) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? null : numberValue;
};

export const toOptionalNumber = (value: string | number | null | undefined) =>
  toNumberOrNull(value) ?? undefined;

export const toDateTimeLocal = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const fromDateTimeLocal = (value: string) => (value ? new Date(value).toISOString() : '');
