import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, InputAdornment, SvgIcon, TextField, TextFieldProps } from '@mui/material';

const PasswordTextField = ({ ref, ...props }: TextFieldProps) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggleLabel = t(isPasswordVisible ? 'auth.hidePassword' : 'auth.showPassword');

  return (
    <TextField
      type={isPasswordVisible ? 'text' : 'password'}
      ref={ref}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label={toggleLabel}
                aria-controls={props.id}
                title={toggleLabel}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setIsPasswordVisible((visible) => !visible)}
              >
                <SvgIcon>
                  {isPasswordVisible ? (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0-9a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                  ) : (
                    <path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5c0 .71-.14 1.39-.39 2.01l3.21 3.21A11.83 11.83 0 0 0 23 12c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.38 2.38c.5-.15 1.04-.23 1.6-.23zm-9-2.23 2.1 2.1.42.42A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.31 4.38-.87l.4.4 2.72 2.72 1.27-1.27-16.5-16.5zM7.53 8.8l1.7 1.7c-.13.37-.23.88-.23 1.5a3 3 0 0 0 3 3c.62 0 1.13-.1 1.5-.23l1.7 1.7c-.92.64-2.02 1.03-3.2 1.03a5.5 5.5 0 0 1-5.5-5.5c0-1.18.39-2.28 1.03-3.2zM12.1 9l2.9 2.9v-.15a2.85 2.85 0 0 0-2.85-2.85h-.05z" />
                  )}
                </SvgIcon>
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
};

export default PasswordTextField;
