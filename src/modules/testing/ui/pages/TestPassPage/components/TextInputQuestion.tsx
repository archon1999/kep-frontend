import { useTranslation } from 'react-i18next';
import { Stack, TextField } from '@mui/material';
import { TestPassQuestion } from '../types';
import QuestionHeader from './QuestionHeader';

interface TextInputQuestionProps {
  question: TestPassQuestion;
  value: string;
  onChange: (value: string) => void;
}

const TextInputQuestion = ({ question, value, onChange }: TextInputQuestionProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" spacing={3}>
      <QuestionHeader question={question} />
      <TextField
        variant="outlined"
        label={t('tests.answerLabel')}
        placeholder={t('tests.answerPlaceholder')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        fullWidth
        slotProps={{
          htmlInput: {
            autoCapitalize: 'off',
            autoCorrect: 'off',
            autoComplete: 'off',
            spellCheck: false,
          },
        }}
        sx={{ '& .MuiInputBase-input': { fontSize: { xs: 16, md: 14 } } }}
      />
    </Stack>
  );
};

export default TextInputQuestion;
