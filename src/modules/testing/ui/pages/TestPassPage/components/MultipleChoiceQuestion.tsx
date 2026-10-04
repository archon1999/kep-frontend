import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { TestPassQuestion } from '../types';
import QuestionHeader from './QuestionHeader';

interface MultipleChoiceQuestionProps {
  question: TestPassQuestion;
  selectedOptions: number[];
  onToggle: (index: number) => void;
}

const MultipleChoiceQuestion = ({
  question,
  selectedOptions,
  onToggle,
}: MultipleChoiceQuestionProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" spacing={3}>
      <QuestionHeader question={question} />
      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary">
          {t('tests.multipleChoiceHint')}
        </Typography>
        <FormGroup aria-labelledby={`test-question-${question.number}`} sx={{ gap: 1.25 }}>
          {question.options?.map((option, index) => {
            const isSelected = selectedOptions.includes(index);

            return (
              <FormControlLabel
                key={option.id ?? index}
                control={
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={() => onToggle(index)}
                    sx={{ '& + .MuiFormControlLabel-label': { mt: 0 } }}
                  />
                }
                label={option.option ?? option.optionSecondary ?? ''}
                sx={{
                  m: 0,
                  py: 1.25,
                  pr: 2,
                  pl: 1,
                  minHeight: 56,
                  border: '1px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'primary.lighter' : 'transparent',
                  borderRadius: 2,
                  transition: (theme) =>
                    theme.transitions.create(['border-color', 'background-color']),
                  '&:hover': { borderColor: isSelected ? 'primary.main' : 'text.secondary' },
                  '&:focus-within': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                  },
                  '& .MuiFormControlLabel-label': {
                    mt: 0,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    overflowWrap: 'anywhere',
                  },
                }}
              />
            );
          })}
        </FormGroup>
      </Stack>
    </Stack>
  );
};

export default MultipleChoiceQuestion;
