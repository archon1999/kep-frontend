import type {
  AdminAutocompleteFieldKind,
  AdminFormFieldConfig,
  AdminSimpleRow,
} from 'modules/admin/shared/application/admin-resource-config';
import type { AdminAutocompleteOption } from 'modules/admin/shared/domain/autocomplete.types';
import { toNumberOrNull } from 'modules/admin/shared/utils/formUtils';
import { toBackendUtcDateTime } from 'shared/lib/dateTime';

const autocompleteFieldKinds: AdminAutocompleteFieldKind[] = ['user', 'problem', 'contest', 'team'];

const isAutocompleteFieldKind = (
  kind: AdminFormFieldConfig['kind'],
): kind is AdminAutocompleteFieldKind =>
  autocompleteFieldKinds.includes(kind as AdminAutocompleteFieldKind);

const getDefaultLabelField = (field: AdminFormFieldConfig) => {
  if (field.labelField) {
    return field.labelField;
  }

  if (field.kind === 'user') {
    return field.usernameField ?? `${field.name}Username`;
  }

  if (field.kind === 'problem' || field.kind === 'contest') {
    return `${field.name}Title`;
  }

  if (field.kind === 'team') {
    return `${field.name}Name`;
  }

  return field.name;
};

const buildAutocompleteOption = (
  field: AdminFormFieldConfig,
  id?: number | string | null,
  label?: string | null,
): AdminAutocompleteOption | null => {
  if (!id) {
    return null;
  }

  const option: AdminAutocompleteOption = { id: Number(id) };
  const resolvedLabel = label || `#${id}`;

  if (field.kind === 'user') {
    option.username = resolvedLabel;
  } else if (field.kind === 'problem' || field.kind === 'contest') {
    option.title = resolvedLabel;
  } else if (field.kind === 'team') {
    option.name = resolvedLabel;
  }

  return option;
};

const getRowLabelParams = (row: AdminSimpleRow) => ({
  id: row.id,
  name: row.name ?? row.title ?? row.username ?? row.code ?? row.id,
});

const toPayloadFieldValue = (value: any, field: AdminFormFieldConfig) => {
  if (field.kind === 'number') {
    return field.nullable ? toNumberOrNull(value) : Number(value || 0);
  }
  if (field.kind === 'dateTime') {
    return value ? toBackendUtcDateTime(value) : null;
  }
  if (isAutocompleteFieldKind(field.kind)) {
    return value || null;
  }
  return value;
};

export {
  autocompleteFieldKinds,
  isAutocompleteFieldKind,
  getDefaultLabelField,
  buildAutocompleteOption,
  getRowLabelParams,
  toPayloadFieldValue,
};
