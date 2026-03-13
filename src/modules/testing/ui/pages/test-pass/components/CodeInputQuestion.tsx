import { Stack, TextField } from '@mui/material';
import QuestionHeader from './QuestionHeader';
import { TestPassQuestion } from '../types';

interface CodeInputQuestionProps {
  question: TestPassQuestion;
  value: string;
  onChange: (value: string) => void;
}

const CodeInputQuestion = ({ question, value, onChange }: CodeInputQuestionProps) => (
  <Stack direction="column" spacing={2}>
    <QuestionHeader question={question} />
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth
      multiline
      minRows={8}
      InputProps={{
        sx: { fontFamily: 'monospace' },
      }}
    />
  </Stack>
);

export default CodeInputQuestion;
