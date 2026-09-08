import { Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DragEvent, useState } from 'react';
import QuestionHeader from './QuestionHeader';
import { ClassificationGroup, TestPassQuestion } from '../types';
import { DragLocation, moveClassificationItem } from '../dragAndDrop';

interface ClassificationQuestionProps {
  question: TestPassQuestion;
  groups: ClassificationGroup[];
  onChange: (groups: ClassificationGroup[]) => void;
}

const ClassificationQuestion = ({ question, groups, onChange }: ClassificationQuestionProps) => {
  const { t } = useTranslation();
  const [dragSource, setDragSource] = useState<DragLocation | null>(null);

  const handleDrop = (event: DragEvent, targetGroupIndex: number, targetIndex?: number) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dragSource) {
      return;
    }

    const updated = moveClassificationItem(groups, dragSource, targetGroupIndex, targetIndex);
    setDragSource(null);
    if (updated !== groups) {
      onChange(updated);
    }
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
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(event) => handleDrop(event, groupIndex)}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              {group.key || `Group ${groupIndex + 1}`}
            </Typography>
            <Stack direction="row" spacing={1}>
              {group.values.map((value, valueIndex) => (
                <Paper
                  key={`${value}-${group.values.slice(0, valueIndex).filter((item) => item === value).length}`}
                  draggable
                  onDragStart={(event) => {
                    event.stopPropagation();
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', 'classification-item');
                    setDragSource({ groupIndex, itemIndex: valueIndex });
                  }}
                  onDragEnd={() => setDragSource(null)}
                  onDrop={(event) => handleDrop(event, groupIndex, valueIndex)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.dataTransfer.dropEffect = 'move';
                  }}
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
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(event) => handleDrop(event, groupIndex)}
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
