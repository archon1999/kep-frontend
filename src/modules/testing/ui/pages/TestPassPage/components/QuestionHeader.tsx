import { Box, Typography } from '@mui/material';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';
import { TestPassQuestion } from '../types';

interface QuestionHeaderProps {
  question: TestPassQuestion;
}

const QuestionHeader = ({ question }: QuestionHeaderProps) => (
  <Box
    id={`test-question-${question.number}`}
    sx={{
      minWidth: 0,
      overflowWrap: 'anywhere',
      '& p:first-of-type': { mt: 0 },
      '& p:last-of-type': { mb: 0 },
      '& img': { maxWidth: '100%', height: 'auto' },
      '& pre': { overflowX: 'auto' },
      '& table': { maxWidth: '100%' },
    }}
  >
    {question.body ? (
      <MathJaxView rawHtml={question.body} sx={{ fontSize: '1rem', lineHeight: 1.8 }} />
    ) : (
      <Typography variant="h6" fontWeight={500} lineHeight={1.6}>
        {question.text}
      </Typography>
    )}
  </Box>
);

export default QuestionHeader;
