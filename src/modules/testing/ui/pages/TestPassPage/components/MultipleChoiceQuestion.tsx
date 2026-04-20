import { Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import QuestionHeader from './QuestionHeader';
import { TestPassQuestion } from '../types';

interface MultipleChoiceQuestionProps {
  question: TestPassQuestion;
  selectedOptions: number[];
  onToggle: (index: number) => void;
}

const MultipleChoiceQuestion = ({
  question,
  selectedOptions,
  onToggle,
}: MultipleChoiceQuestionProps) => (
  <Stack direction="column" spacing={1}>
    <QuestionHeader question={question} />
    <FormGroup>
      {question.options?.map((option, index) => (
        <FormControlLabel
          key={`${option.option}-${index}`}
          control={
            <Checkbox
              checked={selectedOptions.includes(index)}
              onChange={() => onToggle(index)}
            />
          }
          label={option.option ?? option.optionSecondary ?? ''}
        />
      ))}
    </FormGroup>
  </Stack>
);

export default MultipleChoiceQuestion;
