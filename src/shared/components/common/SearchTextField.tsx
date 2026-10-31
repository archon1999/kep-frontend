import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, InputAdornment, TextFieldProps } from '@mui/material';
import { useForkRef } from '@mui/material/utils';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';

export type SearchTextFieldProps = TextFieldProps & { onClear?: () => void };

const SearchTextField = ({
  slotProps,
  sx,
  inputRef,
  value,
  onClear,
  disabled,
  placeholder,
  ...rest
}: SearchTextFieldProps) => {
  const { t } = useTranslation();
  const fieldRef = useRef<HTMLInputElement>(null);
  const mergedRef = useForkRef(fieldRef, inputRef);
  const hint = placeholder ?? t('common.searchPlaceholder');

  return (
    <StyledTextField
      type="search"
      variant="outlined"
      size="small"
      autoComplete="off"
      placeholder={hint}
      {...rest}
      disabled={disabled}
      value={value}
      inputRef={mergedRef}
      sx={[
        {
          minWidth: 0,
          '& .MuiInputBase-root': {
            minHeight: 42,
            alignItems: 'center',
            gap: 0,
            bgcolor: 'background.default',
            '&:hover:not(.Mui-disabled), &.Mui-focused': { bgcolor: 'background.default' },
          },
          '& .MuiInputBase-input, & .MuiInputBase-sizeSmall > .MuiInputBase-input': {
            py: '10px',
            lineHeight: '20px',
            height: '20px',
          },
          '& .MuiInputAdornment-root': { m: 0, color: 'text.secondary' },
          '& .MuiInputAdornment-positionStart': { mr: 1.25 },
          '&:focus-within .MuiInputAdornment-positionStart': { color: 'primary.main' },
          '& input::-webkit-search-cancel-button': { WebkitAppearance: 'none' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      slotProps={{
        ...slotProps,
        htmlInput: (ownerState) => ({
          'aria-label': hint,
          ...(typeof slotProps?.htmlInput === 'function'
            ? slotProps.htmlInput(ownerState)
            : slotProps?.htmlInput),
        }),
        input: (ownerState) => {
          const input =
            typeof slotProps?.input === 'function' ? slotProps.input(ownerState) : slotProps?.input;
          const start = input && 'startAdornment' in input ? input.startAdornment : undefined;
          const end = input && 'endAdornment' in input ? input.endAdornment : undefined;
          const className = input && 'className' in input ? input.className : undefined;
          return {
            ...input,
            className: ['search-box-input', className].filter(Boolean).join(' '),
            startAdornment: start ?? (
              <InputAdornment position="start">
                <IconifyIcon icon="mdi:magnify" sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {end}
                {onClear && Boolean(value) && !disabled ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label={t('common.clearSearch')}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onClear();
                        fieldRef.current?.focus();
                      }}
                      sx={{ width: 28, height: 28 }}
                    >
                      <IconifyIcon icon="mdi:close" sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null}
              </>
            ),
          };
        },
      }}
    />
  );
};

export default SearchTextField;
