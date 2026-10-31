import { Box } from '@mui/material';
import type { AdminField, AdminOption, AdminValues } from 'modules/admin/domain';
import SchemaField from './SchemaField';

export interface EditorFieldsProps {
  resourceKey: string;
  recordId?: string;
  inline?: string;
  fields: AdminField[];
  values: AdminValues;
  selectedOptions?: Record<string, AdminOption[]>;
  errors?: Record<string, unknown>;
  disabled: boolean;
  files?: Record<string, unknown>;
  onChange: (name: string, value: unknown, selected?: AdminOption[]) => void;
  onUpload: (name: string, file: File | null) => void;
  singleColumn?: boolean;
  pairedTextareas?: boolean;
}

export default function EditorFields({
  fields,
  values,
  selectedOptions,
  errors = {},
  files = {},
  onChange,
  onUpload,
  singleColumn,
  pairedTextareas,
  ...props
}: EditorFieldsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: singleColumn ? '1fr' : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 2.5,
      }}
    >
      {fields.map((field) => (
        <Box
          key={field.name}
          data-admin-field={field.name}
          tabIndex={-1}
          sx={{
            minWidth: 0,
            gridColumn:
              ['richText', 'json', 'relations', 'file', 'image'].includes(field.kind) ||
              (field.kind === 'textarea' && !pairedTextareas) ||
              /^(title|name|username)/.test(field.name)
                ? '1 / -1'
                : undefined,
            outline: 'none',
          }}
        >
          <SchemaField
            {...props}
            field={field}
            value={values[field.name]}
            values={values}
            selected={selectedOptions?.[field.name]}
            error={errors[field.name]}
            pendingFile={files[field.name] instanceof File ? (files[field.name] as File) : null}
            onChange={(value, options) => onChange(field.name, value, options)}
            onUpload={(file) => onUpload(field.name, file)}
          />
        </Box>
      ))}
    </Box>
  );
}
