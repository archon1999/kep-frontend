import type { SortModel } from 'shared/lib/grid-state';

type AdminSimpleRow = {
  id: number | string;
  [key: string]: any;
};

type AdminFieldValueType = 'string' | 'number';
type AdminFieldSection = 'main' | 'sidebar';
type AdminAutocompleteFieldKind = 'user' | 'problem' | 'contest' | 'team';

interface AdminFilterConfig {
  name: string;
  labelKey: string;
  kind: 'text' | 'number' | 'select' | 'nullableBoolean' | AdminAutocompleteFieldKind;
  choicesKey?: string;
  valueType?: AdminFieldValueType;
}

interface AdminFormFieldConfig {
  name: string;
  labelKey: string;
  kind:
    | 'text'
    | 'number'
    | 'textarea'
    | 'checkbox'
    | 'select'
    | 'richText'
    | 'dateTime'
    | AdminAutocompleteFieldKind;
  section?: AdminFieldSection;
  choicesKey?: string;
  valueType?: AdminFieldValueType;
  nullable?: boolean;
  omitWhenEmpty?: boolean;
  required?: boolean;
  minRows?: number;
  minHeight?: number;
  usernameField?: string;
  labelField?: string;
  readOnly?: boolean;
}

interface AdminTranslatedFieldConfig {
  baseName: string;
  labelKey: string;
  kind: 'text' | 'richText';
  fallbackName?: string;
  minHeight?: number;
}

export interface AdminResourceOperationsConfig {
  resource: string;
  listPath: string;
  metaResource?: string;
  defaultSortModel?: SortModel;
  filters?: AdminFilterConfig[];
  fields: AdminFormFieldConfig[];
  translatedFields?: AdminTranslatedFieldConfig[];
  defaultValues: Record<string, any>;
  confirmDeleteKey: string;
  createTitleKey: string;
}
export type ConfirmAdminAction = (message: string) => Promise<boolean>;
export type AdminResourceAction = { action: string; confirmKey?: string };
export type {
  AdminSimpleRow,
  AdminFilterConfig,
  AdminFormFieldConfig,
  AdminTranslatedFieldConfig,
  AdminAutocompleteFieldKind,
};
