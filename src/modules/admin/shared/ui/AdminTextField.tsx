import { forwardRef } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import StyledTextField from 'shared/components/styled/StyledTextField';

const AdminTextField = forwardRef<HTMLDivElement, TextFieldProps>(
  ({ label, placeholder, slotProps, variant = 'outlined', ...rest }, ref) => {
    const resolvedPlaceholder = placeholder ?? (typeof label === 'string' ? label : undefined);
    const resolvedSlotProps = slotProps
      ? {
          ...slotProps,
          inputLabel: {
            ...(slotProps as TextFieldProps['slotProps'])?.inputLabel,
            shrink: true,
          },
        }
      : { inputLabel: { shrink: true } };

    return (
      <StyledTextField
        ref={ref}
        label={label}
        placeholder={resolvedPlaceholder}
        variant={variant}
        slotProps={resolvedSlotProps}
        {...rest}
      />
    );
  },
);

AdminTextField.displayName = 'AdminTextField';

export default AdminTextField;
