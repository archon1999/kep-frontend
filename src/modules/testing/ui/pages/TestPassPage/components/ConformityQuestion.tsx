import { useTranslation } from 'react-i18next';
import { MenuItem, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { TestPassQuestion } from '../types';
import QuestionHeader from './QuestionHeader';
import SortableList from './SortableList';

interface ConformityQuestionProps {
  question: TestPassQuestion;
  groupOne: string[];
  groupTwo: string[];
  onChange: (payload: { groupOne?: string[]; groupTwo?: string[] }) => void;
}

const ConformityQuestion = ({
  question,
  groupOne,
  groupTwo,
  onChange,
}: ConformityQuestionProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isTouchDevice = useMediaQuery('(pointer: coarse)');

  const handleMatch = (index: number, selectedIndex: number) => {
    if (
      !Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= groupTwo.length ||
      index >= groupTwo.length ||
      index === selectedIndex
    ) {
      return;
    }
    const next = [...groupTwo];
    [next[index], next[selectedIndex]] = [next[selectedIndex], next[index]];
    onChange({ groupTwo: next });
  };

  return (
    <Stack direction="column" spacing={3}>
      <QuestionHeader question={question} />
      {isSmallScreen || isTouchDevice ? (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {t('tests.matchingHint')}
          </Typography>
          {groupOne.map((item, index) => (
            <Stack
              key={`${item}-${groupOne.slice(0, index).filter((value) => value === item).length}`}
              spacing={1.25}
              sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
            >
              <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                {item}
              </Typography>
              <TextField
                select
                fullWidth
                value={index < groupTwo.length ? index : ''}
                disabled={index >= groupTwo.length}
                onChange={(event) => handleMatch(index, Number(event.target.value))}
                slotProps={{
                  select: {
                    inputProps: { 'aria-label': t('tests.matchingLabel', { item }) },
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 320, maxWidth: 'calc(100% - 32px)' } },
                    },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': { minHeight: 48 },
                  '& .MuiSelect-select': {
                    whiteSpace: 'normal',
                    overflowWrap: 'anywhere',
                    lineHeight: 1.5,
                    py: 1.25,
                    fontSize: 16,
                  },
                }}
              >
                {groupTwo.map((value, optionIndex) => (
                  <MenuItem
                    key={optionIndex}
                    value={optionIndex}
                    sx={{ minHeight: 44, whiteSpace: 'normal', overflowWrap: 'anywhere' }}
                  >
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {t('tests.reorderHint')}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Stack direction="column" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {question.options?.[0]?.optionMain || ''}
              </Typography>
              <SortableList
                items={groupOne}
                dragScope={`conformity:${question.id}:${question.number}:group-one`}
                onChange={(items) => onChange({ groupOne: items })}
              />
            </Stack>
            <Stack direction="column" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {question.options?.[0]?.optionSecondary || ''}
              </Typography>
              <SortableList
                items={groupTwo}
                dragScope={`conformity:${question.id}:${question.number}:group-two`}
                onChange={(items) => onChange({ groupTwo: items })}
              />
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ConformityQuestion;
