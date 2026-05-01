import { Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import QuestionHeader from './QuestionHeader';
import { ClassificationGroup, TestPassQuestion } from '../types';

interface ClassificationQuestionProps {
  question: TestPassQuestion;
  groups: ClassificationGroup[];
  onChange: (groups: ClassificationGroup[]) => void;
}

const ClassificationQuestion = ({ question, groups, onChange }: ClassificationQuestionProps) => {
  const { t } = useTranslation();
  const [dragSource, setDragSource] = useState<{ groupIndex: number; itemIndex: number } | null>(
    null,
  );

  const handleDrop = (targetGroupIndex: number, targetIndex?: number) => {
    if (!dragSource) {
      return;
    }

    const updated = groups.map((group) => ({ ...group, values: [...group.values] }));
    const [item] = updated[dragSource.groupIndex].values.splice(dragSource.itemIndex, 1);
    const insertionIndex =
      typeof targetIndex === 'number'
        ? targetIndex
        : updated[targetGroupIndex].values.length;

    updated[targetGroupIndex].values.splice(insertionIndex, 0, item);
    setDragSource(null);
    onChange(updated);
  };

  return (
    <Stack direction="column" spacing={2}>
      <QuestionHeader question={question} />
      <Stack direction="column" spacing={2}>
        {groups.map((group, groupIndex) => (
          <Stack
            key={`${group.key}-${groupIndex}`}
            direction="column"
            spacing={1}
            sx={{
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(groupIndex)}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              {group.key || `Group ${groupIndex + 1}`}
            </Typography>
            <Stack direction="row" spacing={1}>
              {group.values.map((value, valueIndex) => (
                <Paper
                  key={`${value}-${valueIndex}`}
                  draggable
                  onDragStart={() => setDragSource({ groupIndex, itemIndex: valueIndex })}
                  onDrop={() => handleDrop(groupIndex, valueIndex)}
                  onDragOver={(event) => event.preventDefault()}
                  sx={{
                    px: 1.25,
                    py: 1,
                    cursor: 'grab',
                    userSelect: 'none',
                  }}
                >
                  <Typography variant="body2">{value}</Typography>
                </Paper>
              ))}
              {!group.values.length ? (
                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.25,
                    py: 1,
                    borderStyle: 'dashed',
                    color: 'text.secondary',
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(groupIndex)}
                >
                  <Typography variant="caption">{t('tests.dropHere')}</Typography>
                </Paper>
              ) : null}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default ClassificationQuestion;
