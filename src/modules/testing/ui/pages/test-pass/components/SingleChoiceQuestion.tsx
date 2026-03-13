import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import QuestionHeader from './QuestionHeader';
import { TestPassQuestion } from '../types';

interface SingleChoiceQuestionProps {
  question: TestPassQuestion;
  selectedOption: number;
  onChange: (index: number) => void;
}

const SingleChoiceQuestion = ({ question, selectedOption, onChange }: SingleChoiceQuestionProps) => (
  <Stack direction="column" spacing={1}>
    <QuestionHeader question={question} />
    <RadioGroup
      value={selectedOption}
      onChange={(event) => onChange(Number((event.target as HTMLInputElement).value))}
    >
      {question.options?.map((option, index) => (
        <FormControlLabel
          key={`${option.option}-${index}`}
          value={index}
          control={<Radio />}
          label={option.option ?? option.optionSecondary ?? ''}
        />
      ))}
    </RadioGroup>
  </Stack>
);

export default SingleChoiceQuestion;
