import { Box, Typography } from '@mui/material';
import { TestPassQuestion } from '../types';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';

interface QuestionHeaderProps {
  question: TestPassQuestion;
}

const QuestionHeader = ({ question }: QuestionHeaderProps) => (
  <Box sx={{ mb: 2 }}>
    {/*<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>*/}
    {/*  {question.number}.*/}
    {/*</Typography>*/}
    {question.body ? (
      <MathJaxView rawHtml={question.body}/>
    ) : (
      <Typography variant="h6" fontWeight={700}>
        {question.text}
      </Typography>
    )}
  </Box>
);

export default QuestionHeader;
