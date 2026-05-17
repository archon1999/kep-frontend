import { ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { ConfigType, Dayjs, ManipulateType, OpUnitType, QUnitType } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import 'dayjs/locale/uz';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export type DateTimeInput = ConfigType | null | undefined;
export type SupportedDateLocale = 'en-US' | 'ru-RU' | 'uz-UZ';
export type DateTimePickerValue = Dayjs | null;

type DateTimeFallback = string;

const DEFAULT_LOCALE: SupportedDateLocale = 'en-US';
const DEFAULT_EMPTY_VALUE = '-';
const INVALID_EMPTY_VALUE = '';

const DAYJS_LOCALE_BY_LOCALE: Record<SupportedDateLocale, string> = {
  'en-US': 'en',
  'ru-RU': 'ru',
  'uz-UZ': 'uz',
};

const USER_FACING_FORMATS = {
  compactDateTime: 'DD MMM, HH:mm',
  compactDate: 'DD MMM, YYYY',
  compactDateNoComma: 'DD MMM YYYY',
  compactDateTimeNoComma: 'DD MMM YYYY, HH:mm',
  profileDate: 'MMM DD, YYYY',
  fullDate: 'DD MMMM, YYYY',
  weekdayFullDate: 'dddd, MMM DD, YYYY',
  activityDateTime: 'MMM DD, YYYY HH:mm',
  monthYear: 'MMMM YYYY',
  monthLong: 'MMMM',
  dayMonth: 'DD MMM',
  monthDay: 'MMM D',
  monthDayYear: 'MMM D, YYYY',
  longMonthDay: 'MMMM D',
  weekday: 'dddd',
  time: 'HH:mm',
} as const;

const MACHINE_FORMATS = {
  isoDate: 'YYYY-MM-DD',
  isoDateTimeMinute: 'YYYY-MM-DD HH:mm',
  slashDate: 'DD/MM/YYYY',
  otpTimer: 'm:ss',
  monthShort: 'MMM',
} as const;

export type UserFacingDateTimeFormat = keyof typeof USER_FACING_FORMATS;
export type MachineDateTimeFormat = keyof typeof MACHINE_FORMATS;

const normalizeLocale = (value?: string | null): SupportedDateLocale => {
  const normalized = `${value ?? ''}`.trim().replace('_', '-').toLowerCase();

  if (normalized.startsWith('ru')) return 'ru-RU';
  if (normalized.startsWith('uz')) return 'uz-UZ';
  if (normalized.startsWith('en')) return 'en-US';

  return DEFAULT_LOCALE;
};

export const getCurrentDateLocale = (): SupportedDateLocale => {
  try {
    const storedLocale = localStorage.getItem('locale');
    return normalizeLocale(storedLocale);
  } catch {
    return DEFAULT_LOCALE;
  }
};

export const configureDateTimeLocale = (locale?: string | null) => {
  const normalizedLocale = normalizeLocale(locale ?? getCurrentDateLocale());
  const dayjsLocale = DAYJS_LOCALE_BY_LOCALE[normalizedLocale];
  dayjs.locale(dayjsLocale);

  return normalizedLocale;
};

const toDateTime = (value?: DateTimeInput): Dayjs | null => {
  if (value === null || value === undefined || value === '') return null;

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const formatWithPattern = (
  value: DateTimeInput,
  pattern: string,
  fallback: DateTimeFallback,
) => {
  const parsed = toDateTime(value);
  if (!parsed) return fallback;

  configureDateTimeLocale();
  return parsed.format(pattern);
};

export const formatDateTime = (
  value: DateTimeInput,
  format: UserFacingDateTimeFormat = 'compactDateTime',
  fallback: DateTimeFallback = DEFAULT_EMPTY_VALUE,
) => formatWithPattern(value, USER_FACING_FORMATS[format], fallback);

export const formatMachineDateTime = (
  value: DateTimeInput,
  format: MachineDateTimeFormat = 'isoDateTimeMinute',
  fallback: DateTimeFallback = DEFAULT_EMPTY_VALUE,
) => formatWithPattern(value, MACHINE_FORMATS[format], fallback);

export const formatDateTimePattern = (
  value: DateTimeInput,
  pattern: string,
  fallback: DateTimeFallback = DEFAULT_EMPTY_VALUE,
) => formatWithPattern(value, pattern, fallback);

export const formatDateTimeOrOriginal = (
  value: string | null | undefined,
  format: UserFacingDateTimeFormat = 'compactDate',
  fallback: DateTimeFallback = DEFAULT_EMPTY_VALUE,
) => {
  if (!value) return fallback;

  const parsed = toDateTime(value);
  if (!parsed) return value;

  configureDateTimeLocale();
  return parsed.format(USER_FACING_FORMATS[format]);
};

export const formatRelativeTime = (
  value: DateTimeInput,
  fallback: DateTimeFallback = DEFAULT_EMPTY_VALUE,
) => {
  const parsed = toDateTime(value);
  if (!parsed) return fallback;

  configureDateTimeLocale();
  return parsed.fromNow();
};

export const formatCalendarDateTime = (
  value: DateTimeInput,
  fallback: DateTimeFallback = DEFAULT_EMPTY_VALUE,
) => {
  const parsed = toDateTime(value);
  if (!parsed) return fallback;

  const date = parsed.toDate();

  try {
    return new Intl.DateTimeFormat(getCurrentDateLocale(), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
};

export const formatAdminDateTimeValue = (
  value: DateTimeInput,
  fallback: DateTimeFallback = INVALID_EMPTY_VALUE,
) => {
  const parsed = toDateTime(value);
  if (!parsed) return fallback;

  const date = parsed.toDate();
  const locale = getCurrentDateLocale();
  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${date.getDate()} ${month} ${date.getFullYear()}, ${time}`;
};

export const formatDateInputValue = (
  value: DateTimeInput,
  fallback: DateTimeFallback = INVALID_EMPTY_VALUE,
) => formatMachineDateTime(value, 'isoDate', fallback);

export const formatDateTimeLocalInputValue = (
  value: DateTimeInput,
  fallback: DateTimeFallback = INVALID_EMPTY_VALUE,
) => {
  const parsed = toDateTime(value);
  if (!parsed) return fallback;

  return parsed.format('YYYY-MM-DDTHH:mm');
};

export const parseDateTimePickerValue = (value?: DateTimeInput): DateTimePickerValue =>
  toDateTime(value);

export const formatDateTimePickerValue = (
  value: DateTimePickerValue,
  fallback: DateTimeFallback = INVALID_EMPTY_VALUE,
) => formatDateTimeLocalInputValue(value, fallback);

export const toBackendOffsetDateTime = (value: string) => {
  const parsed = toDateTime(value);
  if (!parsed) return value;

  return parsed.format('YYYY-MM-DDTHH:mm:ssZ');
};

export const toBackendUtcDateTime = (value: string) => {
  const parsed = toDateTime(value);
  if (!parsed) return INVALID_EMPTY_VALUE;

  return parsed.toDate().toISOString();
};

export const getCountdownParts = (diffMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

export const formatCountdownClock = (diffMs: number) => {
  const { hours, minutes, seconds } = getCountdownParts(diffMs);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatCompactDuration = (seconds: number) => `${Math.max(0, seconds)}s`;

export const formatOtpTimer = (seconds: number) =>
  formatMachineDateTime(seconds * 1000, 'otpTimer', '0:00');

export const getDateTimeValue = (value?: DateTimeInput) => toDateTime(value)?.valueOf() ?? 0;

export const diffDateTime = (
  value: DateTimeInput,
  compareValue?: DateTimeInput,
  unit?: QUnitType | OpUnitType,
  float?: boolean,
) => {
  const parsed = toDateTime(value);
  const compare = toDateTime(compareValue ?? undefined) ?? dayjs();

  if (!parsed) return 0;
  return parsed.diff(compare, unit, float);
};

export const isBeforeNow = (value?: DateTimeInput) => {
  const parsed = toDateTime(value);
  return parsed ? parsed.isBefore(dayjs()) : false;
};

export const isAfterNow = (value?: DateTimeInput) => {
  const parsed = toDateTime(value);
  return parsed ? parsed.isAfter(dayjs()) : false;
};

export const getDateYear = (value?: DateTimeInput) => toDateTime(value)?.year();

export const getDateWeekday = (value?: DateTimeInput) => toDateTime(value)?.day() ?? 0;

export const getCurrentYear = () => dayjs().year();

export const subtractFromNow = (amount: number, unit: ManipulateType) =>
  dayjs().subtract(amount, unit).toDate();

export const addDateTime = (value: DateTimeInput, amount: number, unit: ManipulateType) =>
  toDateTime(value)?.add(amount, unit) ?? null;

export const subtractDateTime = (value: DateTimeInput, amount: number, unit: ManipulateType) =>
  toDateTime(value)?.subtract(amount, unit) ?? null;

export const formatDateRange = (
  start: DateTimeInput,
  end: DateTimeInput,
  fallback: DateTimeFallback = DEFAULT_EMPTY_VALUE,
) => {
  const startDate = toDateTime(start);
  const endDate = toDateTime(end);

  if (!startDate) return fallback;
  if (!endDate) return formatDateTime(startDate, 'monthYear', fallback);

  const adjustedEnd = endDate.subtract(1, 'day');

  if (startDate.isSame(adjustedEnd, 'day')) {
    return formatDateTime(startDate, 'fullDate', fallback);
  }

  if (!startDate.isSame(adjustedEnd, 'month')) {
    return `${formatDateTime(startDate, 'monthDay', fallback)} - ${formatDateTime(
      adjustedEnd,
      'fullDate',
      fallback,
    )}`;
  }

  return formatDateTime(startDate, 'monthYear', fallback);
};

export const isToday = (value: DateTimeInput) => {
  const parsed = toDateTime(value);
  return parsed ? dayjs().diff(parsed, 'days') === 0 : false;
};

export const DateTimeLocalizationProvider = ({ children }: { children: ReactNode }) => {
  const locale = configureDateTimeLocale();

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={DAYJS_LOCALE_BY_LOCALE[locale]}
    >
      {children}
    </LocalizationProvider>
  );
};
