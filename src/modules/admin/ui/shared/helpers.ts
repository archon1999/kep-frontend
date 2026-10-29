import type { TFunction } from 'i18next';
import type { AdminField, AdminResource } from 'modules/admin/domain';
import { AdminFailure, validationMessage } from 'modules/admin/domain/utils/validation';

export const resourceTitle = (t: TFunction, resource?: Pick<AdminResource, 'key' | 'name'>) =>
  resource
    ? t(`admin.console.resources.${resource.key.replace('.', '_')}`, {
        defaultValue: resource.name,
      })
    : t('admin.title');
export const fieldTitle = (t: TFunction, field: Pick<AdminField, 'name' | 'label'>) => {
  const suffix = field.name.match(/_(uz|ru|en)$/)?.[1];
  const name = suffix ? field.name.slice(0, -3) : field.name;
  const label = t(`admin.console.fields.${name}`, {
    defaultValue: field.label.replace(/ \[(uz|ru|en)\]$/i, ''),
  });
  return suffix ? `${label} · ${suffix.toUpperCase()}` : label;
};
export const actionTitle = (t: TFunction, name: string, fallback: string) =>
  t(`admin.console.actionNames.${name}`, {
    defaultValue: fallback.replace(/%\(verbose_name_plural\)s/g, ''),
  });
export const fieldHelp = (t: TFunction, field: Pick<AdminField, 'name' | 'help'>) =>
  t(`admin.console.hints.${field.name.replace(/_(uz|ru|en)$/, '')}`, { defaultValue: field.help });
export const recordPath = (resource: Pick<AdminResource, 'path'>, id: string) =>
  `${resource.path}/${encodeURIComponent(id)}`;

export const errorData = (error: unknown): Record<string, unknown> =>
  error instanceof AdminFailure ? error.issues : {};
export const errorText = validationMessage;
export const getFieldErrors = (error: unknown) =>
  (errorData(error).fields ?? {}) as Record<string, unknown>;
export const formatFieldValue = (value: unknown, kind: string): string => {
  if (value == null) return '';
  if (kind === 'json') return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  if (kind === 'array') return Array.isArray(value) ? value.join(', ') : String(value);
  if (kind === 'datetime')
    return String(value)
      .replace(' ', 'T')
      .replace(/([+-]\d\d:\d\d|Z)$/, '')
      .slice(0, 19);
  return String(value);
};
