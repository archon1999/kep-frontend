import { Box } from '@mui/material';

export const ConsoleTextArea = ({
  label,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}) => (
  <Box
    component="textarea"
    aria-label={label}
    value={value}
    readOnly={readOnly}
    disabled={disabled}
    spellCheck={false}
    placeholder={placeholder}
    maxLength={maxLength}
    onChange={(event) => onChange?.(event.target.value)}
    sx={{
      display: 'block',
      width: '100%',
      height: '100%',
      minHeight: 90,
      boxSizing: 'border-box',
      resize: 'none',
      border: 0,
      borderRadius: 0,
      outline: 0,
      p: 2.5,
      pr: 6,
      background: 'transparent',
      color: 'text.primary',
      fontFamily: '"JetBrains Mono", Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.8,
      '&::placeholder': { color: 'text.disabled', opacity: 1 },
      '&:focus-visible': { boxShadow: 'inset 0 0 0 1px var(--kep-logo-ice)' },
    }}
  />
);
