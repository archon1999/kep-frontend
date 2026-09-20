import { Box, TextField, TextFieldProps } from '@mui/material';
import ClipboardButton from './ClipboardButton';

interface TextareaProps extends Omit<TextFieldProps, 'multiline'> {
  copyText?: string;
}

const Textarea = ({ copyText, value, sx, ...props }: TextareaProps) => {
  const text = copyText ?? (typeof value === 'string' || typeof value === 'number' ? String(value) : '');

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        {...props}
        multiline
        fullWidth
        value={value}
        sx={[
          {
            '& .MuiInputBase-inputMultiline': {
              pr: 5,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          zIndex: 1,
          borderRadius: '50%',
          bgcolor: 'background.paper',
        }}
      >
        <ClipboardButton text={text} iconOnly />
      </Box>
    </Box>
  );
};

export default Textarea;
