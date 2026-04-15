import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import QuestionHeader from './QuestionHeader';
import { TestPassQuestion } from '../types';

interface SingleChoiceQuestionProps {
  question: TestPassQuestion;
  selectedOption: number;
  onChange: (index: number) => void;
}

const getSelectedBackground = (theme: Theme, chapterId?: number) => {
  const colors = [
    theme.vars.palette.primary.main,
    theme.vars.palette.success.main,
    theme.vars.palette.warning.main,
    theme.vars.palette.info.main,
    theme.vars.palette.error.main,
    theme.vars.palette.secondary.main,
  ];
  const index = Math.abs((chapterId ?? 1) - 1) % colors.length;
  return colors[index];
};

const SingleChoiceQuestion = ({ question, selectedOption, onChange }: SingleChoiceQuestionProps) => {
  const options = question.options ?? [];
  const columns = options.length === 3 ? 3 : 2;

  return (
    <Stack direction="column" spacing={1}>
      <QuestionHeader question={question} />
      <Box
        role="radiogroup"
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          const label = option.option ?? option.optionSecondary ?? '';

          return (
            <ButtonBase
              key={option.id ?? `${label}-${index}`}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(index)}
              sx={(theme) => ({
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center',
                minHeight: 72,
                p: 2,
                textAlign: 'center',
                width: '100%',
                borderRadius: 1,
                boxShadow: theme.shadows[3],
                color: isSelected
                  ? theme.vars.palette.common.white
                  : theme.vars.palette.text.primary,
                backgroundColor: isSelected
                  ? getSelectedBackground(theme, question.chapter?.id)
                  : theme.vars.palette.background.elevation1,
                transition: theme.transitions.create(['background-color', 'color', 'transform']),
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                '&:focus-visible': {
                  outline: `2px solid ${theme.vars.palette.primary.main}`,
                  outlineOffset: 2,
                },
              })}
            >
              <Typography
                variant="h6"
                color="inherit"
                fontWeight={500}
                sx={{ overflowWrap: 'anywhere', width: '100%' }}
              >
                {label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Stack>
  );
};

export default SingleChoiceQuestion;
