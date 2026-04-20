import { Stack, TextField } from '@mui/material';
import QuestionHeader from './QuestionHeader';
import { TestPassQuestion } from '../types';

interface TextInputQuestionProps {
  question: TestPassQuestion;
  value: string;
  onChange: (value: string) => void;
}

const TextInputQuestion = ({ question, value, onChange }: TextInputQuestionProps) => (
  <Stack direction="column" spacing={2}>
    <QuestionHeader question={question} />
    <TextField variant="standard" value={value} onChange={(event) => onChange(event.target.value)} fullWidth />
  </Stack>
);

export default TextInputQuestion;
