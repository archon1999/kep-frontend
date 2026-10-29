export const validationMessage = (value: unknown): string => {
  if (value == null) return '';
  if (value instanceof Error) return value.message;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(validationMessage).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (record.message) return validationMessage(record.message);
    if (record.detail) return validationMessage(record.detail);
    return Object.values(record).map(validationMessage).filter(Boolean).join(' ');
  }
  return '';
};

export class AdminFailure extends Error {
  constructor(
    readonly status: number,
    readonly issues: Record<string, unknown>,
  ) {
    super(validationMessage(issues));
    this.name = 'AdminFailure';
  }
}
