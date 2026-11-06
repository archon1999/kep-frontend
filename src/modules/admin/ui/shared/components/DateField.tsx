import { DatePicker, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { AdminField } from 'modules/admin/domain';
import { parseDateTimePickerValue } from 'shared/lib/dateTime';

export default function DateField({
  field,
  label,
  value,
  error,
  help,
  disabled,
  onChange,
}: {
  field: AdminField;
  label: string;
  value: unknown;
  error: boolean;
  help?: string;
  disabled?: boolean;
  onChange: (value: string | null) => void;
}) {
  const Picker =
    field.kind === 'datetime' ? DateTimePicker : field.kind === 'time' ? TimePicker : DatePicker;
  const format =
    field.kind === 'datetime'
      ? 'YYYY-MM-DDTHH:mm:ssZ'
      : field.kind === 'time'
        ? 'HH:mm:ss'
        : 'YYYY-MM-DD';
  const date = value
    ? field.kind === 'time'
      ? dayjs('2000-01-01T' + String(value))
      : parseDateTimePickerValue(String(value))
    : null;

  return (
    <Picker
      label={label}
      value={date}
      disabled={disabled}
      readOnly={field.readOnly}
      onChange={(next) => onChange(next ? next.format(format) : null)}
      slotProps={{
        textField: {
          name: field.name,
          size: 'small',
          fullWidth: true,
          required: field.required,
          error,
          helperText: help,
        },
      }}
    />
  );
}
