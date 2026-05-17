export const toNumberOrNull = (value: string | number | null | undefined) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? null : numberValue;
};

export const toOptionalNumber = (value: string | number | null | undefined) =>
  toNumberOrNull(value) ?? undefined;
