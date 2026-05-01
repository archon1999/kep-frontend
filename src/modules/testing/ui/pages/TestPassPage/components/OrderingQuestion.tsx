import { Stack } from '@mui/material';
import QuestionHeader from './QuestionHeader';
import SortableList from './SortableList';
import { TestPassQuestion } from '../types';

interface OrderingQuestionProps {
  question: TestPassQuestion;
  ordering: string[];
  onChange: (items: string[]) => void;
}

const OrderingQuestion = ({ question, ordering, onChange }: OrderingQuestionProps) => (
  <Stack direction="column" spacing={2}>
    <QuestionHeader question={question} />
    <SortableList items={ordering} onChange={onChange} />
  </Stack>
);

export default OrderingQuestion;
