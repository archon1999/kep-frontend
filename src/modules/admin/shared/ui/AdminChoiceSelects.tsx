import { ChangeEvent } from 'react';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { AdminChoiceOption } from '../domain/types';

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
    <TextField select value={value} onChange={handleChange} {...textFieldProps}>
      {nullable ? <MenuItem value="">{emptyLabel ?? '-'}</MenuItem> : null}
      {options.map((option) => (
        <MenuItem key={String(option.value)} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export const VerdictSelect = (props: AdminChoiceSelectProps) => <AdminChoiceSelect {...props} />;

export const LanguageSelect = (props: AdminChoiceSelectProps) => <AdminChoiceSelect {...props} />;
