export type NumberFormatLocale = string | string[] | null | undefined;
export type NumberFormatOptions = Intl.NumberFormatOptions;

const DEFAULT_NUMBER_LOCALE = 'en-US';

export const normalizeNumberLocale = (value?: NumberFormatLocale) => {
  const normalized = Array.isArray(value)
    ? value.map((item) => item?.trim().replace('_', '-')).filter(Boolean)
    : value?.trim().replace('_', '-');

  try {
    const [canonical] = Intl.getCanonicalLocales(normalized || []);
    if (canonical && Intl.NumberFormat.supportedLocalesOf(canonical).length > 0) {
      return canonical;
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const createNumberFormatter = (
  options: NumberFormatOptions = {},
  locale?: NumberFormatLocale,
) => new Intl.NumberFormat(normalizeNumberLocale(locale), options);

export const formatLocalizedNumber = (
  value: number,
  options: NumberFormatOptions = {},
  locale?: NumberFormatLocale,
) => createNumberFormatter(options, locale).format(value);

export const formatInteger = (value: number, locale?: NumberFormatLocale) =>
  formatLocalizedNumber(value, { maximumFractionDigits: 0 }, locale);

export const formatDecimal = (
  value: number,
  maximumFractionDigits = 2,
  locale?: NumberFormatLocale,
) => formatLocalizedNumber(value, { maximumFractionDigits }, locale);

export const formatSignedDecimal = (
  value: number,
  maximumFractionDigits = 1,
  locale?: NumberFormatLocale,
) =>
  formatLocalizedNumber(
    value,
    {
      minimumFractionDigits: maximumFractionDigits,
      maximumFractionDigits,
      signDisplay: 'always',
    },
    locale,
  );

export const formatCurrency = (
  amount: number,
  locale: NumberFormatLocale = DEFAULT_NUMBER_LOCALE,
  options: NumberFormatOptions = {},
) =>
  createNumberFormatter(
    {
      style: 'currency',
      currency: 'usd',
      maximumFractionDigits: 2,
      ...options,
    },
    locale,
  ).format(amount);

export const getCurrencySymbol = (
  currency: string,
  locale: NumberFormatLocale = DEFAULT_NUMBER_LOCALE,
) => {
  const parts = createNumberFormatter({ style: 'currency', currency }, locale).formatToParts(0);
  return parts.find((part) => part.type === 'currency')?.value ?? '$';
};

export const numberFormat = (
  value: number,
  locale: NumberFormatLocale = DEFAULT_NUMBER_LOCALE,
  options: NumberFormatOptions = {
    notation: 'standard',
  },
) => createNumberFormatter(options, locale).format(value);
