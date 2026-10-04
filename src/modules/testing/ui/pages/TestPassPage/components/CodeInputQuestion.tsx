import { useTranslation } from 'react-i18next';
import { Box, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { TestPassQuestion } from '../types';
import QuestionHeader from './QuestionHeader';

interface CodeInputQuestionProps {
  question: TestPassQuestion;
  value: string;
  onChange: (value: string) => void;
}

const CodeInputQuestion = ({ question, value, onChange }: CodeInputQuestionProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack direction="column" spacing={3}>
      <QuestionHeader question={question} />
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          '&:focus-within': { borderColor: 'primary.main' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 2,
            py: 1.25,
            bgcolor: 'background.elevation1',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconifyIcon
            icon="material-symbols:code-rounded"
            sx={{ fontSize: 18, color: 'text.secondary' }}
          />
          <Typography variant="body2" fontWeight={500}>
            {t('tests.codeAnswerLabel')}
          </Typography>
        </Stack>
        <TextField
          variant="outlined"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          fullWidth
          multiline
          minRows={isSmallScreen ? 6 : 8}
          maxRows={16}
          sx={{
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
              borderWidth: '0 !important',
            },
            '& .MuiInputBase-input': { fontSize: { xs: 16, md: 14 } },
          }}
          slotProps={{
            htmlInput: {
              'aria-label': t('tests.codeAnswerLabel'),
              spellCheck: false,
              autoCapitalize: 'off',
              autoCorrect: 'off',
              autoComplete: 'off',
            },
            input: {
              sx: {
                px: 2,
                py: 1.5,
                fontFamily: 'Consolas, "SFMono-Regular", monospace',
                fontSize: { xs: 16, md: 14 },
                lineHeight: 1.75,
                borderRadius: 0,
              },
            },
          }}
        />
      </Box>
    </Stack>
  );
};

export default CodeInputQuestion;
