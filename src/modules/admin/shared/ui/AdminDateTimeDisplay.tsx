import { ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { formatDateTime } from 'shared/lib/dateTime.tsx';

type AdminDateTimeValue = Date | string | null | undefined;

interface AdminDateTimeDisplayProps extends Omit<TypographyProps, 'children'> {
  value?: AdminDateTimeValue;
  emptyValue?: ReactNode;
}

const AdminDateTimeDisplay = ({
  value,
  emptyValue = '',
  color,
  ...props
}: AdminDateTimeDisplayProps) => {
  const formattedValue = formatDateTime(value, 'compactDateTimeNoComma');

  if (!formattedValue) {
    return (
      <Typography color={color ?? 'text.secondary'} variant="body2" {...props}>
        {emptyValue}
      </Typography>
    );
  }

  return (
    <Typography color={color ?? 'text.primary'} variant="body2" noWrap {...props}>
      {formattedValue}
    </Typography>
  );
};

export default AdminDateTimeDisplay;
