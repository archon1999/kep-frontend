import type { AdminInlineRow } from '../entities/console.types';

/** Django formsets validate existing rows first, then new rows that were not removed. */
export const inlineRowErrors = (
  changes: Record<string, AdminInlineRow>,
  error: unknown,
): Record<string, Record<string, unknown>> => {
  if (!error || typeof error !== 'object' || !('rows' in error) || !Array.isArray(error.rows))
    return {};
  const rows = Object.values(changes);
  const errorsByIndex = error.rows;
  const submitted = [
    ...rows.filter((row) => row.id !== null),
    ...rows.filter((row) => row.id === null && !row.delete),
  ];
  const result: Record<string, Record<string, unknown>> = {};
  submitted.forEach((row, index) => {
    const id = row.id ?? row.clientId;
    const fields: unknown = errorsByIndex[index];
    if (
      id &&
      fields &&
      typeof fields === 'object' &&
      !Array.isArray(fields) &&
      Object.keys(fields).length
    )
      result[id] = fields as Record<string, unknown>;
  });
  return result;
};
