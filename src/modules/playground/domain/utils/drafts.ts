import type { Draft } from '../entities/run.types.ts';

const isDraft = (value: unknown): value is Draft =>
  Boolean(
    value &&
    typeof value === 'object' &&
    'code' in value &&
    typeof value.code === 'string' &&
    'input' in value &&
    typeof value.input === 'string',
  );

const parse = (raw: string | null): unknown => {
  try {
    return JSON.parse(raw ?? 'null');
  } catch {
    return null;
  }
};

/** Preserve the old KEPLang draft and complete source, including over-limit edits. */
export const decodeDrafts = (raw: string | null, legacy: string | null): Record<string, Draft> => {
  const parsed = parse(raw);
  const drafts =
    parsed && typeof parsed === 'object'
      ? Object.fromEntries(
          Object.entries(parsed).filter(
            ([key, value]) => /^[a-z]{1,10}$/.test(key) && isDraft(value),
          ),
        )
      : {};
  const old = parse(legacy);
  if (!drafts.kep && isDraft(old)) drafts.kep = { code: old.code, input: old.input };
  return drafts;
};
