export type QueryHistoryMode = 'replace' | 'push';

export type QueryParamCodec<T> = {
  parse: (raw: string | null) => T | undefined;
  serialize: (value: T) => string | null;
  equals?: (left: T, right: T) => boolean;
};

export type QueryParamConfig<T> = QueryParamCodec<T> & {
  param?: string;
};

type NumberParamOptions = {
  min?: number;
  max?: number;
  integer?: boolean;
};

const shallowArrayEquals = <T>(left: readonly T[], right: readonly T[]) =>
  left.length === right.length && left.every((value, index) => Object.is(value, right[index]));

export const stringParam = (): QueryParamCodec<string> => ({
  parse: (raw) => {
    if (raw === null || raw.trim() === '') {
      return undefined;
    }

    return raw;
  },
  serialize: (value) => (typeof value === 'string' && value.trim() !== '' ? value : null),
});

export const numberParam = ({
  min,
  max,
  integer = true,
}: NumberParamOptions = {}): QueryParamCodec<number> => ({
  parse: (raw) => {
    if (raw === null || raw.trim() === '') {
      return undefined;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return undefined;
    }

    if (integer && !Number.isInteger(parsed)) {
      return undefined;
    }

    if (typeof min === 'number' && parsed < min) {
      return undefined;
    }

    if (typeof max === 'number' && parsed > max) {
      return undefined;
    }

    return parsed;
  },
  serialize: (value) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return null;
    }

    if (integer && !Number.isInteger(value)) {
      return null;
    }

    if (typeof min === 'number' && value < min) {
      return null;
    }

    if (typeof max === 'number' && value > max) {
      return null;
    }

    return String(value);
  },
});

export const enumParam = <const TValue extends string>(values: readonly TValue[]): QueryParamCodec<TValue> => ({
  parse: (raw) => {
    if (raw === null) {
      return undefined;
    }

    return values.includes(raw as TValue) ? (raw as TValue) : undefined;
  },
  serialize: (value) => (values.includes(value) ? value : null),
});

export const booleanFlagParam = (): QueryParamCodec<boolean> => ({
  parse: (raw) => {
    if (raw === null) {
      return undefined;
    }

    if (raw === '1' || raw === 'true') {
      return true;
    }

    if (raw === '0' || raw === 'false') {
      return false;
    }

    return undefined;
  },
  serialize: (value) => (value ? '1' : null),
});

const csvParam = <TItem>(
  itemCodec: QueryParamCodec<TItem>,
): QueryParamCodec<TItem[]> => ({
  parse: (raw) => {
    if (raw === null || raw.trim() === '') {
      return undefined;
    }

    const items = raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => itemCodec.parse(item))
      .filter((item): item is TItem => item !== undefined);

    return items;
  },
  serialize: (value) => {
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    const serialized = value
      .map((item) => itemCodec.serialize(item))
      .filter((item): item is string => Boolean(item));

    return serialized.length ? serialized.join(',') : null;
  },
  equals: shallowArrayEquals,
});

export const stringArrayParam = () => csvParam(stringParam());

export const numberArrayParam = (options?: NumberParamOptions) => csvParam(numberParam(options));
