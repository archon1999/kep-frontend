import { ComponentType } from 'react';
import { TextFieldProps } from '@mui/material';
import useDebouncedInput from 'shared/hooks/useDebouncedInput';
import SearchTextField from './SearchTextField';

type DebouncedTextFieldProps = Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange'> & {
  value: string;
  onValueChange: (value: string) => void;
  delay?: number;
  textFieldComponent?: ComponentType<TextFieldProps>;
};

const DebouncedTextField = ({
  value,
  onValueChange,
  delay = 300,
  textFieldComponent: TextFieldComponent = SearchTextField,
  onKeyDown,
  ...props
}: DebouncedTextFieldProps) => {
  const input = useDebouncedInput(value, onValueChange, delay);

  return (
    <TextFieldComponent
      {...props}
      {...(TextFieldComponent === SearchTextField ? { onClear: () => input.setValue('') } : {})}
      value={input.value}
      onChange={(event) => input.setValue(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key === 'Enter' && !event.defaultPrevented && !input.isComposing) input.commit();
      }}
      slotProps={{
        ...props.slotProps,
        htmlInput: (ownerState) => ({
          ...(typeof props.slotProps?.htmlInput === 'function'
            ? props.slotProps.htmlInput(ownerState)
            : props.slotProps?.htmlInput),
          onCompositionStart: () => input.setIsComposing(true),
          onCompositionEnd: () => input.setIsComposing(false),
        }),
      }}
    />
  );
};

export default DebouncedTextField;
