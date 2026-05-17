import { ChangeEvent } from 'react';
import { MenuItem } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { AdminChoiceOption } from '../helpers/types.ts';
import AdminTextField from './AdminTextField';

type AdminChoiceSelectValue = string | number | '';

interface AdminChoiceSelectProps
  extends Omit<TextFieldProps, 'select' | 'value' | 'onChange' | 'children'> {
  value: AdminChoiceSelectValue;
  onChange: (value: AdminChoiceSelectValue) => void;
  options: AdminChoiceOption[];
  emptyLabel?: string;
  nullable?: boolean;
  valueType?: 'string' | 'number';
}

const toChoiceValue = (value: string, valueType?: 'string' | 'number') => {
  if (value === '') {
    return '';
  }

  return valueType === 'number' ? Number(value) : value;
};

export const AdminChoiceSelect = ({
  value,
  onChange,
  options,
  emptyLabel,
  nullable,
  valueType,
  ...textFieldProps
}: AdminChoiceSelectProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(toChoiceValue(event.target.value, valueType));
  };

  return (
    <AdminTextField select value={value} onChange={handleChange} {...textFieldProps}>
      {nullable ? <MenuItem value="">{emptyLabel ?? '-'}</MenuItem> : null}
      {options.map((option) => (
        <MenuItem key={String(option.value)} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </AdminTextField>
  );
};

export const VerdictSelect = (props: AdminChoiceSelectProps) => <AdminChoiceSelect {...props} />;

export const LanguageSelect = (props: AdminChoiceSelectProps) => <AdminChoiceSelect {...props} />;
