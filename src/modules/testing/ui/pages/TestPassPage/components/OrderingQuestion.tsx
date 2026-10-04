import { useTranslation } from 'react-i18next';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { TestPassQuestion } from '../types';
import QuestionHeader from './QuestionHeader';
import SortableList from './SortableList';

interface OrderingQuestionProps {
  question: TestPassQuestion;
  ordering: string[];
  onChange: (items: string[]) => void;
}

const OrderingQuestion = ({ question, ordering, onChange }: OrderingQuestionProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isTouchDevice = useMediaQuery('(pointer: coarse)');

  return (
    <Stack direction="column" spacing={3}>
      <QuestionHeader question={question} />
      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary">
          {t(isSmallScreen || isTouchDevice ? 'tests.reorderTouchHint' : 'tests.reorderHint')}
        </Typography>
        <SortableList items={ordering} onChange={onChange} />
      </Stack>
    </Stack>
  );
};

export default OrderingQuestion;
