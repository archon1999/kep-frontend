import { Stack, Typography } from '@mui/material';
import QuestionHeader from './QuestionHeader';
import SortableList from './SortableList';
import { TestPassQuestion } from '../types';

interface ConformityQuestionProps {
  question: TestPassQuestion;
  groupOne: string[];
  groupTwo: string[];
  onChange: (payload: { groupOne?: string[]; groupTwo?: string[] }) => void;
}

const ConformityQuestion = ({ question, groupOne, groupTwo, onChange }: ConformityQuestionProps) => (
  <Stack direction="column" spacing={2}>
    <QuestionHeader question={question} />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {question.options?.[0]?.optionMain || ''}
        </Typography>
        <SortableList items={groupOne} onChange={(items) => onChange({ groupOne: items })} />
      </Stack>
      <Stack direction="column" spacing={1} sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {question.options?.[0]?.optionSecondary || ''}
        </Typography>
        <SortableList items={groupTwo} onChange={(items) => onChange({ groupTwo: items })} />
      </Stack>
    </Stack>
  </Stack>
);

export default ConformityQuestion;
