import { MenuItem, Stack, Typography } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import type { AttemptFilterOption } from 'modules/problems/domain/entities/problem.entity.ts';
import StyledTextField from 'shared/components/styled/StyledTextField.tsx';
import AttemptVerdict from './AttemptVerdict.tsx';
import type { VerdictKey } from './attemptVerdict.utils.ts';

interface VerdictSelectProps extends Omit<TextFieldProps, 'select' | 'value' | 'onChange'> {
  value: string;
  options: AttemptFilterOption[];
  anyLabel: string;
  onChange: (value: string) => void;
}

const VerdictSelect = ({
  value,
  options,
  anyLabel,
  onChange,
  SelectProps,
  ...textFieldProps
}: VerdictSelectProps) => {
  const selectedVerdict = options.find((option) => String(option.value) === value);

  return (
    <StyledTextField
      select
      value={value}
      fullWidth
      onChange={(event) => onChange(event.target.value)}
      SelectProps={{
        ...SelectProps,
        displayEmpty: true,
        renderValue: () =>
          selectedVerdict ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <AttemptVerdict
                verdict={selectedVerdict.value as VerdictKey}
                title={selectedVerdict.label}
                size="small"
              />
              <Typography variant="body2">{selectedVerdict.label}</Typography>
            </Stack>
          ) : (
            anyLabel
          ),
      }}
      {...textFieldProps}
    >
      <MenuItem value="">{anyLabel}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={String(option.value)}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AttemptVerdict verdict={option.value as VerdictKey} title={option.label} size="small" />
            <Typography variant="body2">{option.label}</Typography>
          </Stack>
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default VerdictSelect;
